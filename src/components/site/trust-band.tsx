import { Award, BadgeCheck, Handshake, Headset, ShieldCheck, Truck, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { COMPANY } from '@/lib/company'
import { cn } from '@/lib/utils'

type TrustItem = { icon: LucideIcon; title: string; body: string }

/** Facts the site already states plainly elsewhere. */
const GENERIC: TrustItem[] = [
  { icon: ShieldCheck, title: `Since ${COMPANY.founded}`, body: 'Supplying hospitals and clinics in Ghana' },
  { icon: Wrench, title: 'Repairs & servicing', body: 'The same team, after purchase' },
  { icon: Truck, title: 'Free delivery', body: COMPANY.deliveryNote }
]

/** Facts from company.ts. Each one shows only once it has been filled in. */
function companyItems(): TrustItem[] {
  const { registrations, certifications, authorisedBrands, warranty, afterSales } = COMPANY.trust

  return [
    ...registrations.filter(Boolean).map(body => ({ icon: BadgeCheck, title: 'Registered', body })),
    ...certifications.filter(Boolean).map(body => ({ icon: Award, title: 'Certified', body })),
    ...(authorisedBrands.length ? [{ icon: Handshake, title: 'Authorised distributor', body: authorisedBrands.join(', ') }] : []),
    ...(warranty ? [{ icon: ShieldCheck, title: 'Warranty', body: warranty }] : []),
    ...(afterSales ? [{ icon: Headset, title: 'After-sales support', body: afterSales }] : [])
  ]
}

/**
 * Registrations, certifications, authorised brands, warranty and after-sales support, from
 * company.ts. Renders nothing while those are empty, unless `generic` adds the facts the site
 * already states (founded, repairs, delivery with its conditions).
 */
export function TrustBand({ generic = false, className }: { generic?: boolean; className?: string }) {
  const items = [...(generic ? GENERIC : []), ...companyItems()]

  if (items.length === 0) return null

  return (
    <ul aria-label={`Buying from ${COMPANY.name}`} className={cn('grid gap-3 sm:grid-cols-3', className)}>
      {items.map(({ icon: Icon, title, body }) => (
        <li key={`${title}-${body}`} className='rounded-2xl bg-white/70 p-4'>
          <Icon className='size-5 text-accent' strokeWidth={1.6} aria-hidden />
          <p className='mt-3 text-[14.5px] font-medium'>{title}</p>
          <p className='text-[13px] text-muted'>{body}</p>
        </li>
      ))}
    </ul>
  )
}

/** The delivery conditions, for wherever "Free delivery" is claimed. */
export function DeliveryNote({ className }: { className?: string }) {
  return (
    <p className={cn('text-[13px] leading-relaxed text-muted', className)}>
      Free delivery: {COMPANY.deliveryNote}{' '}
      <Link to='/services#delivery' className='underline underline-offset-2 hover:text-ink'>
        Delivery details
      </Link>
    </p>
  )
}
