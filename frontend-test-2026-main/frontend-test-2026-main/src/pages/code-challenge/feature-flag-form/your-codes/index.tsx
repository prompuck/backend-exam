import { FeatureFlagEditor } from './feature-flag-editor'

function YourCode() {
  return (
    <section>
      <header className="relative mb-5 overflow-hidden border-b border-border pb-5">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-24 -left-16 size-56 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-400/10"
        />
        <h1 className="relative bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent dark:from-indigo-300 dark:via-violet-300 dark:to-sky-300">
          Feature Flag Editor
        </h1>
      </header>
      <FeatureFlagEditor />
    </section>
  )
}

export default YourCode
