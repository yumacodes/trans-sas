import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/site/layout'
import { CartProvider } from '@/lib/cart'
import { hasTeam } from '@/data/team'
import { COMPANY } from '@/lib/company'
import { injectOrganizationJsonLd } from '@/lib/use-page-meta'
import HomePage from '@/pages/home'
import './index.css'

// Home is eager (it's the landing page); every other route loads on demand.
const ShopPage = lazy(() => import('@/pages/shop'))
const ProductPage = lazy(() => import('@/pages/product'))
const CartPage = lazy(() => import('@/pages/cart'))
const CheckoutPage = lazy(() => import('@/pages/checkout'))
const AboutPage = lazy(() => import('@/pages/about'))
const ServicesPage = lazy(() => import('@/pages/services'))
const TeamPage = lazy(() => import('@/pages/team'))
const ContactPage = lazy(() => import('@/pages/contact'))
const NotFoundPage = lazy(() => import('@/pages/not-found'))

const page = (Page: React.ComponentType) => (
  <Suspense fallback={<div className='min-h-[60vh]' aria-busy='true' />}>
    <Page />
  </Suspense>
)

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: (
      <div className='frame flex min-h-dvh flex-col items-start justify-center gap-4'>
        <p className='eyebrow'>Something went wrong</p>
        <h1 className='h2 font-normal'>This page hit an error.</h1>
        <p className='text-muted'>Please reload. If it keeps happening, call us on {COMPANY.phones[0]}.</p>
        <a href='/' className='mt-2 inline-flex h-12 items-center rounded-full bg-accent px-6 text-white'>
          Back to home
        </a>
      </div>
    ),
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/shop', element: page(ShopPage) },
      { path: '/shop/:slug', element: page(ProductPage) },
      // The quote list and its request form. The old /cart and /checkout links keep working.
      { path: '/quote', element: page(CartPage) },
      { path: '/quote/send', element: page(CheckoutPage) },
      { path: '/cart', element: <Navigate to='/quote' replace /> },
      { path: '/checkout', element: <Navigate to='/quote/send' replace /> },
      { path: '/about', element: page(AboutPage) },
      { path: '/services', element: page(ServicesPage) },
      // Hidden until data/team.ts holds real people instead of the template entries.
      { path: '/team', element: hasTeam ? page(TeamPage) : <Navigate to='/about' replace /> },
      { path: '/contact', element: page(ContactPage) },
      { path: '*', element: page(NotFoundPage) }
    ]
  }
])

injectOrganizationJsonLd()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </StrictMode>
)
