import { ArrowRight, ShoppingBag } from 'lucide-react'
import { LinkButton } from '@/components/ui/button'
import { PageHeader } from '@/components/site/layout'
import { CartLines, useResolvedCart } from '@/components/site/cart-lines'
import { OrderSummary } from '@/components/site/order-summary'
import { useCart } from '@/lib/cart'

export default function CartPage() {
  const { count, clear } = useCart()
  const { lines, loading } = useResolvedCart()

  return (
    <>
      <PageHeader eyebrow='Cart' title={count ? `Your cart (${count})` : 'Your cart'} />
      <div className='frame py-10 lg:py-14'>
        {!loading && lines.length === 0 ? (
          <div className='mx-auto flex max-w-md flex-col items-center py-16 text-center'>
            <span className='grid size-16 place-items-center rounded-full bg-accent-soft text-accent'>
              <ShoppingBag className='size-7' strokeWidth={1.5} aria-hidden />
            </span>
            <h2 className='mt-6 text-[22px] font-medium tracking-[-0.02em]'>Nothing here yet</h2>
            <p className='mt-2 text-muted'>Add equipment from the shop. You can send one request for everything you need.</p>
            <LinkButton to='/shop' className='mt-8' flip>
              Browse equipment <ArrowRight className='size-4' aria-hidden />
            </LinkButton>
          </div>
        ) : (
          <div className='grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14'>
            <div>
              <div className='border-t border-line'>
                <CartLines />
              </div>
              <div className='flex items-center justify-between border-t border-line pt-5'>
                <LinkButton to='/shop' variant='ghost' className='-ml-4'>
                  Continue shopping
                </LinkButton>
                <button type='button' onClick={clear} className='h-11 px-2 text-[14px] text-muted hover:text-warn'>
                  Clear cart
                </button>
              </div>
            </div>
            <OrderSummary>
              <LinkButton to='/checkout' size='lg' className='mt-6 w-full' flip>
                Request a proforma <ArrowRight className='size-4' aria-hidden />
              </LinkButton>
            </OrderSummary>
          </div>
        )}
      </div>
    </>
  )
}
