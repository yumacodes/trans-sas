import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

type DialogProps = {
  open: boolean
  onClose: () => void
  /** Accessible name, read when the dialog opens. */
  title: string
  children: ReactNode
  className?: string
}

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),textarea,select,[tabindex]:not([tabindex="-1"])'

/**
 * A modal dialog: focus moves in and stays in, Escape and the backdrop close it, the page
 * behind doesn't scroll, and focus returns to whatever opened it. Full-height sheet on
 * phones, centred panel from sm up.
 */
export function Dialog({ open, onClose, title, children, className }: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!open) return

    const opener = document.activeElement as HTMLElement | null
    const scrollbar = window.innerWidth - document.documentElement.clientWidth

    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${scrollbar}px`
    requestAnimationFrame(() => panelRef.current?.focus())

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }

      if (e.key === 'Tab' && panelRef.current) {
        const items = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)]
        const first = items[0]
        const last = items[items.length - 1]

        if (!first || !last) return
        if (e.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
      opener?.focus()
    }
  }, [open, onClose])

  return createPortal(
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {open && (
          <div className='fixed inset-0 z-[150] flex items-end justify-center sm:items-center sm:p-6'>
            <m.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className='absolute inset-0 bg-ink/45 backdrop-blur-[3px]'
            />
            <m.div
              ref={panelRef}
              role='dialog'
              aria-modal='true'
              aria-label={title}
              tabIndex={-1}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 380, damping: 34 }}
              className={cn(
                'relative max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-paper shadow-2xl outline-none sm:max-h-[88dvh] sm:max-w-3xl sm:rounded-3xl',
                className
              )}
            >
              <button
                type='button'
                onClick={onClose}
                aria-label='Close'
                className='absolute top-3 right-3 z-10 grid size-11 place-items-center rounded-full bg-white/85 text-ink shadow-sm backdrop-blur transition-colors hover:bg-white'
              >
                <X className='size-5' strokeWidth={1.7} aria-hidden />
              </button>
              {children}
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </LazyMotion>,
    document.body
  )
}
