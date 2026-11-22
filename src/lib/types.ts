/**
 * A product as the website shows it. It comes from the management system's Stock Items
 * (only items marked "Show on website"). The website never shows prices: a request
 * becomes a proforma that the sales team prices and issues.
 */
export type Product = {
  /** Item code in the management system. */
  sku: string
  /** URL form of the item code. */
  slug: string
  name: string
  category: string | null
  summary: string
  description: string
  features: string[]
  /** First image, or null. */
  image: string | null
  images: string[]
  brand: string | null
  model: string | null
  unit: string
}

export type CartLine = { slug: string; qty: number }

export type Customer = {
  name: string
  organisation: string
  email: string
  phone: string
  address: string
  notes: string
}

export type ProductRequest = {
  /** One key per submission: sending the same form twice returns the same reference. */
  submissionKey: string
  customer: Customer
  delivery: 'delivery' | 'pickup'
  lines: { sku: string; qty: number }[]
}

export type RequestReceipt = { reference: string; mode: 'api' | 'offline' }

export type Enquiry = { name: string; email: string; phone?: string; subject: string; message: string }

/** An error from the management system, with per-field messages when it rejected the form. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly fields: Record<string, string> = {}
  ) {
    super(message)
  }
}
