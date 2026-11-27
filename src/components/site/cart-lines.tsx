import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Phone, Plus, RotateCw, Trash2 } from 'lucide-react'
import { ProductImage } from '@/components/ui/product-image'
import { useCart } from '@/lib/cart'
import { useProducts } from '@/lib/use-products'
import { COMPANY, telHref, whatsappHref } from '@/lib/company'
import type { Product } from '@/lib/types'
import { cn } from '@/lib/utils'

export type ResolvedLine = { product: Product; qty: number }

/**
 * Quote-list lines joined to their products. While the catalogue is loading or failed to load,
 * `lines` is empty but `saved` still holds what the visitor added: nothing is thrown away.
 */
export function useResolvedCart() {
  const { lines: saved } = useCart()
  const { data, loading, error, reload } = useProducts()
  const bySlug = new Map(data.map(p => [p.slug, p]))
  const resolved = resolveLines(saved, bySlug)

  return { lines: resolved, saved, loading, error, reload, count: resolved.reduce((n, l) => n + l.qty, 0) }
}

const resolveLines = (saved: { slug: string; qty: number }[], bySlug: Map<string, Product>): ResolvedLine[] =>
  saved.flatMap(l => {
    const product = bySlug.get(l.slug)

    return product ? [{ product, qty: l.qty }] : []
  })

/**
 * Once the catalogue has loaded successfully, lines for products that are no longer listed are
 * removed, so the navbar count always matches the list. Never runs on a failed load.
 */
export function QuoteListSync() {
  const { prune } = useCart()
  const { data, loading, error } = useProducts()

  useEffect(() => {
    if (loading || error || data.length === 0) return

    const known = new Set(data.map(p => p.slug))

    prune(slug => known.has(slug))
  }, [data, loading, error, prune])

  return null
}

/** Shown when product details can't be loaded: the saved list is kept, with a retry and a phone number. */
export function CatalogueError({ count, onRetry, className }: { count: number; onRetry: () => void; className?: string }) {
  return (
    <div role='alert' className={cn('rounded-2xl border border-warn/30 bg-white p-6 sm:p-8', className)}>
      <p className='text-[17px] font-medium'>We couldn't load the product details.</p>
      <p className='mt-2 text-[14.5px] leading-relaxed text-muted'>
        {count > 0
          ? `Your ${count} saved item${count === 1 ? ' is' : 's are'} still in your quote list. Try again in a moment, or call or WhatsApp us and we will take the request directly.`
          : 'Try again in a moment, or call or WhatsApp us and we will help you directly.'}
      </p>
      <div className='mt-5 flex flex-wrap gap-2'>
        <button
          type='button'
          onClick={onRetry}
          className='inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-[14.5px] text-white hover:bg-accent-deep'
        >
          <RotateCw className='size-4' aria-hidden /> Try again
        </button>
        <a href={telHref(COMPANY.phones[0])} className='inline-flex h-11 items-center gap-2 rounded-full border border-line bg-white px-5 text-[14.5px] tabular-nums hover:border-ink/30'>
          <Phone className='size-4' aria-hidden /> {COMPANY.phones[0]}
        </a>
        <a
          href={whatsappHref('Hello, I would like a quote for some equipment.')}
          target='_blank'
          rel='noreferrer'
          className='inline-flex h-11 items-center rounded-full border border-line bg-white px-5 text-[14.5px] hover:border-ink/30'
        >
          WhatsApp us
        </a>
      </div>
    </div>
  )
}

export function QtyStepper({ value, onChange, label, min = 1 }: { value: number; onChange: (v: number) => void; label: string; min?: number }) {
  return (
    <div className='inline-flex h-10 items-center rounded-full border border-line bg-white' role='group' aria-label={`Quantity of ${label}`}>
      <button
        type='button'
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label='Decrease quantity'
        className='grid h-full w-10 place-items-center rounded-l-full text-ink hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent'
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
  const { lines, saved, loading, error, reload } = useResolvedCart()

  if (loading) return <p className='py-8 text-[14px] text-muted'>Loading your quote list…</p>
  if (error) return <CatalogueError count={saved.length} onRetry={reload} className='my-6' />

  return (
    <ul className='divide-y divide-line'>
      {lines.map(({ product, qty }) => (
        <li key={product.slug} className={cn('flex gap-4', compact ? 'py-5' : 'py-6')}>
          <Link to={`/shop/${product.slug}`} onClick={onNavigate} className='shrink-0'>
            <ProductImage src={product.image} alt={product.name} sizes='112px' className={cn('rounded-xl', compact ? 'size-20' : 'size-24 sm:size-28')} />
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
