import { ArrowRight } from 'lucide-react'
import { LinkButton } from '@/components/ui/button'
import { PageHeader, SectionHeading } from '@/components/site/layout'

const TIMELINE = [
  { year: '1981', title: 'Founded', body: 'Trans-Sas Trading & Manufacturing begins in Accra, working in large-scale farming and gari processing.' },
  { year: 'Then', title: 'Into medical supply', body: 'Seeing what hospitals were missing, the company turns its trading experience to medical equipment and consumables.' },
  { year: '35+ yrs', title: 'Public and private care', body: 'Supplying government projects, government and private hospitals, health professionals and families.' },
  { year: 'Today', title: 'Supply, delivery, repair', body: 'One team that sources the equipment, delivers it free, and repairs it when it breaks.' }
]

const VALUES = [
  { title: 'God-centred', body: 'Our faith shapes how we treat customers, staff and partners.' },
  { title: 'Integrity', body: 'We say what a product does and what it costs, plainly.' },
  { title: 'Professional excellence', body: 'Every order handled to the standard a hospital needs.' },
  { title: 'Sustainability', body: 'A business built to be here for the next forty years.' },
  { title: 'Quality', body: 'Value for money, not the cheapest option that fails.' },
  { title: 'Responsiveness', body: 'Quick answers, and quicker delivery.' },
  { title: 'Teamwork', body: 'We sell what you need, not what we want to sell.' },
  { title: 'Results', body: 'Measured by equipment that works on the ward.' }
]

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow='About Trans-Sas'
        title={
          <>
            Over forty years in business. <span className='text-muted'>Thirty-five of them in medical supply.</span>
          </>
        }
        lead='Trans-Sas Trading & Manufacturing Co. Ltd. makes medical equipment and non-drug consumables accessible to health professionals, institutions and the public across Ghana.'
      />

      <section className='frame grid gap-12 py-20 lg:grid-cols-2 lg:gap-20 lg:py-28'>
        <div className='space-y-6 text-[17px] leading-[1.75] text-ink/85'>
          <p>
            We started in 1981 in a very different trade: extensive farming and large-scale gari processing. Running supply chains for
            food taught us how to move goods reliably, and when we saw how hard it was for hospitals to get dependable equipment, we
            put that experience to work in medical supply.
          </p>
          <p>
            For more than thirty-five years since, we have supplied government projects, government and private hospitals, and
            individual buyers. We stand apart through the quality of what we sell and how quickly we deliver it.
          </p>
        </div>
        <dl className='grid grid-cols-2 gap-px self-start overflow-hidden rounded-3xl border border-line bg-line'>
          {[
            ['1981', 'Established'],
            ['35+', 'Years in medical supply'],
            ['Free', 'Delivery on equipment'],
            ['Accra', 'Based in Abossey Okai']
          ].map(([value, label]) => (
            <div key={label} className='bg-page p-6 lg:p-8'>
              <dd className='text-[clamp(1.8rem,1.4rem+1.2vw,2.5rem)] font-normal tracking-[-0.03em]'>{value}</dd>
              <dt className='mt-1 text-[14px] text-muted'>{label}</dt>
            </div>
          ))}
        </dl>
      </section>

      <section className='border-y border-line/70 bg-white/60'>
        <div className='frame grid gap-12 py-20 lg:grid-cols-2 lg:gap-20 lg:py-24'>
          <div>
            <p className='eyebrow'>Mission</p>
            <p className='mt-4 text-[clamp(1.35rem,1.1rem+0.8vw,1.75rem)] leading-snug tracking-[-0.02em]'>
              To make a wide range of medical equipment and non-drug consumables accessible to health professionals, establishments and
              the general public.
            </p>
          </div>
          <div>
            <p className='eyebrow'>Vision</p>
            <p className='mt-4 text-[clamp(1.35rem,1.1rem+0.8vw,1.75rem)] leading-snug tracking-[-0.02em]'>
              To be a well-known, well-run establishment in the Ghanaian market, across Sub-Saharan Africa, and beyond.
            </p>
          </div>
        </div>
      </section>

      <section className='frame py-20 lg:py-28'>
        <SectionHeading eyebrow='Our story' title='From farming to the hospital ward' />
        <ol className='mt-12 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-2 lg:grid-cols-4'>
          {TIMELINE.map(t => (
            <li key={t.title} className='bg-page p-6 lg:p-8'>
              <p className='text-[13px] font-medium tracking-[0.14em] text-accent uppercase'>{t.year}</p>
              <h3 className='mt-6 text-[18px] font-medium tracking-[-0.01em]'>{t.title}</h3>
              <p className='mt-2 text-[14.5px] leading-relaxed text-muted'>{t.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className='frame pb-20 lg:pb-28'>
        <SectionHeading eyebrow='Core values' title='What we hold ourselves to' />
        <ul className='mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4'>
          {VALUES.map((v, i) => (
            <li key={v.title} className='border-t border-line pt-5'>
              <p className='text-[13px] text-muted tabular-nums'>{String(i + 1).padStart(2, '0')}</p>
              <h3 className='mt-3 text-[17px] font-medium'>{v.title}</h3>
              <p className='mt-1.5 text-[14.5px] leading-relaxed text-muted'>{v.body}</p>
            </li>
          ))}
        </ul>
        <div className='mt-16 flex flex-wrap gap-3'>
          <LinkButton to='/shop' flip>
            Browse equipment <ArrowRight className='size-4' aria-hidden />
          </LinkButton>
          <LinkButton to='/contact' variant='outline'>
            Talk to our team
          </LinkButton>
        </div>
      </section>
    </>
  )
}
