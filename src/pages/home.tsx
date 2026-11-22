import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Baby, HeartPulse, Microscope, Scissors, ShieldCheck, Truck, Wrench, Accessibility } from 'lucide-react'
import ProductStageHero from '@/components/ui/product-stage-hero'
import { LinkButton } from '@/components/ui/button'
import { SectionHeading } from '@/components/site/layout'
import { ProductCard, ProductCardSkeleton } from '@/components/site/product-card'
import { HERO_SLUGS } from '@/data/catalog'
import { useProducts } from '@/lib/use-products'
import { COMPANY, telHref } from '@/lib/company'

const RANGES = [
  { title: 'Mobility & patient handling', body: 'Wheelchairs, walkers, commode chairs and couches.', icon: Accessibility, to: '/shop?q=chair' },
  { title: 'Diagnostics', body: 'Stethoscopes, BP monitors, spirometers, glucose meters, audiometers.', icon: HeartPulse, to: '/shop?category=Medical' },
  { title: 'Theatre & surgical', body: 'Minor surgery couches, examination lights, cautery and suction.', icon: Scissors, to: '/shop?category=Surgical' },
  { title: 'Laboratory & scientific', body: 'Microscopes and instruments for clinical labs.', icon: Microscope, to: '/shop?category=Scientific' },
  { title: 'Neonatal & critical care', body: 'Infant incubators and anaesthesia workstations.', icon: Baby, to: '/shop/closed-infant-incubator' }
]

const SERVICES = [
  { title: 'Supply', body: 'Medical equipment and non-drug consumables for public projects, private facilities and individual buyers.', icon: ShieldCheck },
  { title: 'Free delivery', body: 'We deliver equipment orders to your facility, and pride ourselves on how quickly we do it.', icon: Truck },
  { title: 'Repairs', body: 'Broken equipment comes back into service. Tell us the make and the fault and we take it from there.', icon: Wrench }
]

export default function HomePage() {
  const { data: products, loading } = useProducts()
  const heroProducts = HERO_SLUGS.map(s => products.find(p => p.slug === s)).filter((p): p is NonNullable<typeof p> => Boolean(p))
  const featured = products.filter(p => p.image).slice(0, 8)

  return (
    <>
      {heroProducts.length > 0 ? (
        <ProductStageHero products={heroProducts} />
      ) : (
        <div className='hero-min hero-bg' aria-busy='true' />
      )}

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
        <ul className='mt-12 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-5'>
          {RANGES.map(({ title, body, icon: Icon, to }) => (
            <li key={title} className='bg-page'>
              <Link to={to} className='group flex h-full flex-col p-6 transition-colors duration-300 hover:bg-white lg:p-7'>
                <span className='grid size-11 place-items-center rounded-xl bg-accent-soft text-accent'>
                  <Icon className='size-5' strokeWidth={1.6} aria-hidden />
                </span>
                <h3 className='mt-8 text-[17px] leading-snug font-medium tracking-[-0.01em]'>{title}</h3>
                <p className='mt-2 text-[14px] leading-relaxed text-muted'>{body}</p>
                <span className='mt-6 inline-flex items-center gap-1 text-[14px] font-medium text-ink'>
                  Explore
                  <ArrowUpRight className='size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5' aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Featured products */}
      <section className='border-t border-line/70 bg-white/50'>
        <div className='frame py-20 lg:py-28'>
          <SectionHeading
            eyebrow='In the shop'
            title='Equipment our customers order most'
            lead='Add to your cart and send one order request. Our sales team confirms pricing, stock and delivery with you.'
            action={
              <Link to='/shop' className='inline-flex items-center gap-1.5 text-[15px] font-medium text-ink hover:text-accent'>
                View all {products.length > 0 && <span className='text-muted tabular-nums'>({products.length})</span>}
                <ArrowRight className='size-4' aria-hidden />
              </Link>
            }
          />
          <div className='mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4'>
            {loading
              ? Array.from({ length: 8 }, (_, i) => <ProductCardSkeleton key={i} />)
              : featured.map(p => <ProductCard key={p.slug} product={p} />)}
          </div>
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
              <LinkButton to='/contact?subject=Quotation' size='lg' flip>
                Request a quotation <ArrowRight className='size-4' aria-hidden />
              </LinkButton>
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
