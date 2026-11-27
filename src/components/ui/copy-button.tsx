import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Copies a value to the clipboard. With `children` it is a labelled button; without, an icon button. */
export function CopyButton({ value, label, children, className }: { value: string; label: string; children?: React.ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard blocked: the value is still visible to select by hand.
    }
  }

  if (children)
    return (
      <button
        type='button'
        onClick={copy}
        className={cn(
          'inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-[14px] text-ink transition-colors hover:border-ink/30',
          className
        )}
      >
        {copied ? <Check className='size-4 text-accent' aria-hidden /> : <Copy className='size-4' aria-hidden />}
        <span aria-live='polite'>{copied ? 'Copied' : children}</span>
      </button>
    )

  return (
    <button
      type='button'
      onClick={copy}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
      className={cn('grid size-10 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-ink/5 hover:text-ink', className)}
    >
      {copied ? <Check className='size-4 text-accent' aria-hidden /> : <Copy className='size-4' aria-hidden />}
    </button>
  )
}
