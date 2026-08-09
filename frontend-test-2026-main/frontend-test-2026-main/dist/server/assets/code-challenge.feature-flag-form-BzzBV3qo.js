import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { CircleAlert, ChevronDown, Flag, Plus, X, ArrowUp, ArrowDown, Trash2, Target, AlertTriangle, Layers, RotateCcw, Save, Braces, Check, Copy, CheckCircle2 } from "lucide-react";
import { c as cn, B as Button } from "./router-BDc1MU06.js";
import { Editor } from "@monaco-editor/react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import "@tanstack/react-router";
import "class-variance-authority";
import "radix-ui";
import "clsx";
import "tailwind-merge";
function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsx(
    "input",
    {
      type,
      "data-slot": "input",
      className: cn(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      ),
      ...props
    }
  );
}
const FLAG_KEY_PATTERN = /^[a-z0-9]+(?:[-_.][a-z0-9]+)*$/;
const VARIATION_KEY_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;
const MAX_DESCRIPTION_LENGTH = 200;
const MAX_FLAG_KEY_LENGTH = 64;
const MAX_VARIATION_KEY_LENGTH = 32;
const MAX_ATTRIBUTE_LENGTH = 64;
const MAX_RULE_NAME_LENGTH = 60;
const OPERATOR_LABELS = {
  equals: "equals",
  notEquals: "does not equal",
  contains: "contains",
  notContains: "does not contain",
  startsWith: "starts with",
  endsWith: "ends with",
  greaterThan: "greater than",
  lessThan: "less than",
  in: "is one of",
  notIn: "is not one of",
  isTrue: "is true",
  isFalse: "is false"
};
const OPERATOR_VALUE_KINDS = {
  equals: "text",
  notEquals: "text",
  contains: "text",
  notContains: "text",
  startsWith: "text",
  endsWith: "text",
  greaterThan: "number",
  lessThan: "number",
  in: "list",
  notIn: "list",
  isTrue: "none",
  isFalse: "none"
};
const VARIATION_TYPE_LABELS = {
  boolean: "Boolean",
  string: "String",
  number: "Number"
};
const RULE_LOGIC_LABELS = {
  and: "Match ALL conditions",
  or: "Match ANY condition"
};
const ATTRIBUTE_SUGGESTIONS = [
  "country",
  "email",
  "userId",
  "plan",
  "role",
  "group",
  "appVersion",
  "deviceType"
];
const INITIAL_FLAG_DRAFT = {
  key: "new-checkout",
  description: "Enable new checkout flow",
  enabled: true,
  variations: [
    { id: "variation-on", key: "on", type: "boolean", value: "true" },
    { id: "variation-off", key: "off", type: "boolean", value: "false" }
  ],
  targeting: [],
  defaultVariation: "off"
};
const FIELD_LABELS = {
  key: "Flag key",
  description: "Description",
  enabled: "Enabled",
  defaultVariation: "Default variation",
  variations: "Variation",
  targeting: "Rule",
  conditions: "Condition",
  attribute: "Attribute",
  operator: "Operator",
  value: "Value",
  variation: "Serve variation",
  logic: "Logic",
  name: "Name"
};
function isRecord(value) {
  return typeof value === "object" && value !== null;
}
function toErrorMessages(errors) {
  const messages = [];
  for (const error of errors) {
    if (typeof error === "string") {
      if (error) messages.push(error);
      continue;
    }
    if (isRecord(error) && typeof error.message === "string" && error.message) {
      messages.push(error.message);
    }
  }
  return Array.from(new Set(messages));
}
function visibleFieldErrors(meta) {
  return meta.isTouched ? toErrorMessages(meta.errors) : [];
}
function collectFormIssues(errorMap) {
  if (!isRecord(errorMap)) return [];
  const issues = [];
  const seen = /* @__PURE__ */ new Set();
  for (const entry of Object.values(errorMap)) {
    const byPath = isRecord(entry) && isRecord(entry.fields) ? entry.fields : entry;
    if (!isRecord(byPath)) continue;
    for (const [path, value] of Object.entries(byPath)) {
      if (!Array.isArray(value)) continue;
      for (const message of toErrorMessages(value)) {
        const identity = `${path}::${message}`;
        if (seen.has(identity)) continue;
        seen.add(identity);
        issues.push({ path, message });
      }
    }
  }
  return issues;
}
function humanizeFieldPath(path) {
  return path.replace(/\[(\d+)\]/g, (_match, index) => ` #${Number(index) + 1}`).split(".").map((segment) => {
    const [name, position] = segment.split(" #");
    const label = FIELD_LABELS[name] ?? name;
    return position ? `${label} ${position}` : label;
  }).join(" › ");
}
const CONTROL_ACCENT_CLASSES = [
  "[&_input:hover]:border-indigo-400/60",
  "[&_select:hover]:border-indigo-400/60",
  "[&_textarea:hover]:border-indigo-400/60",
  "[&_input:focus-visible]:border-indigo-500 [&_input:focus-visible]:ring-2 [&_input:focus-visible]:ring-indigo-500/30",
  "[&_select:focus-visible]:border-indigo-500 [&_select:focus-visible]:ring-2 [&_select:focus-visible]:ring-indigo-500/30",
  "[&_textarea:focus-visible]:border-indigo-500 [&_textarea:focus-visible]:ring-2 [&_textarea:focus-visible]:ring-indigo-500/30"
].join(" ");
const CONTROL_INVALID_CLASSES = [
  "[&_input[aria-invalid=true]]:ring-2",
  "[&_select[aria-invalid=true]]:ring-2",
  "[&_textarea[aria-invalid=true]]:ring-2",
  "[&_input:hover]:border-destructive",
  "[&_select:hover]:border-destructive",
  "[&_textarea:hover]:border-destructive",
  "[&_input:focus-visible]:border-destructive [&_input:focus-visible]:ring-2 [&_input:focus-visible]:ring-destructive/40",
  "[&_select:focus-visible]:border-destructive [&_select:focus-visible]:ring-2 [&_select:focus-visible]:ring-destructive/40",
  "[&_textarea:focus-visible]:border-destructive [&_textarea:focus-visible]:ring-2 [&_textarea:focus-visible]:ring-destructive/40"
].join(" ");
function FieldShell({
  label,
  htmlFor,
  hint,
  errors,
  className,
  children
}) {
  const invalid = errors.length > 0;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "min-w-0 space-y-1.5",
        invalid ? CONTROL_INVALID_CLASSES : CONTROL_ACCENT_CLASSES,
        className
      ),
      children: [
        /* @__PURE__ */ jsx(
          "label",
          {
            htmlFor,
            className: cn(
              "block text-[11px] font-semibold tracking-wider uppercase transition-colors",
              invalid ? "text-destructive" : "text-muted-foreground"
            ),
            children: label
          }
        ),
        children,
        hint && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground/90", children: hint }),
        errors.map((error) => /* @__PURE__ */ jsxs(
          "p",
          {
            className: "flex items-start gap-1.5 text-xs font-medium text-destructive",
            children: [
              /* @__PURE__ */ jsx(CircleAlert, { "aria-hidden": true, className: "mt-px size-3.5 shrink-0" }),
              error
            ]
          },
          error
        ))
      ]
    }
  );
}
const TONE_CLASSES = {
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300",
  info: "border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:border-indigo-400/30 dark:bg-indigo-400/10 dark:text-indigo-300",
  warning: "border-amber-500/30 bg-amber-500/12 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300",
  danger: "border-destructive/30 bg-destructive/10 text-destructive dark:bg-destructive/15",
  neutral: "border-zinc-300 bg-zinc-100 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
};
const DOT_CLASSES = {
  success: "bg-emerald-500 shadow-[0_0_0_2px] shadow-emerald-500/20",
  info: "bg-indigo-500 shadow-[0_0_0_2px] shadow-indigo-500/20",
  warning: "bg-amber-500 shadow-[0_0_0_2px] shadow-amber-500/20",
  danger: "bg-destructive shadow-[0_0_0_2px] shadow-destructive/20",
  neutral: "bg-zinc-400 dark:bg-zinc-500"
};
function StatusPill({
  tone = "neutral",
  dot = false,
  className,
  children
}) {
  return /* @__PURE__ */ jsxs(
    "span",
    {
      className: cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] leading-none font-medium",
        TONE_CLASSES[tone],
        className
      ),
      children: [
        dot && /* @__PURE__ */ jsx("span", { className: cn("size-1.5 rounded-full", DOT_CLASSES[tone]) }),
        children
      ]
    }
  );
}
const ACCENT_CLASSES = {
  indigo: {
    wash: "from-indigo-500/10 via-indigo-500/[0.03]",
    chip: "border-indigo-500/25 bg-indigo-500/10 text-indigo-600 dark:border-indigo-400/25 dark:bg-indigo-400/10 dark:text-indigo-300"
  },
  violet: {
    wash: "from-violet-500/10 via-violet-500/[0.03]",
    chip: "border-violet-500/25 bg-violet-500/10 text-violet-600 dark:border-violet-400/25 dark:bg-violet-400/10 dark:text-violet-300"
  },
  sky: {
    wash: "from-sky-500/10 via-sky-500/[0.03]",
    chip: "border-sky-500/25 bg-sky-500/10 text-sky-600 dark:border-sky-400/25 dark:bg-sky-400/10 dark:text-sky-300"
  }
};
function Panel({
  title,
  description,
  icon,
  accent = "indigo",
  badge,
  actions,
  className,
  children
}) {
  const tone = ACCENT_CLASSES[accent];
  return /* @__PURE__ */ jsxs(
    "section",
    {
      className: cn(
        "overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-shadow hover:shadow-md",
        className
      ),
      children: [
        /* @__PURE__ */ jsxs(
          "header",
          {
            className: cn(
              "flex flex-wrap items-start justify-between gap-3 border-b border-border/70 bg-gradient-to-r to-transparent px-4 py-3.5",
              tone.wash
            ),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-start gap-3", children: [
                icon && /* @__PURE__ */ jsx(
                  "span",
                  {
                    "aria-hidden": true,
                    className: cn(
                      "mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg border [&_svg]:size-4",
                      tone.chip
                    ),
                    children: icon
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold tracking-tight", children: title }),
                    badge
                  ] }),
                  description && /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-xs text-muted-foreground", children: description })
                ] })
              ] }),
              actions && /* @__PURE__ */ jsx("div", { className: "flex shrink-0 items-center gap-2", children: actions })
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "p-4", children })
      ]
    }
  );
}
function CountBadge({ count }) {
  return /* @__PURE__ */ jsx(
    StatusPill,
    {
      tone: count > 0 ? "info" : "neutral",
      className: "min-w-6 justify-center font-mono tabular-nums",
      children: count
    }
  );
}
function Textarea({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "textarea",
    {
      className: cn(
        "w-full min-w-0 resize-y rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none transition-colors",
        "placeholder:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/25",
        "dark:bg-input/30",
        className
      ),
      ...props
    }
  );
}
function ToggleSwitch({
  id,
  checked,
  onCheckedChange,
  onBlur,
  label
}) {
  return /* @__PURE__ */ jsx(
    "button",
    {
      id,
      type: "button",
      role: "switch",
      "aria-checked": checked,
      "aria-label": label,
      onBlur,
      onClick: () => onCheckedChange(!checked),
      className: cn(
        "inline-flex h-6 w-11 shrink-0 items-center rounded-full border bg-gradient-to-b transition-all outline-none focus-visible:ring-2",
        checked ? "border-emerald-600/70 from-emerald-400 to-emerald-600 shadow-sm shadow-emerald-600/25 hover:brightness-110 focus-visible:ring-emerald-500/40 dark:border-emerald-400/70 dark:from-emerald-400 dark:to-emerald-500" : "border-zinc-300 from-zinc-200 to-zinc-300 hover:brightness-95 focus-visible:ring-zinc-400/40 dark:border-zinc-600 dark:from-zinc-600 dark:to-zinc-700 dark:hover:brightness-110"
      ),
      children: /* @__PURE__ */ jsx(
        "span",
        {
          className: cn(
            "size-4 rounded-full bg-white shadow-md ring-1 ring-black/5 transition-transform duration-200 ease-out",
            checked ? "translate-x-6" : "translate-x-1"
          )
        }
      )
    }
  );
}
let draftIdCounter = 0;
function createDraftId(prefix) {
  draftIdCounter += 1;
  return `${prefix}-${draftIdCounter}`;
}
function defaultValueForVariationType(type) {
  switch (type) {
    case "boolean":
      return "true";
    case "number":
      return "0";
    case "string":
      return "";
  }
}
function createVariationDraft() {
  return {
    id: createDraftId("variation"),
    key: "",
    type: "boolean",
    value: "true"
  };
}
function createConditionDraft() {
  return {
    id: createDraftId("condition"),
    attribute: "",
    operator: "equals",
    value: ""
  };
}
function createTargetingRuleDraft(variation) {
  return {
    id: createDraftId("rule"),
    name: "",
    logic: "and",
    conditions: [createConditionDraft()],
    variation
  };
}
function splitListValue(raw) {
  return raw.split(",").map((item) => item.trim()).filter(Boolean);
}
function toVariationValue(variation) {
  switch (variation.type) {
    case "boolean":
      return variation.value === "true";
    case "number": {
      const parsed = Number(variation.value);
      return Number.isFinite(parsed) ? parsed : variation.value;
    }
    case "string":
      return variation.value;
  }
}
function toConditionValue(condition) {
  switch (OPERATOR_VALUE_KINDS[condition.operator]) {
    case "none":
      return void 0;
    case "number": {
      const parsed = Number(condition.value);
      return Number.isFinite(parsed) && condition.value.trim() !== "" ? parsed : condition.value;
    }
    case "list":
      return splitListValue(condition.value);
    case "text":
      return condition.value;
  }
}
function listVariationKeys(draft) {
  const keys = [];
  for (const variation of draft.variations) {
    const key = variation.key.trim();
    if (key && !keys.includes(key)) keys.push(key);
  }
  return keys;
}
function serializeCondition(condition) {
  const value = toConditionValue(condition);
  const base = {
    attribute: condition.attribute.trim(),
    operator: condition.operator
  };
  return value === void 0 ? base : { ...base, value };
}
function serializeRule(rule) {
  const name = rule.name.trim();
  return {
    ...name ? { name } : {},
    logic: rule.logic,
    conditions: rule.conditions.map(serializeCondition),
    variation: rule.variation
  };
}
function serializeFeatureFlag(draft) {
  const variations = {};
  for (const variation of draft.variations) {
    const key = variation.key.trim();
    if (key) variations[key] = toVariationValue(variation);
  }
  const description = draft.description.trim();
  return {
    key: draft.key.trim(),
    ...description ? { description } : {},
    enabled: draft.enabled,
    variations,
    targeting: draft.targeting.map(serializeRule),
    defaultVariation: draft.defaultVariation
  };
}
function Select({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxs("div", { className: "relative w-full min-w-0", children: [
    /* @__PURE__ */ jsx(
      "select",
      {
        className: cn(
          "h-8 w-full min-w-0 appearance-none rounded-lg border border-input bg-transparent pr-7 pl-2.5 text-sm outline-none transition-colors",
          "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/25",
          "dark:bg-input/30",
          className
        ),
        ...props
      }
    ),
    /* @__PURE__ */ jsx(
      ChevronDown,
      {
        "aria-hidden": true,
        className: "pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-muted-foreground"
      }
    )
  ] });
}
function VariationSelect({
  id,
  form,
  value,
  invalid,
  required = false,
  onValueChange,
  onBlur
}) {
  return /* @__PURE__ */ jsx(form.Subscribe, { selector: (state) => listVariationKeys(state.values), children: (variationKeys) => /* @__PURE__ */ jsxs(
    Select,
    {
      id,
      value,
      "aria-required": required,
      "aria-invalid": invalid,
      onBlur,
      onChange: (event) => onValueChange(event.target.value),
      children: [
        /* @__PURE__ */ jsx("option", { value: "", children: "Select a variation…" }),
        value !== "" && !variationKeys.includes(value) && /* @__PURE__ */ jsxs("option", { value, children: [
          value,
          " (unknown)"
        ] }),
        variationKeys.map((key) => /* @__PURE__ */ jsx("option", { value: key, children: key }, key))
      ]
    }
  ) });
}
function FlagDetailsSection({ form }) {
  return /* @__PURE__ */ jsx(
    Panel,
    {
      title: "Flag details",
      description: "Identity and default behaviour of this feature flag.",
      icon: /* @__PURE__ */ jsx(Flag, {}),
      accent: "indigo",
      children: /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
        /* @__PURE__ */ jsx(form.Field, { name: "key", children: (field) => {
          const errors = visibleFieldErrors(field.state.meta);
          return /* @__PURE__ */ jsx(
            FieldShell,
            {
              label: "Flag key",
              htmlFor: "flag-key",
              errors,
              hint: "Unique identifier used by the SDK.",
              children: /* @__PURE__ */ jsx(
                Input,
                {
                  id: "flag-key",
                  className: "font-mono",
                  placeholder: "new-checkout",
                  value: field.state.value,
                  "aria-required": true,
                  "aria-invalid": errors.length > 0,
                  onBlur: field.handleBlur,
                  onChange: (event) => field.handleChange(event.target.value)
                }
              )
            }
          );
        } }),
        /* @__PURE__ */ jsx(form.Field, { name: "enabled", children: (field) => /* @__PURE__ */ jsx(FieldShell, { label: "Status", htmlFor: "flag-enabled", errors: [], children: /* @__PURE__ */ jsxs("div", { className: "flex h-8 items-center gap-3", children: [
          /* @__PURE__ */ jsx(
            ToggleSwitch,
            {
              id: "flag-enabled",
              label: "Flag enabled",
              checked: field.state.value,
              onBlur: field.handleBlur,
              onCheckedChange: field.handleChange
            }
          ),
          /* @__PURE__ */ jsx(
            StatusPill,
            {
              tone: field.state.value ? "success" : "neutral",
              dot: true,
              children: field.state.value ? "Enabled" : "Disabled"
            }
          )
        ] }) }) }),
        /* @__PURE__ */ jsx(form.Field, { name: "description", children: (field) => {
          const errors = visibleFieldErrors(field.state.meta);
          return /* @__PURE__ */ jsx(
            FieldShell,
            {
              label: "Description",
              htmlFor: "flag-description",
              errors,
              hint: `Optional · ${field.state.value.length}/${MAX_DESCRIPTION_LENGTH}`,
              className: "md:col-span-2",
              children: /* @__PURE__ */ jsx(
                Textarea,
                {
                  id: "flag-description",
                  rows: 2,
                  placeholder: "Enable new checkout flow",
                  value: field.state.value,
                  "aria-invalid": errors.length > 0,
                  onBlur: field.handleBlur,
                  onChange: (event) => field.handleChange(event.target.value)
                }
              )
            }
          );
        } }),
        /* @__PURE__ */ jsx(form.Field, { name: "defaultVariation", children: (field) => {
          const errors = visibleFieldErrors(field.state.meta);
          return /* @__PURE__ */ jsx(
            FieldShell,
            {
              label: "Default variation",
              htmlFor: "flag-default-variation",
              errors,
              hint: "Served when no targeting rule matches.",
              children: /* @__PURE__ */ jsx(
                VariationSelect,
                {
                  id: "flag-default-variation",
                  form,
                  value: field.state.value,
                  required: true,
                  invalid: errors.length > 0,
                  onBlur: field.handleBlur,
                  onValueChange: field.handleChange
                }
              )
            }
          );
        } })
      ] })
    }
  );
}
function AddButton({
  size = "sm",
  className,
  onClick,
  children
}) {
  return /* @__PURE__ */ jsxs(
    Button,
    {
      type: "button",
      variant: "outline",
      size,
      onClick,
      className: cn(
        "border-dashed border-indigo-500/40 bg-indigo-500/5 text-indigo-700",
        "hover:border-indigo-500/70 hover:bg-indigo-500/12 hover:text-indigo-800",
        "focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/30",
        "dark:border-indigo-400/40 dark:bg-indigo-400/5 dark:text-indigo-300",
        "dark:hover:border-indigo-400/70 dark:hover:bg-indigo-400/12 dark:hover:text-indigo-200",
        className
      ),
      children: [
        /* @__PURE__ */ jsx(Plus, {}),
        children
      ]
    }
  );
}
const VARIATION_TYPES = ["boolean", "string", "number"];
const RULE_LOGICS = ["and", "or"];
const OPERATORS = [
  "equals",
  "notEquals",
  "contains",
  "notContains",
  "startsWith",
  "endsWith",
  "greaterThan",
  "lessThan",
  "in",
  "notIn",
  "isTrue",
  "isFalse"
];
const VALUE_PLACEHOLDERS = {
  text: "TH",
  number: "10",
  list: "TH, SG, MY"
};
function ConditionRow({
  form,
  ruleIndex,
  conditionIndex,
  canRemove,
  onRemove
}) {
  const fieldPrefix = `targeting[${ruleIndex}].conditions[${conditionIndex}]`;
  const idPrefix = `rule-${ruleIndex}-condition-${conditionIndex}`;
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-2 rounded-lg border border-border/60 bg-background/70 p-2.5 transition-colors hover:border-sky-500/30 sm:grid-cols-[minmax(0,1fr)_11rem_minmax(0,1fr)_auto] dark:bg-background/30", children: [
    /* @__PURE__ */ jsx(form.Field, { name: `${fieldPrefix}.attribute`, children: (field) => {
      const errors = visibleFieldErrors(field.state.meta);
      return /* @__PURE__ */ jsx(
        FieldShell,
        {
          label: "Attribute",
          htmlFor: `${idPrefix}-attribute`,
          errors,
          children: /* @__PURE__ */ jsxs(
            Select,
            {
              id: `${idPrefix}-attribute`,
              value: field.state.value,
              "aria-required": true,
              "aria-invalid": errors.length > 0,
              onBlur: field.handleBlur,
              onChange: (event) => field.handleChange(event.target.value),
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Select an attribute…" }),
                field.state.value !== "" && !ATTRIBUTE_SUGGESTIONS.includes(field.state.value) && /* @__PURE__ */ jsxs("option", { value: field.state.value, children: [
                  field.state.value,
                  " (unknown)"
                ] }),
                ATTRIBUTE_SUGGESTIONS.map((attribute) => /* @__PURE__ */ jsx("option", { value: attribute, children: attribute }, attribute))
              ]
            }
          )
        }
      );
    } }),
    /* @__PURE__ */ jsx(form.Field, { name: `${fieldPrefix}.operator`, children: (operatorField) => /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        FieldShell,
        {
          label: "Operator",
          htmlFor: `${idPrefix}-operator`,
          errors: [],
          children: /* @__PURE__ */ jsx(
            Select,
            {
              id: `${idPrefix}-operator`,
              value: operatorField.state.value,
              onBlur: operatorField.handleBlur,
              onChange: (event) => {
                const nextOperator = event.target.value;
                operatorField.handleChange(nextOperator);
                if (OPERATOR_VALUE_KINDS[nextOperator] === "none") {
                  form.setFieldValue(`${fieldPrefix}.value`, "");
                }
              },
              children: OPERATORS.map((operator) => /* @__PURE__ */ jsx("option", { value: operator, children: OPERATOR_LABELS[operator] }, operator))
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(form.Field, { name: `${fieldPrefix}.value`, children: (valueField) => {
        const valueKind = OPERATOR_VALUE_KINDS[operatorField.state.value];
        const errors = visibleFieldErrors(valueField.state.meta);
        if (valueKind === "none") {
          return /* @__PURE__ */ jsx(
            FieldShell,
            {
              label: "Value",
              htmlFor: `${idPrefix}-value`,
              errors: [],
              children: /* @__PURE__ */ jsx(
                "p",
                {
                  id: `${idPrefix}-value`,
                  className: "flex h-8 items-center rounded-lg border border-dashed border-border px-2.5 text-xs text-muted-foreground",
                  children: "No value needed"
                }
              )
            }
          );
        }
        return /* @__PURE__ */ jsx(
          FieldShell,
          {
            label: "Value",
            htmlFor: `${idPrefix}-value`,
            errors,
            hint: valueKind === "list" ? "Comma separated" : void 0,
            children: /* @__PURE__ */ jsx(
              Input,
              {
                id: `${idPrefix}-value`,
                className: "font-mono",
                inputMode: valueKind === "number" ? "decimal" : "text",
                placeholder: VALUE_PLACEHOLDERS[valueKind],
                value: valueField.state.value,
                "aria-required": true,
                "aria-invalid": errors.length > 0,
                onBlur: valueField.handleBlur,
                onChange: (event) => valueField.handleChange(event.target.value)
              }
            )
          }
        );
      } })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "flex items-end justify-end pb-0.5", children: /* @__PURE__ */ jsx(
      Button,
      {
        type: "button",
        variant: "ghost",
        size: "icon-sm",
        disabled: !canRemove,
        "aria-label": `Remove condition ${conditionIndex + 1}`,
        onClick: onRemove,
        className: "text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus-visible:border-destructive/40 focus-visible:ring-2 focus-visible:ring-destructive/30",
        children: /* @__PURE__ */ jsx(X, {})
      }
    ) })
  ] });
}
function TargetingRule({
  form,
  index,
  total,
  onRemove,
  onMove
}) {
  return /* @__PURE__ */ jsxs("article", { className: "overflow-hidden rounded-xl border border-border/70 bg-card/60 transition-colors hover:border-sky-500/35", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex flex-wrap items-center justify-between gap-2 border-b border-border/70 bg-gradient-to-r from-sky-500/10 via-sky-500/[0.04] to-transparent px-3 py-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs(StatusPill, { tone: "info", className: "font-mono", children: [
          "#",
          index + 1
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: index === 0 ? "Evaluated first" : `Evaluated after rule #${index}` })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "ghost",
            size: "icon-sm",
            className: "focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/30",
            disabled: index === 0,
            "aria-label": `Move rule ${index + 1} up`,
            onClick: () => onMove(-1),
            children: /* @__PURE__ */ jsx(ArrowUp, {})
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "ghost",
            size: "icon-sm",
            className: "focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/30",
            disabled: index === total - 1,
            "aria-label": `Move rule ${index + 1} down`,
            onClick: () => onMove(1),
            children: /* @__PURE__ */ jsx(ArrowDown, {})
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "destructive",
            size: "icon-sm",
            "aria-label": `Remove rule ${index + 1}`,
            onClick: onRemove,
            className: "hover:bg-destructive/20 focus-visible:ring-2 focus-visible:ring-destructive/40",
            children: /* @__PURE__ */ jsx(Trash2, {})
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4 p-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-3", children: [
        /* @__PURE__ */ jsx(form.Field, { name: `targeting[${index}].name`, children: (field) => {
          const errors = visibleFieldErrors(field.state.meta);
          return /* @__PURE__ */ jsx(
            FieldShell,
            {
              label: "Rule name",
              htmlFor: `rule-${index}-name`,
              errors,
              hint: "Optional",
              children: /* @__PURE__ */ jsx(
                Input,
                {
                  id: `rule-${index}-name`,
                  placeholder: "Beta testers in Thailand",
                  value: field.state.value,
                  "aria-invalid": errors.length > 0,
                  onBlur: field.handleBlur,
                  onChange: (event) => field.handleChange(event.target.value)
                }
              )
            }
          );
        } }),
        /* @__PURE__ */ jsx(form.Field, { name: `targeting[${index}].logic`, children: (field) => /* @__PURE__ */ jsx(
          FieldShell,
          {
            label: "Logic",
            htmlFor: `rule-${index}-logic`,
            errors: [],
            children: /* @__PURE__ */ jsx(
              Select,
              {
                id: `rule-${index}-logic`,
                value: field.state.value,
                onBlur: field.handleBlur,
                onChange: (event) => field.handleChange(event.target.value),
                children: RULE_LOGICS.map((logic) => /* @__PURE__ */ jsx("option", { value: logic, children: RULE_LOGIC_LABELS[logic] }, logic))
              }
            )
          }
        ) }),
        /* @__PURE__ */ jsx(form.Field, { name: `targeting[${index}].variation`, children: (field) => {
          const errors = visibleFieldErrors(field.state.meta);
          return /* @__PURE__ */ jsx(
            FieldShell,
            {
              label: "Serve variation",
              htmlFor: `rule-${index}-variation`,
              errors,
              children: /* @__PURE__ */ jsx(
                VariationSelect,
                {
                  id: `rule-${index}-variation`,
                  form,
                  value: field.state.value,
                  required: true,
                  invalid: errors.length > 0,
                  onBlur: field.handleBlur,
                  onValueChange: field.handleChange
                }
              )
            }
          );
        } })
      ] }),
      /* @__PURE__ */ jsx(form.Field, { name: `targeting[${index}].conditions`, mode: "array", children: (conditionsField) => {
        const conditions = conditionsField.state.value;
        const errors = toErrorMessages(conditionsField.state.meta.errors);
        return /* @__PURE__ */ jsxs("div", { className: "space-y-3 rounded-xl border border-border/60 bg-muted/30 p-3 dark:bg-background/40", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxs("h3", { className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: [
              "Conditions",
              /* @__PURE__ */ jsx(
                StatusPill,
                {
                  tone: conditions.length > 0 ? "info" : "neutral",
                  className: "min-w-6 justify-center font-mono tabular-nums",
                  children: conditions.length
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              AddButton,
              {
                size: "xs",
                onClick: () => conditionsField.pushValue(createConditionDraft()),
                children: "Add condition"
              }
            )
          ] }),
          conditions.length === 0 ? /* @__PURE__ */ jsx("p", { className: "rounded-lg border border-dashed border-sky-500/30 bg-sky-500/[0.04] px-3 py-4 text-center text-xs text-muted-foreground", children: "This rule has no conditions yet." }) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: conditions.map((condition, conditionIndex) => /* @__PURE__ */ jsx(
            ConditionRow,
            {
              form,
              ruleIndex: index,
              conditionIndex,
              canRemove: conditions.length > 1,
              onRemove: () => conditionsField.removeValue(conditionIndex)
            },
            condition.id
          )) }),
          errors.map((error) => /* @__PURE__ */ jsxs(
            "p",
            {
              className: "flex items-start gap-1.5 text-xs font-medium text-destructive",
              children: [
                /* @__PURE__ */ jsx(
                  CircleAlert,
                  {
                    "aria-hidden": true,
                    className: "mt-px size-3.5 shrink-0"
                  }
                ),
                error
              ]
            },
            error
          ))
        ] });
      } })
    ] })
  ] });
}
function TargetingRules({ form }) {
  return /* @__PURE__ */ jsx(form.Field, { name: "targeting", mode: "array", children: (field) => {
    const rules = field.state.value;
    const errors = toErrorMessages(field.state.meta.errors);
    return /* @__PURE__ */ jsxs(
      Panel,
      {
        title: "Targeting rules",
        description: "Rules are evaluated top to bottom — the first match wins.",
        icon: /* @__PURE__ */ jsx(Target, {}),
        accent: "sky",
        badge: /* @__PURE__ */ jsx(CountBadge, { count: rules.length }),
        actions: /* @__PURE__ */ jsx(
          AddButton,
          {
            onClick: () => {
              const [firstVariation = ""] = listVariationKeys(
                form.state.values
              );
              field.pushValue(createTargetingRuleDraft(firstVariation));
            },
            children: "Add rule"
          }
        ),
        children: [
          rules.length === 0 ? /* @__PURE__ */ jsx("p", { className: "rounded-xl border border-dashed border-sky-500/30 bg-sky-500/[0.04] px-4 py-6 text-center text-sm text-muted-foreground", children: "No targeting rules. Every user gets the default variation." }) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: rules.map((rule, index) => /* @__PURE__ */ jsx(
            TargetingRule,
            {
              form,
              index,
              total: rules.length,
              onRemove: () => field.removeValue(index),
              onMove: (direction) => field.moveValue(index, index + direction)
            },
            rule.id
          )) }),
          errors.map((error) => /* @__PURE__ */ jsxs(
            "p",
            {
              className: "mt-3 flex items-start gap-1.5 rounded-lg border border-destructive/30 bg-destructive/5 px-2.5 py-2 text-xs font-medium text-destructive",
              children: [
                /* @__PURE__ */ jsx(CircleAlert, { "aria-hidden": true, className: "mt-px size-3.5 shrink-0" }),
                error
              ]
            },
            error
          ))
        ]
      }
    );
  } });
}
function ValidationSummary({ form }) {
  return /* @__PURE__ */ jsx(
    form.Subscribe,
    {
      selector: (state) => ({
        errorMap: state.errorMap,
        submissionAttempts: state.submissionAttempts
      }),
      children: ({ errorMap, submissionAttempts }) => {
        if (submissionAttempts === 0) return null;
        const issues = collectFormIssues(errorMap);
        if (issues.length === 0) return null;
        return /* @__PURE__ */ jsxs(
          "div",
          {
            role: "alert",
            className: "rounded-2xl border border-destructive/40 bg-gradient-to-br from-destructive/10 via-destructive/5 to-transparent p-4 shadow-sm",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    "aria-hidden": true,
                    className: "grid size-7 shrink-0 place-items-center rounded-lg border border-destructive/30 bg-destructive/10 text-destructive",
                    children: /* @__PURE__ */ jsx(AlertTriangle, { className: "size-4" })
                  }
                ),
                /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold text-foreground", children: [
                  issues.length,
                  " issue",
                  issues.length > 1 ? "s" : "",
                  " to fix before saving"
                ] }),
                /* @__PURE__ */ jsx(StatusPill, { tone: "danger", dot: true, className: "ml-auto", children: "Not saved" })
              ] }),
              /* @__PURE__ */ jsx("ul", { className: "mt-3 space-y-1 border-l-2 border-destructive/25 pl-3", children: issues.map((issue) => /* @__PURE__ */ jsxs(
                "li",
                {
                  className: "text-xs text-destructive",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "font-semibold", children: humanizeFieldPath(issue.path) }),
                    /* @__PURE__ */ jsxs("span", { className: "text-destructive/80", children: [
                      " ",
                      "— ",
                      issue.message
                    ] })
                  ]
                },
                `${issue.path}:${issue.message}`
              )) })
            ]
          }
        );
      }
    }
  );
}
function VariationItem({ form, index, onRemove }) {
  return /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-border/70 bg-gradient-to-br from-violet-500/[0.05] via-transparent to-transparent p-3 transition-colors hover:border-violet-500/35", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-[minmax(0,1fr)_8.5rem_minmax(0,1fr)_auto]", children: [
    /* @__PURE__ */ jsx(form.Field, { name: `variations[${index}].key`, children: (field) => {
      const errors = visibleFieldErrors(field.state.meta);
      return /* @__PURE__ */ jsx(
        FieldShell,
        {
          label: `Key #${index + 1}`,
          htmlFor: `variation-${index}-key`,
          errors,
          children: /* @__PURE__ */ jsx(
            Input,
            {
              id: `variation-${index}-key`,
              className: "font-mono",
              placeholder: "on",
              value: field.state.value,
              "aria-required": true,
              "aria-invalid": errors.length > 0,
              onBlur: field.handleBlur,
              onChange: (event) => field.handleChange(event.target.value)
            }
          )
        }
      );
    } }),
    /* @__PURE__ */ jsx(form.Field, { name: `variations[${index}].type`, children: (typeField) => /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        FieldShell,
        {
          label: "Type",
          htmlFor: `variation-${index}-type`,
          errors: [],
          children: /* @__PURE__ */ jsx(
            Select,
            {
              id: `variation-${index}-type`,
              value: typeField.state.value,
              onBlur: typeField.handleBlur,
              onChange: (event) => {
                const nextType = event.target.value;
                typeField.handleChange(nextType);
                form.setFieldValue(
                  `variations[${index}].value`,
                  defaultValueForVariationType(nextType)
                );
              },
              children: VARIATION_TYPES.map((type) => /* @__PURE__ */ jsx("option", { value: type, children: VARIATION_TYPE_LABELS[type] }, type))
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(form.Field, { name: `variations[${index}].value`, children: (valueField) => {
        const errors = visibleFieldErrors(valueField.state.meta);
        const inputId = `variation-${index}-value`;
        return /* @__PURE__ */ jsx(FieldShell, { label: "Value", htmlFor: inputId, errors, children: typeField.state.value === "boolean" ? /* @__PURE__ */ jsxs(
          Select,
          {
            id: inputId,
            value: valueField.state.value,
            "aria-required": true,
            onBlur: valueField.handleBlur,
            onChange: (event) => valueField.handleChange(event.target.value),
            children: [
              /* @__PURE__ */ jsx("option", { value: "true", children: "true" }),
              /* @__PURE__ */ jsx("option", { value: "false", children: "false" })
            ]
          }
        ) : /* @__PURE__ */ jsx(
          Input,
          {
            id: inputId,
            className: "font-mono",
            inputMode: typeField.state.value === "number" ? "decimal" : "text",
            placeholder: typeField.state.value === "number" ? "0" : "value",
            value: valueField.state.value,
            "aria-required": true,
            "aria-invalid": errors.length > 0,
            onBlur: valueField.handleBlur,
            onChange: (event) => valueField.handleChange(event.target.value)
          }
        ) });
      } })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "flex items-end justify-end pb-0.5", children: /* @__PURE__ */ jsx(
      Button,
      {
        type: "button",
        variant: "destructive",
        size: "icon-sm",
        "aria-label": `Remove variation ${index + 1}`,
        onClick: onRemove,
        className: "focus-visible:ring-2 focus-visible:ring-destructive/40",
        children: /* @__PURE__ */ jsx(Trash2, {})
      }
    ) })
  ] }) });
}
function VariationList({ form }) {
  return /* @__PURE__ */ jsx(form.Field, { name: "variations", mode: "array", children: (field) => {
    const variations = field.state.value;
    const errors = toErrorMessages(field.state.meta.errors);
    return /* @__PURE__ */ jsxs(
      Panel,
      {
        title: "Variations",
        description: "The possible values this flag can return.",
        icon: /* @__PURE__ */ jsx(Layers, {}),
        accent: "violet",
        badge: /* @__PURE__ */ jsx(CountBadge, { count: variations.length }),
        actions: /* @__PURE__ */ jsx(
          AddButton,
          {
            onClick: () => field.pushValue(createVariationDraft()),
            children: "Add variation"
          }
        ),
        children: [
          variations.length === 0 ? /* @__PURE__ */ jsx("p", { className: "rounded-xl border border-dashed border-violet-500/30 bg-violet-500/[0.04] px-4 py-6 text-center text-sm text-muted-foreground", children: "No variations yet. A flag needs at least one." }) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: variations.map((variation, index) => /* @__PURE__ */ jsx(
            VariationItem,
            {
              form,
              index,
              onRemove: () => field.removeValue(index)
            },
            variation.id
          )) }),
          errors.map((error) => /* @__PURE__ */ jsxs(
            "p",
            {
              className: "mt-3 flex items-start gap-1.5 rounded-lg border border-destructive/30 bg-destructive/5 px-2.5 py-2 text-xs font-medium text-destructive",
              children: [
                /* @__PURE__ */ jsx(CircleAlert, { "aria-hidden": true, className: "mt-px size-3.5 shrink-0" }),
                error
              ]
            },
            error
          ))
        ]
      }
    );
  } });
}
function FeatureFlagForm$1({ form, onReset }) {
  return /* @__PURE__ */ jsxs(
    "form",
    {
      noValidate: true,
      className: "space-y-4",
      onSubmit: (event) => {
        event.preventDefault();
        void form.handleSubmit();
      },
      children: [
        /* @__PURE__ */ jsx(FlagDetailsSection, { form }),
        /* @__PURE__ */ jsx(VariationList, { form }),
        /* @__PURE__ */ jsx(TargetingRules, { form }),
        /* @__PURE__ */ jsx(ValidationSummary, { form }),
        /* @__PURE__ */ jsx(
          form.Subscribe,
          {
            selector: (state) => ({
              isSubmitting: state.isSubmitting,
              isDirty: state.isDirty
            }),
            children: ({ isSubmitting, isDirty }) => /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-end gap-2 rounded-2xl border border-border/80 bg-gradient-to-r from-indigo-500/[0.07] via-card to-card px-4 py-3 shadow-sm", children: [
              /* @__PURE__ */ jsx("div", { className: "mr-auto", children: /* @__PURE__ */ jsx(StatusPill, { tone: isDirty ? "warning" : "neutral", dot: true, children: isDirty ? "Unsaved changes" : "No changes" }) }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "lg",
                  className: "hover:border-indigo-400/50 hover:text-indigo-700 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/30 dark:hover:border-indigo-400/40 dark:hover:text-indigo-300",
                  onClick: () => {
                    form.reset();
                    onReset();
                  },
                  children: [
                    /* @__PURE__ */ jsx(RotateCcw, {}),
                    "Reset"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  type: "submit",
                  size: "lg",
                  disabled: isSubmitting,
                  className: "bg-gradient-to-b from-indigo-500 to-indigo-600 text-white shadow-sm shadow-indigo-600/25 hover:from-indigo-400 hover:to-indigo-500 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/40 dark:from-indigo-500 dark:to-indigo-600 dark:hover:from-indigo-400 dark:hover:to-indigo-500",
                  children: [
                    /* @__PURE__ */ jsx(Save, {}),
                    isSubmitting ? "Saving…" : "Save flag"
                  ]
                }
              )
            ] })
          }
        )
      ]
    }
  );
}
function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef(null);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };
  return /* @__PURE__ */ jsxs(
    Button,
    {
      type: "button",
      variant: "ghost",
      size: "xs",
      onClick: copy,
      className: cn(
        "text-slate-300 hover:bg-white/10 hover:text-white dark:hover:bg-white/10",
        copied && "text-emerald-300 hover:text-emerald-200"
      ),
      children: [
        copied ? /* @__PURE__ */ jsx(Check, {}) : /* @__PURE__ */ jsx(Copy, {}),
        copied ? "Copied" : "Copy"
      ]
    }
  );
}
function JsonPreviewPanel({ json, isValid }) {
  return /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950 shadow-lg shadow-slate-950/10 ring-1 ring-white/5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 border-b border-white/10 bg-gradient-to-r from-indigo-500/15 via-slate-900 to-slate-900 px-3 py-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            "aria-hidden": true,
            className: "grid size-6 place-items-center rounded-md border border-indigo-400/25 bg-indigo-400/10 text-indigo-300",
            children: /* @__PURE__ */ jsx(Braces, { className: "size-3.5" })
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "font-mono text-xs text-slate-400", children: "flag.json" }),
        /* @__PURE__ */ jsxs(
          "span",
          {
            className: cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] leading-none font-medium",
              isValid ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300" : "border-amber-400/30 bg-amber-500/10 text-amber-300"
            ),
            children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: cn(
                    "size-1.5 rounded-full shadow-[0_0_0_2px]",
                    isValid ? "bg-emerald-400 shadow-emerald-400/20" : "bg-amber-400 shadow-amber-400/20"
                  )
                }
              ),
              isValid ? "valid" : "invalid"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx(CopyButton, { value: json })
    ] }),
    /* @__PURE__ */ jsx(
      Editor,
      {
        height: "clamp(320px, 58vh, 640px)",
        language: "json",
        theme: "vs-dark",
        value: json,
        loading: /* @__PURE__ */ jsx("pre", { className: "max-h-96 overflow-auto p-4 font-mono text-xs text-slate-300", children: json }),
        options: {
          readOnly: true,
          domReadOnly: true,
          minimap: { enabled: false },
          fontSize: 12.5,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          wordWrap: "on",
          renderLineHighlight: "none",
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
          scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
          overviewRulerLanes: 0
        }
      }
    )
  ] });
}
function JsonPreview({ form }) {
  return /* @__PURE__ */ jsx(
    form.Subscribe,
    {
      selector: (state) => ({ values: state.values, isValid: state.isValid }),
      children: ({ values, isValid }) => /* @__PURE__ */ jsx(
        JsonPreviewPanel,
        {
          json: JSON.stringify(serializeFeatureFlag(values), null, 2),
          isValid
        }
      )
    }
  );
}
function SavedFlagPanel({ saved }) {
  return /* @__PURE__ */ jsxs("section", { className: "rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-4 shadow-sm dark:border-emerald-400/30", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 text-emerald-700 dark:text-emerald-300", children: [
      /* @__PURE__ */ jsx(
        "span",
        {
          "aria-hidden": true,
          className: "grid size-7 shrink-0 place-items-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 dark:border-emerald-400/30",
          children: /* @__PURE__ */ jsx(CheckCircle2, { className: "size-4" })
        }
      ),
      /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold", children: [
        "Saved ",
        /* @__PURE__ */ jsx("span", { className: "font-mono", children: saved.flag.key })
      ] }),
      /* @__PURE__ */ jsx(StatusPill, { tone: "success", className: "ml-auto font-mono", children: saved.savedAt })
    ] }),
    /* @__PURE__ */ jsx("pre", { className: "mt-3 max-h-56 overflow-auto rounded-xl border border-emerald-500/20 bg-background/80 p-3 font-mono text-xs leading-relaxed dark:border-emerald-400/20 dark:bg-background/60", children: JSON.stringify(saved.flag, null, 2) })
  ] });
}
const variationSchema = z.object({
  id: z.string(),
  key: z.string().trim().min(1, "Variation key is required").max(
    MAX_VARIATION_KEY_LENGTH,
    `Keep the key under ${MAX_VARIATION_KEY_LENGTH} characters`
  ).regex(
    VARIATION_KEY_PATTERN,
    'Use letters, numbers, "-" or "_" (e.g. on, off, variant_a)'
  ),
  type: z.enum(VARIATION_TYPES),
  value: z.string()
}).superRefine((variation, ctx) => {
  const value = variation.value.trim();
  if (variation.type === "number" && (value === "" || !Number.isFinite(Number(value)))) {
    ctx.addIssue({
      code: "custom",
      path: ["value"],
      message: "Value must be a valid number"
    });
  }
  if (variation.type === "string" && value === "") {
    ctx.addIssue({
      code: "custom",
      path: ["value"],
      message: "Value is required"
    });
  }
});
const variationsSchema = z.array(variationSchema).min(1, "A flag needs at least one variation").superRefine((variations, ctx) => {
  const firstIndexByKey = /* @__PURE__ */ new Map();
  variations.forEach((variation, index) => {
    const key = variation.key.trim();
    if (!key) return;
    if (firstIndexByKey.has(key)) {
      ctx.addIssue({
        code: "custom",
        path: [index, "key"],
        message: `Duplicate key "${key}" — variation keys must be unique`
      });
      return;
    }
    firstIndexByKey.set(key, index);
  });
});
const conditionSchema = z.object({
  id: z.string(),
  attribute: z.string().trim().min(1, "Attribute is required").max(
    MAX_ATTRIBUTE_LENGTH,
    `Keep the attribute under ${MAX_ATTRIBUTE_LENGTH} characters`
  ),
  operator: z.enum(OPERATORS),
  value: z.string()
}).superRefine((condition, ctx) => {
  const kind = OPERATOR_VALUE_KINDS[condition.operator];
  if (kind === "none") return;
  if (condition.value.trim() === "") {
    ctx.addIssue({
      code: "custom",
      path: ["value"],
      message: "This operator requires a value"
    });
    return;
  }
  if (kind === "number" && !Number.isFinite(Number(condition.value))) {
    ctx.addIssue({
      code: "custom",
      path: ["value"],
      message: "Value must be a number"
    });
  }
  if (kind === "list" && splitListValue(condition.value).length === 0) {
    ctx.addIssue({
      code: "custom",
      path: ["value"],
      message: "Provide at least one value, separated by commas"
    });
  }
});
const targetingRuleSchema = z.object({
  id: z.string(),
  name: z.string().trim().max(
    MAX_RULE_NAME_LENGTH,
    `Keep the rule name under ${MAX_RULE_NAME_LENGTH} characters`
  ),
  logic: z.enum(RULE_LOGICS),
  conditions: z.array(conditionSchema).min(1, "A rule needs at least one condition"),
  variation: z.string().min(1, "Choose the variation this rule serves")
});
const featureFlagSchema = z.object({
  key: z.string().trim().min(1, "Flag key is required").max(
    MAX_FLAG_KEY_LENGTH,
    `Keep the key under ${MAX_FLAG_KEY_LENGTH} characters`
  ).regex(
    FLAG_KEY_PATTERN,
    "Use lowercase letters, numbers and - _ . as separators (e.g. new-checkout)"
  ),
  description: z.string().trim().max(
    MAX_DESCRIPTION_LENGTH,
    `Keep the description under ${MAX_DESCRIPTION_LENGTH} characters`
  ),
  enabled: z.boolean(),
  variations: variationsSchema,
  targeting: z.array(targetingRuleSchema),
  defaultVariation: z.string().min(1, "Choose the variation served when no rule matches")
}).superRefine((flag, ctx) => {
  const knownKeys = new Set(
    flag.variations.map((variation) => variation.key.trim()).filter(Boolean)
  );
  if (flag.defaultVariation && !knownKeys.has(flag.defaultVariation)) {
    ctx.addIssue({
      code: "custom",
      path: ["defaultVariation"],
      message: `"${flag.defaultVariation}" is not one of the defined variations`
    });
  }
  flag.targeting.forEach((rule, index) => {
    if (rule.variation && !knownKeys.has(rule.variation)) {
      ctx.addIssue({
        code: "custom",
        path: ["targeting", index, "variation"],
        message: `"${rule.variation}" is not one of the defined variations`
      });
    }
  });
});
function useFeatureFlagForm({
  onValidSubmit,
  onInvalidSubmit
}) {
  return useForm({
    defaultValues: INITIAL_FLAG_DRAFT,
    validators: {
      onMount: featureFlagSchema,
      onChange: featureFlagSchema,
      onSubmit: featureFlagSchema
    },
    onSubmit: async ({ value }) => {
      await onValidSubmit(serializeFeatureFlag(value));
    },
    onSubmitInvalid: onInvalidSubmit
  });
}
function mockSaveFeatureFlag(flag) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(flag), 400);
  });
}
function FeatureFlagEditor() {
  const [saved, setSaved] = useState(null);
  const form = useFeatureFlagForm({
    onValidSubmit: async (flag) => {
      const persisted = await mockSaveFeatureFlag(flag);
      setSaved({ flag: persisted, savedAt: (/* @__PURE__ */ new Date()).toLocaleTimeString() });
    },
    onInvalidSubmit: () => setSaved(null)
  });
  return /* @__PURE__ */ jsxs("div", { className: "grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,30rem)]", children: [
    /* @__PURE__ */ jsx(FeatureFlagForm$1, { form, onReset: () => setSaved(null) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4 xl:sticky xl:top-4", children: [
      /* @__PURE__ */ jsx(JsonPreview, { form }),
      saved && /* @__PURE__ */ jsx(SavedFlagPanel, { saved })
    ] })
  ] });
}
function YourCode() {
  return /* @__PURE__ */ jsxs("section", { children: [
    /* @__PURE__ */ jsxs("header", { className: "relative mb-5 overflow-hidden border-b border-border pb-5", children: [
      /* @__PURE__ */ jsx(
        "span",
        {
          "aria-hidden": true,
          className: "pointer-events-none absolute -top-24 -left-16 size-56 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-400/10"
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "relative bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent dark:from-indigo-300 dark:via-violet-300 dark:to-sky-300", children: "Feature Flag Editor" })
    ] }),
    /* @__PURE__ */ jsx(FeatureFlagEditor, {})
  ] });
}
function FeatureFlagForm() {
  return /* @__PURE__ */ jsx(YourCode, {});
}
const SplitComponent = FeatureFlagForm;
export {
  SplitComponent as component
};
