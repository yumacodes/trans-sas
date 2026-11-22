import { CATALOG } from '@/data/catalog'
import { ApiError } from '@/lib/types'
import type { Enquiry, Product, ProductRequest, RequestReceipt } from '@/lib/types'

/**
 * The one seam between the website and the management system (trans-sas-mgt).
 *
 * With VITE_API_URL set, the catalogue is read live from the system's public routes and a
 * product request becomes a draft proforma there, with a notification to the sales team.
 * Without it (offline development) the bundled catalogue is used and requests open a
 * pre-filled email instead, so nothing a customer sends is lost.
 */
const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || ''

export const hasBackend = Boolean(API_URL)

type WebsiteProductDto = {
  sku: string
  name: string
  description: string | null
  category: string | null
  brand: string | null
  model: string | null
  unit: string
  images: string[]
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response

  try {
    res = await fetch(`${API_URL}/public${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...init?.headers }
    })
  } catch {
    throw new ApiError("We couldn't reach our system. Check your connection and try again.", 0)
  }

  const body = (await res.json().catch(() => null)) as { data?: T; error?: { message?: string; fields?: Record<string, string> } } | null

  if (!res.ok || !body || body.data === undefined) {
    throw new ApiError(body?.error?.message ?? 'Something went wrong on our side. Please try again.', res.status, body?.error?.fields)
  }

  return body.data
}

export const skuToSlug = (sku: string) => sku.toLowerCase()
const slugToSku = (slug: string) => slug.toUpperCase()

/**
 * Stock item descriptions are written as: summary paragraph, detail paragraphs, then one
 * "- " line per feature. Anything else is shown as plain description.
 */
export function parseDescription(text: string | null) {
  const paragraphs = (text ?? '').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
  const features: string[] = []
  const prose: string[] = []

  for (const p of paragraphs) {
    const lines = p.split('\n').map(l => l.trim())

    if (lines.every(l => /^[-•]\s+/.test(l))) features.push(...lines.map(l => l.replace(/^[-•]\s+/, '')))
    else prose.push(p)
  }

  return { summary: prose[0] ?? '', description: prose.slice(1).join('\n\n') || prose[0] || '', features }
}

const fromDto = (dto: WebsiteProductDto): Product => ({
  sku: dto.sku,
  slug: skuToSlug(dto.sku),
  name: dto.name,
  category: dto.category,
  ...parseDescription(dto.description),
  image: dto.images[0] ?? null,
  images: dto.images,
  brand: dto.brand,
  model: dto.model,
  unit: dto.unit
})

const BUNDLED: Product[] = CATALOG.map(p => ({
  sku: slugToSku(p.slug),
  slug: p.slug,
  name: p.name,
  category: p.categories[0] ?? null,
  summary: p.summary,
  description: p.description,
  features: p.features,
  image: p.image,
  images: p.image ? [p.image] : [],
  brand: null,
  model: null,
  unit: 'unit'
}))

export async function listProducts(): Promise<Product[]> {
  if (!hasBackend) return BUNDLED

  return (await request<WebsiteProductDto[]>('/products')).map(fromDto)
}

export async function getProduct(slug: string): Promise<Product | null> {
  if (!hasBackend) return BUNDLED.find(p => p.slug === slug) ?? null

  try {
    return fromDto(await request<WebsiteProductDto>(`/products/${encodeURIComponent(slugToSku(slug))}`))
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
}

/** A random key for one submission, kept across retries of that same submission. */
export function newSubmissionKey() {
  const bytes = crypto.getRandomValues(new Uint8Array(18))

  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
}

const mailto = (subject: string, body: string) => {
  window.location.href = `mailto:sales@trans-sas.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export async function submitRequest(req: ProductRequest, names: Record<string, string>): Promise<RequestReceipt> {
  const { customer } = req

  if (hasBackend) {
    const receipt = await request<{ reference: string }>('/requests', {
      method: 'POST',
      body: JSON.stringify({
        submissionKey: req.submissionKey,
        name: customer.name,
        organisation: customer.organisation,
        email: customer.email,
        phone: customer.phone,
        delivery: req.delivery,
        address: req.delivery === 'delivery' ? customer.address : '',
        notes: customer.notes,
        items: req.lines.map(l => ({ sku: l.sku, quantity: l.qty })),
        // Honeypot: always empty from a real browser.
        website: ''
      })
    })

    return { reference: receipt.reference, mode: 'api' }
  }

  const reference = `WEB-${req.submissionKey.slice(0, 6).toUpperCase()}`

  mailto(
    `Product request ${reference}`,
    [
      `Product request ${reference}`,
      '',
      ...req.lines.map(l => `${l.qty} x ${names[l.sku] ?? l.sku} (${l.sku})`),
      '',
      `Fulfilment: ${req.delivery === 'delivery' ? 'Deliver to address' : 'Pick up in Accra'}`,
      `Name: ${customer.name}`,
      customer.organisation ? `Organisation: ${customer.organisation}` : '',
      `Email: ${customer.email}`,
      `Phone: ${customer.phone}`,
      req.delivery === 'delivery' ? `Address: ${customer.address}` : '',
      customer.notes ? `Notes: ${customer.notes}` : ''
    ]
      .filter(Boolean)
      .join('\n')
  )

  return { reference, mode: 'offline' }
}

export async function submitEnquiry(enquiry: Enquiry): Promise<void> {
  mailto(enquiry.subject, `${enquiry.message}\n\n${enquiry.name}\n${enquiry.email}${enquiry.phone ? `\n${enquiry.phone}` : ''}`)
}
