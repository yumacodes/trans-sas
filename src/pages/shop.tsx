import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { PageHeader } from '@/components/site/layout'
import { ProductCard, ProductCardSkeleton } from '@/components/site/product-card'
import { categoriesOf, useProducts } from '@/lib/use-products'
import { cn } from '@/lib/utils'

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'az', label: 'Name, A to Z' },
  { value: 'za', label: 'Name, Z to A' }
] as const

export default function ShopPage() {
  const { data: products, loading, error } = useProducts()
  const [params, setParams] = useSearchParams()

  const q = params.get('q') ?? ''
  const category = params.get('category') ?? 'All'
  const sort = params.get('sort') ?? 'featured'

  // Filters live in the URL, so a filtered view can be shared and survives the back button.
  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)

    if (!value || value === 'All' || value === 'featured') next.delete(key)
    else next.set(key, value)

    setParams(next, { replace: true })
  }

  const categories = useMemo(() => categoriesOf(products), [products])
  const counts = useMemo(
    () => Object.fromEntries([['All', products.length], ...categories.map(c => [c.name, c.count])]) as Record<string, number>,
    [products, categories]
  )

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const list = products.filter(
      p =>
        (category === 'All' || p.category === category) &&
        (!needle || `${p.name} ${p.summary} ${p.category ?? ''} ${p.sku} ${p.brand ?? ''}`.toLowerCase().includes(needle))
    )

    if (sort === 'az') return [...list].sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'za') return [...list].sort((a, b) => b.name.localeCompare(a.name))

    return list
  }, [products, q, category, sort])

  return (
    <>
      <PageHeader
        eyebrow='Shop'
        title='Medical equipment & supplies'
        lead='Browse the range, add what you need to your cart and send one order request. We confirm pricing, stock and delivery before anything is charged.'
      />

      <div className='frame py-10 lg:py-14'>
        {/* Toolbar */}
        <div className='sticky top-[var(--nav-space)] z-30 -mx-[var(--gutter)] border-b border-line/70 bg-page/90 px-[var(--gutter)] py-4 backdrop-blur-md'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
            <div role='group' aria-label='Filter by category' className='scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1'>
              {['All', ...categories.map(c => c.name)].map(c => (
                <button
                  key={c}
                  type='button'
                  onClick={() => update('category', c)}
                  aria-pressed={category === c}
                  className={cn(
                    'inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-[14px] transition-colors duration-200',
                    category === c ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink hover:border-ink/30'
                  )}
                >
                  {c}
                  <span className={cn('text-[12px] tabular-nums', category === c ? 'text-white/60' : 'text-muted')}>{counts[c] ?? 0}</span>
                </button>
              ))}
            </div>

            <div className='flex gap-2'>
              <label className='relative flex-1 lg:w-72 lg:flex-none'>
                <span className='sr-only'>Search products</span>
                <Search className='pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted' aria-hidden />
                <input
                  type='search'
                  value={q}
                  onChange={e => update('q', e.target.value)}
                  placeholder='Search equipment'
                  className='h-10 w-full rounded-full border border-line bg-white pr-9 pl-10 text-[15px] placeholder:text-muted/80 focus:border-accent focus:outline-none'
                />
                {q && (
                  <button
                    type='button'
                    onClick={() => update('q', null)}
                    aria-label='Clear search'
                    className='absolute top-1/2 right-1 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted hover:text-ink'
                  >
                    <X className='size-4' aria-hidden />
                  </button>
                )}
              </label>
              <label className='relative'>
                <span className='sr-only'>Sort products</span>
                <select
                  value={sort}
                  onChange={e => update('sort', e.target.value)}
                  className='h-10 appearance-none rounded-full border border-line bg-white pr-9 pl-4 text-[14px] text-ink focus:border-accent focus:outline-none'
                >
                  {SORTS.map(s => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <svg aria-hidden viewBox='0 0 12 12' className='pointer-events-none absolute top-1/2 right-3.5 size-3 -translate-y-1/2 text-muted'>
                  <path d='M2.5 4.5 6 8l3.5-3.5' fill='none' stroke='currentColor' strokeWidth='1.4' strokeLinecap='round' />
                </svg>
              </label>
            </div>
          </div>
        </div>

        <p className='mt-6 text-[14px] text-muted' aria-live='polite'>
          {loading ? 'Loading products…' : `${results.length} product${results.length === 1 ? '' : 's'}`}
          {category !== 'All' && !loading && <> in {category}</>}
          {q && !loading && <> matching “{q}”</>}
        </p>

        {error ? (
          <div role='alert' className='mt-10 rounded-2xl border border-warn/30 bg-white p-8'>
            <p className='font-medium'>We couldn't load the catalogue.</p>
            <p className='mt-1 text-[14.5px] text-muted'>Please refresh the page, or call us and we will help you directly.</p>
          </div>
        ) : (
          <div className='mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 xl:grid-cols-4'>
            {loading ? Array.from({ length: 8 }, (_, i) => <ProductCardSkeleton key={i} />) : results.map(p => <ProductCard key={p.slug} product={p} />)}
          </div>
        )}

        {!loading && !error && results.length === 0 && (
          <div className='mt-4 rounded-2xl border border-dashed border-line p-10 text-center'>
            <p className='text-[17px] font-medium'>Nothing matches that search</p>
            <p className='mt-2 text-[14.5px] text-muted'>
              We supply more than we list online. Ask us and we will source it.
            </p>
            <div className='mt-5 flex justify-center gap-2'>
              <button
                type='button'
                onClick={() => setParams(new URLSearchParams(), { replace: true })}
                className='h-11 rounded-full border border-line bg-white px-5 text-[14.5px] hover:border-ink/30'
              >
                Clear filters
              </button>
              <Link to={`/contact?subject=${encodeURIComponent(`Sourcing: ${q}`)}`} className='inline-flex h-11 items-center rounded-full bg-accent px-5 text-[14.5px] text-white hover:bg-accent-deep'>
                Ask us to source it
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
