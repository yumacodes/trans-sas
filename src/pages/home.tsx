import { Link } from 'react-router-dom'
import {
  Accessibility,
  ArrowRight,
  ArrowUpRight,
  Baby,
  Bed,
  FlaskConical,
  HeartPulse,
  Microscope,
  Package,
  Scissors,
  ShieldCheck,
  Stethoscope,
  Truck,
  Wrench
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import ProductStageHero from '@/components/ui/product-stage-hero'
import { LinkButton } from '@/components/ui/button'
import { SectionHeading } from '@/components/site/layout'
import { ProductCard, ProductCardSkeleton } from '@/components/site/product-card'
import { HERO_SLUGS } from '@/data/catalog'
import { categoriesOf, useProducts } from '@/lib/use-products'
import { COMPANY, telHref } from '@/lib/company'
import { cn } from '@/lib/utils'
import { usePageMeta } from '@/lib/use-page-meta'
import type { Product } from '@/lib/types'

/** An icon for a category, guessed from its name; anything unmatched gets a neutral box. */
const CATEGORY_ICONS: [RegExp, LucideIcon][] = [
  [/mobil|wheel|walk|chair|patient/i, Accessibility],
  [/diagnos|monitor|medical/i, HeartPulse],
  [/surg|theat|cauter/i, Scissors],
  [/lab|scien|micro/i, Microscope],
  [/neonat|infant|baby|matern/i, Baby],
  [/furnit|bed|couch/i, Bed],
  [/consum|steril|disinf/i, FlaskConical],
  [/exam|stetho|clinic/i, Stethoscope]
]

const iconFor = (category: string) => CATEGORY_ICONS.find(([re]) => re.test(category))?.[1] ?? Package

const HERO_COUNT = 5

/** Hero products: the curated slugs that exist in the live catalogue, else the first products with photos. */
function heroProductsFrom(products: Product[]) {
  const curated = HERO_SLUGS.map(slug => products.find(p => p.slug === slug && p.image)).filter((p): p is Product => Boolean(p))

  return curated.length >= 2 ? curated : products.filter(p => p.image).slice(0, HERO_COUNT)
}

const SERVICES = [
  { title: 'Supply', body: 'Medical equipment and non-drug consumables for public projects, private facilities and individual buyers.', icon: ShieldCheck },
  { title: 'Free delivery', body: `We deliver equipment orders to your facility, and pride ourselves on how quickly we do it. ${COMPANY.deliveryNote}`, icon: Truck },
  { title: 'Repairs', body: 'Broken equipment comes back into service. Tell us the make and the fault and we take it from there.', icon: Wrench }
]

export default function HomePage() {
  usePageMeta({})
  const { data: products, loading, error, reload } = useProducts()
  const heroProducts = heroProductsFrom(products)
  const featured = products.filter(p => p.image).slice(0, 8)
  const categories = categoriesOf(products).slice(0, 5)

  return (
    <>
      <ProductStageHero products={heroProducts} loading={loading} />

      {/* Who we serve: a quiet band of facts instead of fake logos. */}
      <section aria-label='Who we serve' className='border-y border-line/70 bg-white/60'>
        <div className='frame grid grid-cols-2 gap-y-6 py-8 text-[14px] text-muted md:grid-cols-4'>
          {['Government hospitals', 'Private hospitals & clinics', 'Health professionals', 'Families & home care'].map(label => (
            <p key={label} className='flex items-center gap-3'>
              <span aria-hidden className='size-1.5 rounded-full bg-accent' />
              {label}
            </p>
          ))}
        </div>
      </section>

      {/* Ranges */}
      <section className='frame py-20 lg:py-28'>
        <SectionHeading
          eyebrow='The range'
          title={
            <>
              One supplier, <span className='text-muted'>from the ward to the lab.</span>
            </>
          }
          action={
            <LinkButton to='/shop' variant='outline' flip>
              Shop all equipment <ArrowRight className='size-4' aria-hidden />
            </LinkButton>
          }
        />
        {loading ? (
          <ul aria-hidden className='mt-12 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-5'>
            {Array.from({ length: 5 }, (_, i) => (
              <li key={i} className='h-52 animate-pulse bg-page' />
            ))}
          </ul>
        ) : categories.length > 0 ? (
          <ul
            className={cn(
              'mt-12 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2',
              categories.length >= 5 ? 'lg:grid-cols-5' : categories.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
            )}
          >
            {categories.map(({ name, count }) => {
              const Icon = iconFor(name)

              return (
                <li key={name} className='bg-page'>
                  <Link
                    to={`/shop?category=${encodeURIComponent(name)}`}
                    className='group flex h-full flex-col p-6 transition-colors duration-300 hover:bg-white lg:p-7'
                  >
                    <span className='grid size-11 place-items-center rounded-xl bg-accent-soft text-accent'>
                      <Icon className='size-5' strokeWidth={1.6} aria-hidden />
                    </span>
                    <h3 className='mt-8 text-[17px] leading-snug font-medium tracking-[-0.01em]'>{name}</h3>
                    <p className='mt-2 text-[14px] text-muted tabular-nums'>
                      {count} product{count === 1 ? '' : 's'}
                    </p>
                    <span className='mt-6 inline-flex items-center gap-1 text-[14px] font-medium text-ink'>
                      Explore
                      <ArrowUpRight
                        className='size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                        aria-hidden
                      />
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className='mt-12 text-[15px] text-muted'>
            <Link to='/shop' className='text-ink underline underline-offset-2 hover:text-accent'>
              Browse the full range in the shop
            </Link>
            .
          </p>
        )}
      </section>

      {/* Featured products */}
      <section className='border-t border-line/70 bg-white/50'>
        <div className='frame py-20 lg:py-28'>
          <SectionHeading
            eyebrow='In the shop'
            title='Equipment our customers order most'
            lead='Add items to your quote list and send one quote request. Our sales team replies with a proforma confirming pricing, stock and delivery.'
            action={
              <Link to='/shop' className='inline-flex items-center gap-1.5 text-[15px] font-medium text-ink hover:text-accent'>
                View all {products.length > 0 && <span className='text-muted tabular-nums'>({products.length})</span>}
                <ArrowRight className='size-4' aria-hidden />
              </Link>
            }
          />
          {error ? (
            <div role='alert' className='mt-12 rounded-2xl border border-warn/30 bg-white p-8'>
              <p className='font-medium'>We couldn't load the catalogue just now.</p>
              <p className='mt-1 text-[14.5px] text-muted'>
                Try again in a moment, or call{' '}
                <a href={telHref(COMPANY.phones[0])} className='text-ink underline underline-offset-2 tabular-nums'>
                  {COMPANY.phones[0]}
                </a>{' '}
                and we will help you directly.
              </p>
              <button
                type='button'
                onClick={reload}
                className='mt-5 inline-flex h-11 items-center rounded-full bg-accent px-5 text-[14.5px] text-white hover:bg-accent-deep'
              >
                Try again
              </button>
            </div>
          ) : (
            <div className='mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4'>
              {loading
                ? Array.from({ length: 8 }, (_, i) => <ProductCardSkeleton key={i} />)
                : featured.map(p => <ProductCard key={p.slug} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Services */}
      <section className='frame py-20 lg:py-28'>
        <div className='grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20'>
          <SectionHeading
            eyebrow='What we do'
            title='Supplied, delivered, and kept running.'
            lead='Since 1981 we have grown from a trading company into a medical supplier that hospitals rely on for the whole life of their equipment.'
          />
          <ol className='grid gap-4'>
            {SERVICES.map(({ title, body, icon: Icon }, i) => (
              <li key={title} className='flex gap-5 rounded-2xl border border-line bg-white p-6'>
                <span className='text-[13px] font-medium text-muted tabular-nums'>{String(i + 1).padStart(2, '0')}</span>
                <div className='flex-1'>
                  <h3 className='flex items-center gap-2.5 text-[18px] font-medium tracking-[-0.01em]'>
                    <Icon className='size-5 text-accent' strokeWidth={1.6} aria-hidden />
                    {title}
                  </h3>
                  <p className='mt-2 text-[15px] leading-relaxed text-muted'>{body}</p>
                </div>
              </li>
            ))}
            <li>
              <Link to='/services' className='inline-flex items-center gap-1.5 px-1 pt-2 text-[15px] font-medium text-ink hover:text-accent'>
                How we work <ArrowRight className='size-4' aria-hidden />
              </Link>
            </li>
          </ol>
        </div>
      </section>

      {/* Quote CTA */}
      <section className='frame pb-20 lg:pb-28'>
        <div className='relative overflow-hidden rounded-[2rem] bg-ink px-6 py-14 text-white sm:px-12 lg:px-16 lg:py-20'>
          <div
            aria-hidden
            className='pointer-events-none absolute -top-1/2 -right-1/4 size-[720px] rounded-full bg-[radial-gradient(closest-side,rgb(74_79_196/0.35),transparent)]'
          />
          <div className='relative grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end'>
            <div>
              <p className='text-[12px] font-medium tracking-[0.22em] text-white/55 uppercase'>Equipping a facility?</p>
              <h2 className='h2 mt-5 font-normal'>
                Send us your list. <span className='text-white/55'>We will price the whole thing.</span>
              </h2>
              <p className='mt-5 max-w-xl text-[17px] leading-relaxed text-white/70'>
                Tenders, new wards, clinic fit-outs and replacement programmes. One quotation, one delivery schedule, one contact.
              </p>
            </div>
            <div className='flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch'>
              <LinkButton to='/quote' size='lg' flip>
                Request a quote <ArrowRight className='size-4' aria-hidden />
              </LinkButton>
              <Link
                to='/contact?topic=tender'
                className='inline-flex h-13 items-center justify-center rounded-full border border-white/20 px-7 text-[16px] transition-colors hover:border-white/50 sm:h-14'
              >
                Send a tender or list
              </Link>
              <a
                href={telHref(COMPANY.phones[0])}
                className='inline-flex h-13 items-center justify-center rounded-full border border-white/20 px-7 text-[16px] tabular-nums transition-colors hover:border-white/50 sm:h-14'
              >
                Call {COMPANY.phones[0]}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
