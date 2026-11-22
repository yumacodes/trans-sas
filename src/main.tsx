import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/site/layout'
import { CartProvider } from '@/lib/cart'
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
        <p className='text-muted'>Please reload. If it keeps happening, call us on +233 302 663 350.</p>
        <a href='/' className='mt-2 inline-flex h-12 items-center rounded-full bg-accent px-6 text-white'>
          Back to home
        </a>
      </div>
    ),
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/shop', element: page(ShopPage) },
      { path: '/shop/:slug', element: page(ProductPage) },
      { path: '/cart', element: page(CartPage) },
      { path: '/checkout', element: page(CheckoutPage) },
      { path: '/about', element: page(AboutPage) },
      { path: '/services', element: page(ServicesPage) },
      { path: '/team', element: page(TeamPage) },
      { path: '/contact', element: page(ContactPage) },
      { path: '*', element: page(NotFoundPage) }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </StrictMode>
)
