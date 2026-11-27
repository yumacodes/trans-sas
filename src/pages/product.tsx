import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, Check, ChevronRight, MessageCircle, Phone, RotateCw } from 'lucide-react'
import { Button, LinkButton } from '@/components/ui/button'
import { ProductImage } from '@/components/ui/product-image'
import { ProductCard } from '@/components/site/product-card'
import { QtyStepper } from '@/components/site/cart-lines'
import { TrustBand } from '@/components/site/trust-band'
import { useCart } from '@/lib/cart'
import { COMPANY, telHref, whatsappHref } from '@/lib/company'
import { usePageMeta } from '@/lib/use-page-meta'
import { cn } from '@/lib/utils'
import { useProduct, useProducts } from '@/lib/use-products'

export default function ProductPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { data: product, loading, error, reload } = useProduct(slug)
  const { data: all } = useProducts()
  const { add, setDrawerOpen } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [shown, setShown] = useState(0)

  usePageMeta(
    product
      ? { title: product.name, description: product.summary || product.description || `${product.name} from ${COMPANY.name}, Accra.`, image: product.image }
      : error
        ? { title: 'Product unavailable', noindex: true }
        : loading
          ? {}
          : { title: 'Product not found', noindex: true }
  )

  // A new product starts on its first photo, with a quantity of one.
  useEffect(() => {
    setShown(0)
    setQty(1)
  }, [slug])

  if (loading)
    return (
      <div className='frame grid animate-pulse gap-10 py-12 lg:grid-cols-2' aria-busy='true'>
        <div className='aspect-square rounded-3xl bg-ink/[0.06]' />
        <div className='space-y-4 pt-6'>
          <div className='h-4 w-1/4 rounded bg-ink/[0.06]' />
          <div className='h-10 w-3/4 rounded bg-ink/[0.06]' />
          <div className='h-24 rounded bg-ink/[0.06]' />
        </div>
      </div>
    )

  if (error)
    return (
      <div className='frame py-24 text-center' role='alert'>
        <p className='eyebrow'>Connection problem</p>
        <h1 className='h2 mt-4 font-normal'>We couldn't load this product right now</h1>
        <p className='mx-auto mt-4 max-w-lg text-muted'>
          Our catalogue didn't respond. Try again in a moment, or call or WhatsApp us and we will help you directly.
        </p>
        <div className='mt-8 flex flex-wrap justify-center gap-3'>
          <Button onClick={reload}>
            <RotateCw className='mr-2 size-4' aria-hidden /> Try again
          </Button>
          <a
            href={telHref(COMPANY.phones[0])}
            className='inline-flex h-12 items-center gap-2 rounded-full border border-line bg-white px-6 text-[15px] tabular-nums hover:border-ink/30'
          >
            <Phone className='size-4' aria-hidden /> {COMPANY.phones[0]}
          </a>
          <a
            href={whatsappHref(`Hello, I'm interested in product ${slug?.toUpperCase() ?? ''}.`)}
            target='_blank'
            rel='noreferrer'
            className='inline-flex h-12 items-center gap-2 rounded-full border border-line bg-white px-6 text-[15px] hover:border-ink/30'
          >
            <MessageCircle className='size-4' aria-hidden /> WhatsApp us
          </a>
        </div>
      </div>
    )

  if (!product)
    return (
      <div className='frame py-24 text-center'>
        <p className='eyebrow'>Not found</p>
        <h1 className='h2 mt-4 font-normal'>We couldn't find that product</h1>
        <p className='mt-4 text-muted'>It may have been renamed or removed from the catalogue.</p>
        <LinkButton to='/shop' className='mt-8'>
          Back to the shop
        </LinkButton>
      </div>
    )

  const related = all
    .filter(p => p.slug !== product.slug && p.category === product.category && p.image)
    .slice(0, 4)

  const handleAdd = () => {
    add(product.slug, qty)
    setAdded(true)
    setDrawerOpen(true)
    window.setTimeout(() => setAdded(false), 1800)
  }

  const handleBuyNow = () => {
    add(product.slug, qty)
    navigate('/quote/send')
  }

  const whatsapp = whatsappHref(`Hello, I'm interested in the ${product.name} (${product.sku}).`)

  return (
    <>
      <div className='frame pt-6'>
        <nav aria-label='Breadcrumb'>
          <ol className='flex flex-wrap items-center gap-1.5 text-[13.5px] text-muted'>
            <li>
              <Link to='/' className='hover:text-ink'>
                Home
              </Link>
            </li>
            <ChevronRight className='size-3.5' aria-hidden />
            <li>
              <Link to='/shop' className='hover:text-ink'>
                Shop
              </Link>
            </li>
            <ChevronRight className='size-3.5' aria-hidden />
            <li>
              <Link to={product.category ? `/shop?category=${encodeURIComponent(product.category)}` : '/shop'} className='hover:text-ink'>
                {product.category ?? 'All equipment'}
              </Link>
            </li>
            <ChevronRight className='size-3.5' aria-hidden />
            <li aria-current='page' className='truncate text-ink'>
              {product.name}
            </li>
          </ol>
        </nav>
      </div>

      <section className='frame grid gap-10 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-12'>
        <div className='lg:sticky lg:top-[calc(var(--nav-space)+24px)] lg:self-start'>
          <ProductImage
            key={product.images[shown] ?? 'none'}
            src={product.images[shown] ?? product.image}
            alt={product.name}
            eager
            sizes='(min-width: 1024px) 50vw, 100vw'
            className='aspect-square rounded-3xl border border-line/60 bg-gradient-to-b from-white to-[#eceff7]'
          />
          {product.images.length > 1 && (
            <ul className='mt-3 flex gap-2' aria-label='Product photos'>
              {product.images.map((src, i) => (
                <li key={src}>
                  <button
                    type='button'
                    onClick={() => setShown(i)}
                    aria-label={`Photo ${i + 1}`}
                    aria-current={i === shown}
                    className={cn('block overflow-hidden rounded-xl border-2', i === shown ? 'border-accent' : 'border-transparent')}
                  >
                    <ProductImage src={src} alt='' sizes='64px' className='size-16 rounded-lg' />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className='flex flex-col'>
          <p className='eyebrow flex items-center gap-3'>
            <span aria-hidden className='dot size-2 rounded-full bg-accent' />
            {product.category ?? 'Equipment'}
          </p>
          <h1 className='mt-4 text-[clamp(1.9rem,1.4rem+1.6vw,2.75rem)] leading-[1.08] font-normal tracking-[-0.03em]'>{product.name}</h1>
          <p className='mt-4 text-[18px] leading-relaxed text-muted'>{product.summary}</p>

          <dl className='mt-8 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-line pt-6 text-[14px] sm:grid-cols-3'>
            {[
              ['Item code', product.sku],
              ['Brand', product.brand],
              ['Model', product.model]
            ]
              .filter((row): row is [string, string] => Boolean(row[1]))
              .map(([label, value]) => (
                <div key={label}>
                  <dt className='text-muted'>{label}</dt>
                  <dd className='mt-0.5 font-medium'>{value}</dd>
                </div>
              ))}
          </dl>
          <p className='mt-4 text-[14.5px] text-muted'>
            Price on request. Add it to your quote list and send the request: we reply with a proforma invoice.
          </p>

          <div className='mt-6 flex flex-wrap items-center gap-3'>
            <QtyStepper value={qty} onChange={v => setQty(Math.max(1, v))} label={product.name} />
            <Button onClick={handleAdd} size='lg' className='flex-1 sm:flex-none' aria-live='polite'>
              {added ? (
                <>
                  <Check className='mr-2 size-4' aria-hidden /> Added
                </>
              ) : (
                'Add to quote'
              )}
            </Button>
            <Button onClick={handleBuyNow} variant='dark' size='lg' className='flex-1 sm:flex-none'>
              Request quote now
            </Button>
          </div>
          <a href={whatsapp} target='_blank' rel='noreferrer' className='mt-4 inline-flex items-center gap-2 text-[14.5px] text-ink hover:text-accent'>
            <MessageCircle className='size-4' aria-hidden /> Ask about this on WhatsApp
          </a>

          <div className='mt-10'>
            <h2 className='text-[13px] font-medium tracking-[0.16em] text-muted uppercase'>Overview</h2>
            <p className='mt-3 text-[16px] leading-[1.7] whitespace-pre-line text-ink/85'>{product.description || product.summary}</p>
          </div>

          {product.features.length > 0 && (
          <div className='mt-8'>
            <h2 className='text-[13px] font-medium tracking-[0.16em] text-muted uppercase'>Key features</h2>
            <ul className='mt-3 divide-y divide-line rounded-2xl border border-line bg-white'>
              {product.features.map(f => (
                <li key={f} className='flex gap-3 px-5 py-3.5 text-[15px]'>
                  <Check className='mt-0.5 size-4 shrink-0 text-accent' aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          )}

          <TrustBand generic className='mt-8' />
        </div>
      </section>

      {related.length > 0 && (
        <section className='border-t border-line/70 bg-white/50'>
          <div className='frame py-16 lg:py-20'>
            <div className='flex items-end justify-between gap-4'>
              <h2 className='text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-normal tracking-[-0.025em]'>
                {product.category ? `More in ${product.category}` : 'More equipment'}
              </h2>
              <Link
                to={product.category ? `/shop?category=${encodeURIComponent(product.category)}` : '/shop'}
                className='inline-flex items-center gap-1.5 text-[14.5px] font-medium hover:text-accent'
              >
                View all <ArrowRight className='size-4' aria-hidden />
              </Link>
            </div>
            <div className='mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4'>
              {related.map(p => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
