import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { ProductImage } from '@/components/ui/product-image'
import { useCart } from '@/lib/cart'
import { useProducts } from '@/lib/use-products'
import type { Product } from '@/lib/types'
import { cn } from '@/lib/utils'

export type ResolvedLine = { product: Product; qty: number }

/** Cart lines joined to their products. Lines whose product no longer exists are dropped. */
export function useResolvedCart() {
  const { lines } = useCart()
  const { data, loading } = useProducts()
  const bySlug = new Map(data.map(p => [p.slug, p]))
  const resolved: ResolvedLine[] = lines.flatMap(l => {
    const product = bySlug.get(l.slug)

    return product ? [{ product, qty: l.qty }] : []
  })

  return { lines: resolved, loading, count: resolved.reduce((n, l) => n + l.qty, 0) }
}

export function QtyStepper({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  return (
    <div className='inline-flex h-10 items-center rounded-full border border-line bg-white' role='group' aria-label={`Quantity of ${label}`}>
      <button
        type='button'
        onClick={() => onChange(value - 1)}
        aria-label='Decrease quantity'
        className='grid h-full w-10 place-items-center rounded-l-full text-ink hover:bg-ink/5'
      >
        <Minus className='size-3.5' aria-hidden />
      </button>
      <span className='w-8 text-center text-[14.5px] font-medium tabular-nums' aria-live='polite'>
        {value}
      </span>
      <button
        type='button'
        onClick={() => onChange(value + 1)}
        disabled={value >= 99}
        aria-label='Increase quantity'
        className='grid h-full w-10 place-items-center rounded-r-full text-ink hover:bg-ink/5 disabled:opacity-40'
      >
        <Plus className='size-3.5' aria-hidden />
      </button>
    </div>
  )
}

export function CartLines({ compact = false, onNavigate }: { compact?: boolean; onNavigate?: () => void }) {
  const { setQty, remove } = useCart()
  const { lines, loading } = useResolvedCart()

  if (loading) return <p className='py-8 text-[14px] text-muted'>Loading your cart…</p>

  return (
    <ul className='divide-y divide-line'>
      {lines.map(({ product, qty }) => (
        <li key={product.slug} className={cn('flex gap-4', compact ? 'py-5' : 'py-6')}>
          <Link to={`/shop/${product.slug}`} onClick={onNavigate} className='shrink-0'>
            <ProductImage src={product.image} alt={product.name} className={cn('rounded-xl', compact ? 'size-20' : 'size-24 sm:size-28')} />
          </Link>
          <div className='flex min-w-0 flex-1 flex-col'>
            <div className='flex items-start justify-between gap-3'>
              <div className='min-w-0'>
                <Link
                  to={`/shop/${product.slug}`}
                  onClick={onNavigate}
                  className='text-[15.5px] leading-snug font-medium text-ink hover:text-accent'
                >
                  {product.name}
                </Link>
                <p className='mt-1 text-[13px] text-muted'>{product.category ?? product.sku}</p>
              </div>
              <button
                type='button'
                onClick={() => remove(product.slug)}
                aria-label={`Remove ${product.name}`}
                className='-mt-2 -mr-2 grid size-10 shrink-0 place-items-center rounded-full text-muted hover:bg-ink/5 hover:text-warn'
              >
                <Trash2 className='size-4' aria-hidden />
              </button>
            </div>
            <div className='mt-auto flex items-center justify-between gap-3 pt-3'>
              <QtyStepper value={qty} onChange={v => setQty(product.slug, v)} label={product.name} />
              <p className='text-[13px] text-muted'>Item {product.sku}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
