import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ClipboardList } from 'lucide-react'
import { LinkButton } from '@/components/ui/button'
import { PageHeader } from '@/components/site/layout'
import { CartLines, CatalogueError, useResolvedCart } from '@/components/site/cart-lines'
import { OrderSummary } from '@/components/site/order-summary'
import { useCart } from '@/lib/cart'
import { usePageMeta } from '@/lib/use-page-meta'
import type { CartLine } from '@/lib/types'

const UNDO_MS = 8000

export default function CartPage() {
  usePageMeta({ title: 'Your quote list', description: 'Equipment you have added for a quote. Send one request and we reply with a proforma.', noindex: true })
  const { count, clear, restore } = useCart()
  const { saved, error, reload } = useResolvedCart()
  // What "Clear list" removed, kept for a few seconds so it can be undone.
  const [cleared, setCleared] = useState<CartLine[] | null>(null)

  useEffect(() => {
    if (!cleared) return

    const id = window.setTimeout(() => setCleared(null), UNDO_MS)

    return () => window.clearTimeout(id)
  }, [cleared])

  const handleClear = () => {
    setCleared(saved)
    clear()
  }

  const handleUndo = () => {
    if (cleared) restore(cleared)
    setCleared(null)
  }

  return (
    <>
      <PageHeader eyebrow='Quote list' title={count ? `Your quote list (${count})` : 'Your quote list'} />
      <div className='frame py-10 lg:py-14'>
        {saved.length === 0 ? (
          <div className='mx-auto flex max-w-md flex-col items-center py-16 text-center'>
            <span className='grid size-16 place-items-center rounded-full bg-accent-soft text-accent'>
              <ClipboardList className='size-7' strokeWidth={1.5} aria-hidden />
            </span>
            <h2 className='mt-6 text-[22px] font-medium tracking-[-0.02em]'>Your quote list is empty</h2>
            <p className='mt-2 text-muted'>
              Add equipment from the shop and send one quote request for everything you need. We reply with a proforma invoice.
            </p>
            <LinkButton to='/shop' className='mt-8' flip>
              Browse equipment <ArrowRight className='size-4' aria-hidden />
            </LinkButton>
            <p className='mt-6 text-[14.5px] text-muted'>
              Have a tender document or a long list?{' '}
              <Link to='/contact?topic=quotation' className='text-ink underline underline-offset-2 hover:text-accent'>
                Send it to us as a message
              </Link>
              .
            </p>
          </div>
        ) : error ? (
          <CatalogueError count={saved.length} onRetry={reload} />
        ) : (
          <div className='grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14'>
            <div>
              <div className='border-t border-line'>
                <CartLines />
              </div>
              <div className='flex items-center justify-between border-t border-line pt-5'>
                <LinkButton to='/shop' variant='ghost' className='-ml-4'>
                  Keep browsing
                </LinkButton>
                <button type='button' onClick={handleClear} className='h-11 px-2 text-[14px] text-muted hover:text-warn'>
                  Clear list
                </button>
              </div>
            </div>
            <OrderSummary>
              <LinkButton to='/quote/send' size='lg' className='mt-6 w-full' flip>
                Request quote <ArrowRight className='size-4' aria-hidden />
              </LinkButton>
            </OrderSummary>
          </div>
        )}
      </div>

      {cleared && (
        <div
          role='status'
          className='fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-full bg-ink py-2 pr-2 pl-5 text-[14.5px] text-white shadow-lg'
        >
          Quote list cleared.
          <button type='button' onClick={handleUndo} className='h-9 rounded-full bg-white/15 px-4 font-medium hover:bg-white/25'>
            Undo
          </button>
        </div>
      )}
    </>
  )
}
