import type { ReactNode } from 'react'
import { FileText } from 'lucide-react'
import { useResolvedCart } from '@/components/site/cart-lines'

/** What will be sent: products and quantities. Prices come on the proforma, never here. */
export function OrderSummary({ children, showLines = false }: { children?: ReactNode; showLines?: boolean }) {
  const { lines, count } = useResolvedCart()

  return (
    <aside className='h-fit rounded-3xl border border-line bg-white p-6 lg:sticky lg:top-[calc(var(--nav-space)+24px)]'>
      <h2 className='text-[18px] font-medium tracking-[-0.01em]'>Your request</h2>

      {showLines && (
        <ul className='mt-5 space-y-3 border-b border-line pb-5 text-[14.5px]'>
          {lines.map(({ product, qty }) => (
            <li key={product.slug} className='flex justify-between gap-4'>
              <span className='min-w-0'>{product.name}</span>
              <span className='shrink-0 text-muted tabular-nums'>× {qty}</span>
            </li>
          ))}
        </ul>
      )}

      <dl className='mt-5 space-y-3 text-[15px]'>
        <div className='flex justify-between'>
          <dt className='text-muted'>Products</dt>
          <dd className='tabular-nums'>{lines.length}</dd>
        </div>
        <div className='flex justify-between'>
          <dt className='text-muted'>Total quantity</dt>
          <dd className='tabular-nums'>{count}</dd>
        </div>
        <div className='flex justify-between'>
          <dt className='text-muted'>Delivery</dt>
          <dd className='text-accent'>Free</dd>
        </div>
      </dl>

      <p className='mt-5 flex gap-2.5 rounded-xl bg-accent-soft/70 p-3.5 text-[13.5px] leading-relaxed text-ink/80'>
        <FileText className='mt-0.5 size-4 shrink-0 text-accent' aria-hidden />
        Nothing is paid online. We prepare a proforma invoice with prices and availability, and send it to you to confirm.
      </p>
      {children}
    </aside>
  )
}
