import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { COMPANY } from '@/lib/company'

const SITE_TITLE = 'Trans-Sas — Medical Equipment & Consumables, Accra'
const SITE_DESCRIPTION =
  'Trans-Sas supplies quality medical equipment and non-drug consumables to hospitals, clinics and individuals across Ghana since 1981.'

type PageMeta = {
  /** Page title; the company name is appended. Omit for the home page. */
  title?: string
  description?: string
  /** Absolute or site-relative image for link previews. */
  image?: string | null
  /** Keep the page out of search results (not-found, quote list, checkout). */
  noindex?: boolean
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)

  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }

  el.content = content
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')

  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }

  el.href = href
}

const absolute = (url: string) => (/^https?:\/\//.test(url) ? url : `${COMPANY.siteUrl}${url.startsWith('/') ? '' : '/'}${url}`)

/** Sets the document title, description, social preview tags and robots for the current route. */
export function usePageMeta({ title, description, image, noindex }: PageMeta) {
  const { pathname } = useLocation()

  useEffect(() => {
    const fullTitle = title ? `${title} | ${COMPANY.name}` : SITE_TITLE
    const desc = (description || SITE_DESCRIPTION).replace(/\s+/g, ' ').trim().slice(0, 300)
    const url = `${COMPANY.siteUrl}${pathname}`

    document.title = fullTitle
    setMeta('name', 'description', desc)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', desc)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', absolute(image || '/icon-512.png'))
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', desc)
    setMeta('name', 'twitter:image', absolute(image || '/icon-512.png'))
    setMeta('name', 'robots', noindex ? 'noindex' : 'index, follow')
    setCanonical(url)
  }, [title, description, image, noindex, pathname])
}

/** Organization / LocalBusiness structured data, built from company.ts. */
export function injectOrganizationJsonLd() {
  if (document.getElementById('org-jsonld')) return

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: COMPANY.name,
    legalName: COMPANY.legalName,
    foundingDate: String(COMPANY.founded),
    url: COMPANY.siteUrl || undefined,
    logo: COMPANY.siteUrl ? `${COMPANY.siteUrl}/logo.png` : undefined,
    image: COMPANY.siteUrl ? `${COMPANY.siteUrl}/icon-512.png` : undefined,
    email: COMPANY.email,
    telephone: COMPANY.phones[0],
    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY.address,
      addressLocality: COMPANY.locality,
      addressCountry: COMPANY.countryCode
    },
    hasMap: COMPANY.maps,
    sameAs: Object.values(COMPANY.social)
  }

  const script = document.createElement('script')

  script.type = 'application/ld+json'
  script.id = 'org-jsonld'
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}
