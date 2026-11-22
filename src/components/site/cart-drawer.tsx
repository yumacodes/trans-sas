import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react'
import { ShoppingBag, X } from 'lucide-react'
import { LinkButton } from '@/components/ui/button'
import { CartLines } from '@/components/site/cart-lines'
import { useCart } from '@/lib/cart'

export function CartDrawer() {
  const { drawerOpen, setDrawerOpen, lines, count } = useCart()
  const reduce = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!drawerOpen) return

    returnFocus.current = document.activeElement as HTMLElement
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false)

      // Keep Tab inside the dialog.
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,[tabindex="0"]')
        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      returnFocus.current?.focus()
    }
  }, [drawerOpen, setDrawerOpen])

  const close = () => setDrawerOpen(false)

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {drawerOpen && (
          <div className='fixed inset-0 z-[100]'>
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
              className='absolute inset-0 bg-ink/35 backdrop-blur-[2px]'
            />
            <m.div
              ref={panelRef}
              role='dialog'
              aria-modal='true'
              aria-labelledby='cart-title'
              tabIndex={-1}
              initial={reduce ? { opacity: 0 } : { x: '100%' }}
              animate={reduce ? { opacity: 1 } : { x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 40 }}
              className='absolute top-0 right-0 flex h-full w-full max-w-[440px] flex-col bg-page shadow-2xl outline-none'
            >
              <div className='flex items-center justify-between border-b border-line px-6 py-5'>
                <h2 id='cart-title' className='text-[18px] font-medium tracking-[-0.01em]'>
                  Your cart {count > 0 && <span className='text-muted tabular-nums'>({count})</span>}
                </h2>
                <button
                  type='button'
                  onClick={close}
                  aria-label='Close cart'
                  className='grid size-11 place-items-center rounded-full text-ink hover:bg-ink/5'
                >
                  <X className='size-5' strokeWidth={1.6} />
                </button>
              </div>

              {lines.length === 0 ? (
                <div className='flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center'>
                  <span className='grid size-14 place-items-center rounded-full bg-accent-soft text-accent'>
                    <ShoppingBag className='size-6' strokeWidth={1.5} aria-hidden />
                  </span>
                  <p className='text-[17px] font-medium'>Your cart is empty</p>
                  <p className='text-[14.5px] text-muted'>Add equipment from the shop and send us one request for a proforma.</p>
                  <LinkButton to='/shop' onClick={close} className='mt-2'>
                    Browse equipment
                  </LinkButton>
                </div>
              ) : (
                <>
                  <div className='flex-1 overflow-y-auto px-6'>
                    <CartLines compact onNavigate={close} />
                  </div>
                  <div className='border-t border-line px-6 py-5'>
                    <p className='text-[13.5px] leading-relaxed text-muted'>
                      Nothing is paid online. We reply with a proforma invoice showing prices and availability.
                    </p>
                    <div className='mt-4 grid grid-cols-2 gap-2'>
                      <LinkButton to='/cart' variant='outline' onClick={close}>
                        View cart
                      </LinkButton>
                      <LinkButton to='/checkout' onClick={close}>
                        Send request
                      </LinkButton>
                    </div>
                    <Link to='/shop' onClick={close} className='mt-3 block text-center text-[14px] text-muted hover:text-ink'>
                      Continue shopping
                    </Link>
                  </div>
                </>
              )}
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </LazyMotion>
  )
}
