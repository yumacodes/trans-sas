import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { RotateCw, Search, X } from 'lucide-react'
import { PageHeader } from '@/components/site/layout'
import { ProductCard, ProductCardSkeleton } from '@/components/site/product-card'
import { categoriesOf, useProducts } from '@/lib/use-products'
import { cn } from '@/lib/utils'
import { COMPANY, telHref } from '@/lib/company'
import { usePageMeta } from '@/lib/use-page-meta'

/** Products shown at first, and added by each "Load more". */
const PAGE_SIZE = 24
const SEARCH_DEBOUNCE_MS = 250

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'az', label: 'Name, A to Z' },
  { value: 'za', label: 'Name, Z to A' }
] as const

export default function ShopPage() {
  const { data: products, loading, error, reload } = useProducts()
  const [params, setParams] = useSearchParams()

  const q = params.get('q') ?? ''
  const category = params.get('category') ?? 'All'
  const sort = params.get('sort') ?? 'featured'
  const limit = Math.max(PAGE_SIZE, Number.parseInt(params.get('show') ?? '', 10) || PAGE_SIZE)

  usePageMeta({
    title: category !== 'All' ? `${category} equipment` : 'Shop medical equipment',
    description: `Browse ${category !== 'All' ? `${category.toLowerCase()} ` : ''}medical equipment and supplies from ${COMPANY.name}, Accra. Add items to your quote list and we reply with a proforma.`
  })

  // Filters live in the URL, so a filtered view can be shared and survives the back button.
  // Changing a filter starts the list from the top again (drops ?show=).
  const update = (key: string, value: string | null) => {
    setParams(
      prev => {
        const next = new URLSearchParams(prev)

        if (!value || value === 'All' || value === 'featured') next.delete(key)
        else next.set(key, value)
        if (key !== 'show') next.delete('show')

        return next
      },
      { replace: true, preventScrollReset: true }
    )
  }

  // The search box updates instantly; the URL follows once typing pauses.
  const [query, setQuery] = useState(q)
  const typing = useRef(false)

  useEffect(() => {
    if (!typing.current) setQuery(q)
  }, [q])

  useEffect(() => {
    if (!typing.current) return

    const id = window.setTimeout(() => {
      typing.current = false
      if (query !== q) update('q', query)
    }, SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

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
        (!needle ||
          needle
            .split(/\s+/)
            .every(word =>
              `${p.name} ${p.summary} ${p.description} ${p.category ?? ''} ${p.sku} ${p.brand ?? ''} ${p.model ?? ''}`.toLowerCase().includes(word)
            ))
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
        lead='Browse the range, add what you need to your quote list and send one quote request. We reply with a proforma confirming pricing, stock and delivery. Nothing is paid online.'
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
                  value={query}
                  onChange={e => {
                    typing.current = true
                    setQuery(e.target.value)
                  }}
                  placeholder='Search equipment'
                  className='h-10 w-full rounded-full border border-line bg-white pr-9 pl-10 text-[15px] placeholder:text-muted focus:border-accent focus:outline-none'
                />
                {query && (
                  <button
                    type='button'
                    onClick={() => {
                      typing.current = false
                      setQuery('')
                      update('q', null)
                    }}
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
            <p className='mt-1 text-[14.5px] text-muted'>Try again in a moment, or call us and we will help you directly.</p>
            <div className='mt-5 flex flex-wrap gap-2'>
              <button
                type='button'
                onClick={reload}
                className='inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-[14.5px] text-white hover:bg-accent-deep'
              >
                <RotateCw className='size-4' aria-hidden /> Try again
              </button>
              <a href={telHref(COMPANY.phones[0])} className='inline-flex h-11 items-center rounded-full border border-line px-5 text-[14.5px] tabular-nums hover:border-ink/30'>
                Call {COMPANY.phones[0]}
              </a>
            </div>
          </div>
        ) : (
          <div className='mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 xl:grid-cols-4'>
            {loading
              ? Array.from({ length: 8 }, (_, i) => <ProductCardSkeleton key={i} />)
              : results.slice(0, limit).map(p => <ProductCard key={p.slug} product={p} />)}
          </div>
        )}

        {!loading && !error && results.length > limit && (
          <div className='mt-12 flex flex-col items-center gap-3'>
            <p className='text-[14px] text-muted tabular-nums'>
              Showing {limit} of {results.length}
            </p>
            <button
              type='button'
              onClick={() => update('show', String(limit + PAGE_SIZE))}
              className='h-12 rounded-full border border-line bg-white px-6 text-[15px] hover:border-ink/30'
            >
              Load more
            </button>
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
                onClick={() => {
                  typing.current = false
                  setQuery('')
                  setParams(new URLSearchParams(), { replace: true })
                }}
                className='h-11 rounded-full border border-line bg-white px-5 text-[14.5px] hover:border-ink/30'
              >
                Clear filters
              </button>
              <Link to={q.trim() ? `/contact?subject=${encodeURIComponent(`Sourcing: ${q.trim()}`)}` : '/contact?topic=sourcing'} className='inline-flex h-11 items-center rounded-full bg-accent px-5 text-[14.5px] text-white hover:bg-accent-deep'>
                Ask us to source it
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
