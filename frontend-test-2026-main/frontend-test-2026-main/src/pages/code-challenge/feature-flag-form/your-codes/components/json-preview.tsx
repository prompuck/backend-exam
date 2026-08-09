import { useRef, useState } from 'react'
import { Editor } from '@monaco-editor/react'
import { Braces, Check, Copy } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'
import { serializeFeatureFlag } from '../utils/feature-flag'
import type { FeatureFlagFormApi } from '../hooks/use-feature-flag-form'

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      if (resetTimer.current) clearTimeout(resetTimer.current)
      resetTimer.current = setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="xs"
      onClick={copy}
      className={cn(
        'text-slate-300 hover:bg-white/10 hover:text-white dark:hover:bg-white/10',
        copied && 'text-emerald-300 hover:text-emerald-200',
      )}
    >
      {copied ? <Check /> : <Copy />}
      {copied ? 'Copied' : 'Copy'}
    </Button>
  )
}

interface JsonPreviewPanelProps {
  json: string
  isValid: boolean
}

function JsonPreviewPanel({ json, isValid }: JsonPreviewPanelProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950 shadow-lg shadow-slate-950/10 ring-1 ring-white/5">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-gradient-to-r from-indigo-500/15 via-slate-900 to-slate-900 px-3 py-2">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="grid size-6 place-items-center rounded-md border border-indigo-400/25 bg-indigo-400/10 text-indigo-300"
          >
            <Braces className="size-3.5" />
          </span>
          <span className="font-mono text-xs text-slate-400">flag.json</span>
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] leading-none font-medium',
              isValid
                ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300'
                : 'border-amber-400/30 bg-amber-500/10 text-amber-300',
            )}
          >
            <span
              className={cn(
                'size-1.5 rounded-full shadow-[0_0_0_2px]',
                isValid
                  ? 'bg-emerald-400 shadow-emerald-400/20'
                  : 'bg-amber-400 shadow-amber-400/20',
              )}
            />
            {isValid ? 'valid' : 'invalid'}
          </span>
        </div>
        <CopyButton value={json} />
      </div>

      <Editor
        height="clamp(320px, 58vh, 640px)"
        language="json"
        theme="vs-dark"
        value={json}
        loading={
          <pre className="max-h-96 overflow-auto p-4 font-mono text-xs text-slate-300">
            {json}
          </pre>
        }
        options={{
          readOnly: true,
          domReadOnly: true,
          minimap: { enabled: false },
          fontSize: 12.5,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          renderLineHighlight: 'none',
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
          scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
          overviewRulerLanes: 0,
        }}
      />
    </div>
  )
}

export function JsonPreview({ form }: { form: FeatureFlagFormApi }) {
  return (
    <form.Subscribe
      selector={(state) => ({ values: state.values, isValid: state.isValid })}
    >
      {({ values, isValid }) => (
        <JsonPreviewPanel
          json={JSON.stringify(serializeFeatureFlag(values), null, 2)}
          isValid={isValid}
        />
      )}
    </form.Subscribe>
  )
}
