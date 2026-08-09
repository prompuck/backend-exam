import { AlertTriangle } from 'lucide-react'
import { collectFormIssues, humanizeFieldPath } from '../utils/form-error'
import { StatusPill } from './ui/status-pill'
import type { FeatureFlagFormApi } from '../hooks/use-feature-flag-form'

export function ValidationSummary({ form }: { form: FeatureFlagFormApi }) {
  return (
    <form.Subscribe
      selector={(state) => ({
        errorMap: state.errorMap,
        submissionAttempts: state.submissionAttempts,
      })}
    >
      {({ errorMap, submissionAttempts }) => {
        if (submissionAttempts === 0) return null

        const issues = collectFormIssues(errorMap)
        if (issues.length === 0) return null

        return (
          <div
            role="alert"
            className="rounded-2xl border border-destructive/40 bg-gradient-to-br from-destructive/10 via-destructive/5 to-transparent p-4 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="grid size-7 shrink-0 place-items-center rounded-lg border border-destructive/30 bg-destructive/10 text-destructive"
              >
                <AlertTriangle className="size-4" />
              </span>
              <p className="text-sm font-semibold text-foreground">
                {issues.length} issue{issues.length > 1 ? 's' : ''} to fix
                before saving
              </p>
              <StatusPill tone="danger" dot className="ml-auto">
                Not saved
              </StatusPill>
            </div>
            <ul className="mt-3 space-y-1 border-l-2 border-destructive/25 pl-3">
              {issues.map((issue) => (
                <li
                  key={`${issue.path}:${issue.message}`}
                  className="text-xs text-destructive"
                >
                  <span className="font-semibold">
                    {humanizeFieldPath(issue.path)}
                  </span>
                  <span className="text-destructive/80">
                    {' '}
                    — {issue.message}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )
      }}
    </form.Subscribe>
  )
}
