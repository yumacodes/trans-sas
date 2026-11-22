import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { Navbar } from '@/components/site/navbar'
import { Footer } from '@/components/site/footer'
import { CartDrawer } from '@/components/site/cart-drawer'
import { COMPANY } from '@/lib/company'
import { cn } from '@/lib/utils'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])

  return null
}

export function Layout() {
  return (
    <div className='flex min-h-dvh flex-col'>
      <a
        href='#main'
        className='sr-only z-[300] rounded-full bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3'
      >
        Skip to content
      </a>
      <ScrollToTop />
      <Navbar />
      <main id='main' className='flex-1'>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <a
        href={`${COMPANY.whatsapp}?text=${encodeURIComponent("Hello, I'm interested in one of your products")}`}
        target='_blank'
        rel='noreferrer'
        aria-label='Chat with us on WhatsApp'
        className='fixed right-5 bottom-5 z-40 grid size-14 place-items-center rounded-full bg-[#1f9d55] text-white shadow-[0_12px_28px_-10px_rgb(31_157_85/0.7)] transition-transform hover:scale-105'
      >
        <MessageCircle className='size-6' strokeWidth={1.7} aria-hidden />
      </a>
    </div>
  )
}

/** Page header for inner pages: eyebrow, title, and an optional lead, on the same grid as the hero. */
export function PageHeader({ eyebrow, title, lead, children, className }: { eyebrow: string; title: ReactNode; lead?: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <section className={cn('hero-bg relative overflow-hidden border-b border-line/70', className)}>
      <div className='frame pt-12 pb-12 lg:pt-20 lg:pb-16'>
        <p className='rise eyebrow flex items-center gap-3'>
          <span aria-hidden className='dot size-2 rounded-full bg-accent' />
          {eyebrow}
        </p>
        <h1 className='rise h2 mt-5 max-w-3xl font-normal text-ink' style={{ animationDelay: '0.08s' }}>
          {title}
        </h1>
        {lead && (
          <p className='rise mt-5 max-w-2xl text-[17px] leading-relaxed text-muted' style={{ animationDelay: '0.16s' }}>
            {lead}
          </p>
        )}
        {children}
      </div>
    </section>
  )
}

export function SectionHeading({ eyebrow, title, lead, action, className }: { eyebrow: string; title: ReactNode; lead?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-6 md:flex-row md:items-end md:justify-between', className)}>
      <div className='max-w-2xl'>
        <p className='eyebrow flex items-center gap-3'>
          <span aria-hidden className='dot size-2 rounded-full bg-accent' />
          {eyebrow}
        </p>
        <h2 className='h2 mt-5 font-normal text-ink'>{title}</h2>
        {lead && <p className='mt-4 text-[17px] leading-relaxed text-muted'>{lead}</p>}
      </div>
      {action}
    </div>
  )
}
