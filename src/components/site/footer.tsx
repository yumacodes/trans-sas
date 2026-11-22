import { Link } from 'react-router-dom'
import { ArrowUpRight, Instagram, Mail, MapPin, Phone, Youtube } from 'lucide-react'
import { Logo } from '@/components/site/logo'
import { COMPANY, telHref } from '@/lib/company'
import { categoriesOf, useProducts } from '@/lib/use-products'

function XMark(props: { className?: string }) {
  return (
    <svg viewBox='0 0 24 24' aria-hidden {...props}>
      <path
        fill='currentColor'
        d='M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77L17.75 3Zm-1.08 16.17h1.7L7.4 4.74H5.58l11.1 14.43Z'
      />
    </svg>
  )
}

export function Footer() {
  const year = new Date().getFullYear()
  const { data: products } = useProducts()
  const categories = categoriesOf(products).slice(0, 5)

  return (
    <footer className='bg-ink text-white'>
      <div className='frame grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:py-20'>
        <div className='max-w-sm'>
          <Logo tone='white' />
          <p className='mt-6 text-[15px] leading-relaxed text-white/65'>
            Medical equipment and non-drug consumables for government and private hospitals, clinics, health professionals and
            families across Ghana.
          </p>
          <ul className='mt-6 flex gap-2'>
            {[
              { href: COMPANY.social.instagram, label: 'Instagram', Icon: Instagram },
              { href: COMPANY.social.x, label: 'X (Twitter)', Icon: XMark },
              { href: COMPANY.social.youtube, label: 'YouTube', Icon: Youtube }
            ].map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target='_blank'
                  rel='noreferrer'
                  aria-label={label}
                  className='grid size-11 place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/40 hover:text-white'
                >
                  <Icon className='size-[18px]' />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className='text-[13px] font-medium tracking-[0.18em] text-white/50 uppercase'>Shop</p>
          <ul className='mt-5 space-y-3 text-[15px]'>
            <li>
              <Link to='/shop' className='text-white/80 hover:text-white'>
                All equipment
              </Link>
            </li>
            {categories.map(({ name }) => (
              <li key={name}>
                <Link to={`/shop?category=${encodeURIComponent(name)}`} className='text-white/80 hover:text-white'>
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className='text-[13px] font-medium tracking-[0.18em] text-white/50 uppercase'>Company</p>
          <ul className='mt-5 space-y-3 text-[15px]'>
            {[
              ['About us', '/about'],
              ['Our team', '/team'],
              ['Services', '/services'],
              ['Contact', '/contact'],
              ['Request a quotation', '/contact?subject=Quotation'],
              ['Your cart', '/cart']
            ].map(([label, to]) => (
              <li key={to}>
                <Link to={to} className='text-white/80 hover:text-white'>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className='text-[13px] font-medium tracking-[0.18em] text-white/50 uppercase'>Visit or call</p>
          <ul className='mt-5 space-y-4 text-[15px] text-white/80'>
            <li className='flex gap-3'>
              <MapPin className='mt-0.5 size-[18px] shrink-0 text-white/50' aria-hidden />
              <a href={COMPANY.maps} target='_blank' rel='noreferrer' className='hover:text-white'>
                {COMPANY.address}
                <span className='mt-1 flex items-center gap-1 text-[13px] text-white/50'>
                  {COMPANY.gps} <ArrowUpRight className='size-3.5' aria-hidden />
                </span>
              </a>
            </li>
            <li className='flex gap-3'>
              <Phone className='mt-0.5 size-[18px] shrink-0 text-white/50' aria-hidden />
              <span className='flex flex-col gap-1'>
                {COMPANY.phones.map(p => (
                  <a key={p} href={telHref(p)} className='tabular-nums hover:text-white'>
                    {p}
                  </a>
                ))}
              </span>
            </li>
            <li className='flex gap-3'>
              <Mail className='mt-0.5 size-[18px] shrink-0 text-white/50' aria-hidden />
              <a href={`mailto:${COMPANY.email}`} className='hover:text-white'>
                {COMPANY.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className='border-t border-white/10'>
        <div className='frame flex flex-col gap-2 py-6 text-[13px] text-white/50 sm:flex-row sm:items-center sm:justify-between'>
          <p>
            © {year} {COMPANY.legalName}
          </p>
          <p>Established {COMPANY.founded} · Accra, Ghana</p>
        </div>
      </div>
    </footer>
  )
}
