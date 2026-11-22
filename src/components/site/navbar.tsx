import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react'
import { ArrowRight, Menu, ShoppingBag, X } from 'lucide-react'
import { LinkButton } from '@/components/ui/button'
import { Logo } from '@/components/site/logo'
import { useCart } from '@/lib/cart'
import { cn } from '@/lib/utils'

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
  { label: 'Team', to: '/team' },
  { label: 'Contact', to: '/contact' }
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { count, setDrawerOpen } = useCart()
  const { pathname } = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // The hero fills what the nav leaves, so the nav's real height is measured and kept current.
  useEffect(() => {
    const el = wrapRef.current

    if (!el) return

    const measure = () => document.documentElement.style.setProperty('--nav-space', `${el.getBoundingClientRect().height}px`)
    const observer = new ResizeObserver(measure)

    measure()
    observer.observe(el)
    document.fonts?.ready.then(measure)

    return () => observer.disconnect()
  }, [])

  return (
    <LazyMotion features={domAnimation}>
      <header ref={wrapRef} className='drop sticky top-0 z-50'>
        <div className={cn('nav-bar', (scrolled || open || pathname !== '/') && 'nav-bar-solid')}>
          <nav aria-label='Primary' className='frame flex h-18 items-center justify-between gap-4 lg:h-22'>
            <Link to='/' aria-label='Trans-Sas home' className='shrink-0'>
              <Logo />
            </Link>

            <ul className='hidden items-center gap-9 lg:flex'>
              {NAV_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      cn(
                        'relative inline-flex items-center py-2 text-[15.5px] transition-colors duration-200 hover:text-accent',
                        isActive ? 'text-accent' : 'text-ink'
                      )
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className='flex items-center gap-1 sm:gap-3'>
              <button
                type='button'
                onClick={() => setDrawerOpen(true)}
                aria-label={count ? `Open cart, ${count} item${count === 1 ? '' : 's'}` : 'Open cart'}
                className='relative grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5'
              >
                <ShoppingBag className='size-5' strokeWidth={1.6} aria-hidden />
                {count > 0 && (
                  <span className='absolute top-1 right-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent px-1 text-[11px] font-semibold text-white tabular-nums'>
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </button>
              <LinkButton to='/shop' flip className='h-10 px-4 text-[14.5px] sm:h-12 sm:px-6 sm:text-[15px]'>
                Request items
                <ArrowRight className='hidden size-4 sm:block' strokeWidth={1.8} aria-hidden />
              </LinkButton>
              <button
                type='button'
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                aria-controls='mobile-menu'
                onClick={() => setOpen(v => !v)}
                className='grid size-11 place-items-center rounded-full text-ink lg:hidden'
              >
                {open ? <X className='size-5' strokeWidth={1.6} /> : <Menu className='size-5' strokeWidth={1.6} />}
              </button>
            </div>
          </nav>

          <AnimatePresence initial={false}>
            {open && (
              <m.div
                id='mobile-menu'
                initial={reduce ? false : { opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className='frame pb-5 lg:hidden'
              >
                <ul className='flex flex-col border-t border-ink/8 pt-2'>
                  {NAV_LINKS.map(({ label, to }) => (
                    <li key={to}>
                      <NavLink
                        to={to}
                        end
                        className={({ isActive }) => cn('flex h-12 items-center text-[16px]', isActive ? 'text-accent' : 'text-ink')}
                      >
                        {label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </LazyMotion>
  )
}
