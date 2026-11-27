import { ArrowRight, ClipboardList, PackageCheck, ShieldCheck, Truck, Wrench } from 'lucide-react'
import { LinkButton } from '@/components/ui/button'
import { PageHeader, SectionHeading } from '@/components/site/layout'
import { COMPANY } from '@/lib/company'
import { usePageMeta } from '@/lib/use-page-meta'

const SERVICES = [
  {
    id: 'supply',
    icon: ShieldCheck,
    title: 'Supply of medical equipment & consumables',
    body: 'Hospital furniture, diagnostics, theatre, laboratory and neonatal equipment, plus non-drug consumables. For government projects, private facilities, health professionals and home care.',
    points: ['Single items or full fit-outs', 'Tender and project supply', 'Sourcing for items not listed online'],
    cta: { label: 'Browse the shop', to: '/shop' }
  },
  {
    id: 'delivery',
    icon: Truck,
    title: 'Free delivery',
    body: `Equipment orders are delivered free. Fast, dependable delivery is what our customers know us for. ${COMPANY.deliveryNote}`,
    points: ['Delivered to your facility or home', 'Scheduled around your opening', 'Pickup available in Accra'],
    cta: { label: 'Start a quote', to: '/shop' }
  },
  {
    id: 'repairs',
    icon: Wrench,
    title: 'Repairs of broken equipment',
    body: 'Equipment that has stopped working is expensive to replace. Tell us the make, model and fault and we will get it back into service.',
    points: ['Assessment before any work', 'Repairs on equipment we supplied and beyond', 'Advice on repair versus replace'],
    cta: { label: 'Book a repair', to: '/contact?subject=Repair' }
  }
]

const STEPS = [
  { icon: ClipboardList, title: 'Tell us what you need', body: 'Add items to your quote list, send a list, or call. A tender document works too.' },
  { icon: PackageCheck, title: 'We confirm and quote', body: 'Our sales team confirms models, availability and pricing with you.' },
  { icon: Truck, title: 'We deliver', body: `Delivery to your facility, at a time that suits you. ${COMPANY.deliveryNote}` },
  { icon: Wrench, title: 'We stay on call', body: 'If something breaks, the same team repairs it.' }
]

export default function ServicesPage() {
  usePageMeta({
    title: 'Services',
    description: 'Supply of medical equipment and consumables, delivery to your facility, and repairs of broken equipment, from one team in Accra.'
  })

  return (
    <>
      <PageHeader
        eyebrow='Services'
        title={
          <>
            Supplied, delivered, <span className='text-muted'>and kept running.</span>
          </>
        }
        lead='Three services, one team. Whatever you buy from us, you know who to call next.'
      />

      <section className='frame space-y-4 py-16 lg:py-24'>
        {SERVICES.map(({ id, icon: Icon, title, body, points, cta }, i) => (
          <article key={title} id={id} className='scroll-mt-[calc(var(--nav-space)+16px)] grid gap-8 rounded-3xl border border-line bg-white p-6 sm:p-8 lg:grid-cols-[auto_1.2fr_1fr] lg:gap-14 lg:p-10'>
            <div className='flex items-center gap-4 lg:flex-col lg:items-start'>
              <span className='text-[13px] text-muted tabular-nums'>{String(i + 1).padStart(2, '0')}</span>
              <span className='grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent'>
                <Icon className='size-6' strokeWidth={1.5} aria-hidden />
              </span>
            </div>
            <div>
              <h2 className='text-[clamp(1.4rem,1.2rem+0.8vw,1.9rem)] leading-tight font-normal tracking-[-0.025em]'>{title}</h2>
              <p className='mt-4 text-[16px] leading-relaxed text-muted'>{body}</p>
              <LinkButton to={cta.to} variant='outline' className='mt-6' flip>
                {cta.label} <ArrowRight className='size-4' aria-hidden />
              </LinkButton>
            </div>
            <ul className='space-y-3 self-center border-t border-line pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10'>
              {points.map(p => (
                <li key={p} className='flex gap-3 text-[15px]'>
                  <span aria-hidden className='mt-2 size-1.5 shrink-0 rounded-full bg-accent' />
                  {p}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className='border-t border-line/70 bg-white/50'>
        <div className='frame py-20 lg:py-24'>
          <SectionHeading eyebrow='How it works' title='From first call to working equipment' />
          <ol className='mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4'>
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className='relative'>
                <div className='flex items-center gap-3'>
                  <span className='grid size-11 place-items-center rounded-full border border-line bg-white text-accent'>
                    <Icon className='size-5' strokeWidth={1.6} aria-hidden />
                  </span>
                  <span className='text-[13px] text-muted tabular-nums'>Step {i + 1}</span>
                </div>
                <h3 className='mt-5 text-[17px] font-medium'>{title}</h3>
                <p className='mt-1.5 text-[14.5px] leading-relaxed text-muted'>{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
