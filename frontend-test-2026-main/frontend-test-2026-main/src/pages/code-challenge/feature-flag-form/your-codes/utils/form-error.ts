export interface FormIssue {
  path: string
  message: string
}

const FIELD_LABELS: Record<string, string> = {
  key: 'Flag key',
  description: 'Description',
  enabled: 'Enabled',
  defaultVariation: 'Default variation',
  variations: 'Variation',
  targeting: 'Rule',
  conditions: 'Condition',
  attribute: 'Attribute',
  operator: 'Operator',
  value: 'Value',
  variation: 'Serve variation',
  logic: 'Logic',
  name: 'Name',
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function toErrorMessages(errors: ReadonlyArray<unknown>): Array<string> {
  const messages: Array<string> = []
  for (const error of errors) {
    if (typeof error === 'string') {
      if (error) messages.push(error)
      continue
    }
    if (isRecord(error) && typeof error.message === 'string' && error.message) {
      messages.push(error.message)
    }
  }
  return Array.from(new Set(messages))
}

export function visibleFieldErrors(meta: {
  isTouched: boolean
  errors: ReadonlyArray<unknown>
}): Array<string> {
  return meta.isTouched ? toErrorMessages(meta.errors) : []
}

export function collectFormIssues(errorMap: unknown): Array<FormIssue> {
  if (!isRecord(errorMap)) return []

  const issues: Array<FormIssue> = []
  const seen = new Set<string>()

  for (const entry of Object.values(errorMap)) {
    const byPath =
      isRecord(entry) && isRecord(entry.fields) ? entry.fields : entry
    if (!isRecord(byPath)) continue

    for (const [path, value] of Object.entries(byPath)) {
      if (!Array.isArray(value)) continue
      for (const message of toErrorMessages(value)) {
        const identity = `${path}::${message}`
        if (seen.has(identity)) continue
        seen.add(identity)
        issues.push({ path, message })
      }
    }
  }

  return issues
}

export function humanizeFieldPath(path: string): string {
  return path
    .replace(/\[(\d+)\]/g, (_match, index: string) => ` #${Number(index) + 1}`)
    .split('.')
    .map((segment) => {
      const [name, position] = segment.split(' #')
      const label = FIELD_LABELS[name] ?? name
      return position ? `${label} ${position}` : label
    })
    .join(' › ')
}
