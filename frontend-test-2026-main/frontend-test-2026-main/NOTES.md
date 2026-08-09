# Technical Notes — Feature Flag Editor

All challenge code lives in `src/pages/code-challenge/feature-flag-form/your-codes/`.

```
your-codes/
├── index.tsx                     entry point rendered by the challenge page
├── feature-flag-editor.tsx       two-column layout + mock save state
├── hooks/use-feature-flag-form.ts the single useForm instance (source of truth)
├── schemas/feature-flag.schema.ts Zod schema used as the form validator
├── types/feature-flag.ts          draft types (form shape) + serialized types (output shape)
├── constants/feature-flag.ts      operator/variation metadata + initial example flag
├── utils/
│   ├── feature-flag.ts            draft factories + serialization
│   └── form-error.ts              error extraction / path humanising
└── components/                    one component per responsibility (+ ui/ primitives)
```

## Fixing the design tokens (`src/styles.css`)

The starter imported `shadcn/tailwind.css`, a file the `shadcn` package does not ship, and
kept the `--color-*: var(--*)` mappings in a plain `:root` block. Tailwind v4 only turns
`@theme` entries into utilities, so **every token class in the app compiled to nothing** —
verified against the built stylesheet:

```
.bg-card -> 0   .border-border -> 0   .text-muted-foreground -> 0   .text-destructive -> 0
```

The visible symptom was a thick black focus ring: `focus-visible:ring-3` set a 3px ring
while `ring-ring/50` produced no colour, so `--tw-ring-color` fell back to `currentcolor`.
Error text was black for the same reason.

The fix: drop the dead import, move the mappings into `@theme inline` (so utilities keep
referencing `var(--x)` and still swap at runtime), add the light palette that never
existed, and key the dark palette off `:root.dark` — the same class the `dark:` variant
uses — so variables and utilities flip together, `auto` mode included.

## Colour system

One accent hue (**indigo**) carries every interactive affordance — primary action, add
buttons, count pills, hover/focus borders — so the eye learns a single "this is clickable"
colour. Everything else is reserved for meaning:

| Role                | Hue                | Where                                                   |
| :------------------ | :----------------- | :------------------------------------------------------ |
| brand / interactive | indigo             | Save button, add buttons, counts, focus + hover borders |
| enabled / saved     | emerald            | status toggle, saved panel, `valid` badge               |
| unsaved changes     | amber              | dirty pill, `invalid` badge                             |
| error               | destructive (rose) | field errors, validation summary, invalid label + ring  |

Sections are told apart by an icon chip and a faint header wash — indigo (details),
violet (variations), sky (targeting) — at 3–10% opacity, so the tint groups a section
without competing with the semantic colours inside it.

Required fields used to paint their label, hint _and_ input border red before the user did
anything wrong, which made a pristine form look broken. Red is now spent **only** on real
errors — required-ness is carried by `aria-required` and the schema, not by pre-emptive
colour — and every error message pairs the destructive colour with an alert icon so it does
not rely on hue alone. `FieldShell` drops its indigo hover/focus accent while a field is
invalid, so the destructive ring always wins.

`Attribute` is a `<select>` over `ATTRIBUTE_SUGGESTIONS`, matching `Operator`: the same
control for the same kind of choice. An unrecognised value coming from a loaded draft is
still rendered as a `(unknown)` option rather than being silently dropped.

Every colour is declared as a light/dark pair; nothing relies on a single-theme literal.

## Draft shape vs. output shape

The form state (`FeatureFlagDraft`) is deliberately **not** the same shape as the JSON output
(`SerializedFeatureFlag`):

- inputs are strings, so `value` stays a string in the draft and is coerced on serialization
  (variation `type` decides boolean/number/string; the operator decides text/number/string[]/omitted)
- `variations` is an **array** in the draft (order + stable `id` for React keys) and becomes a
  **record** in the output, which is what the JSON contract requires
- every array item carries an `id` so add/remove never remaps component state to the wrong row

`serializeFeatureFlag()` is the single boundary between the two. The JSON preview and the save
payload both go through it, so they can never disagree.

## Why there is no JSON state and no `useEffect`

`JsonPreview` renders inside `form.Subscribe` and computes
`JSON.stringify(serializeFeatureFlag(values), null, 2)` during render. The preview is a pure
function of form state — nothing to synchronise.

## Validation

One Zod schema is registered as the form-level validator (`onMount`/`onChange`/`onSubmit`).
TanStack Form maps each issue path (`variations[0].key`) onto the matching field, so cross-field
rules live in the schema rather than in components:

- duplicate variation keys → issue on the offending row
- `defaultVariation` / rule `variation` referencing an unknown variation → issue on that select
- operator-dependent value rules (`isTrue` needs none, `greaterThan` needs a number,
  `in` needs a comma-separated list)

Inline errors appear once a field is touched; `handleSubmit` marks every field touched, so a failed
submit reveals all of them plus a summary listing each issue with a readable field path.

## Targeting model

A rule is `{ name?, logic, conditions[], variation }`. Conditions are a dynamic array per rule, and
`logic` (`and`/`or`) already gives the semantics needed to nest condition groups later — a group
node can be added to the condition union without reshaping the rule. Rules are ordered and can be
moved up/down because evaluation is first-match-wins.

`variation` per rule and a flag-level `defaultVariation` are additions to the minimum spec: a
targeting rule that does not say what it serves cannot be evaluated.

## Tests

`pnpm test` runs jsdom interaction tests covering the dynamic fields, operator-aware serialization,
duplicate/empty keys, invalid submit, valid submit and reset. Monaco is mocked so the assertions run
against the exact JSON the preview receives.
