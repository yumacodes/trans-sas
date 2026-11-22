import { useEffect, useState } from 'react'
import { getProduct, listProducts } from '@/lib/api'
import type { Product } from '@/lib/types'

type State<T> = { data: T; loading: boolean; error: string | null }

// One catalogue request shared by every component on the page. Image links from the
// management system are signed for an hour, so the copy is refreshed well before that.
const CATALOGUE_TTL_MS = 10 * 60 * 1000
let catalogue: { promise: Promise<Product[]>; at: number } | null = null

function sharedCatalogue() {
  if (!catalogue || Date.now() - catalogue.at > CATALOGUE_TTL_MS) {
    const promise = listProducts()

    catalogue = { promise, at: Date.now() }
    // A failed load is forgotten so the next page can try again.
    promise.catch(() => {
      if (catalogue?.promise === promise) catalogue = null
    })
  }

  return catalogue.promise
}

export function useProducts() {
  const [state, setState] = useState<State<Product[]>>({ data: [], loading: true, error: null })

  useEffect(() => {
    let live = true

    sharedCatalogue()
      .then(data => live && setState({ data, loading: false, error: null }))
      .catch((e: Error) => live && setState({ data: [], loading: false, error: e.message }))

    return () => {
      live = false
    }
  }, [])

  return state
}

export function useProduct(slug: string | undefined) {
  const [state, setState] = useState<State<Product | null>>({ data: null, loading: true, error: null })

  useEffect(() => {
    let live = true

    if (!slug) return

    setState(s => ({ ...s, loading: true }))
    getProduct(slug)
      .then(data => live && setState({ data, loading: false, error: null }))
      .catch((e: Error) => live && setState({ data: null, loading: false, error: e.message }))

    return () => {
      live = false
    }
  }, [slug])

  return state
}

/** Categories that have at least one product, with counts, in a stable order. */
export function categoriesOf(products: Product[]) {
  const counts = new Map<string, number>()

  for (const p of products) if (p.category) counts.set(p.category, (counts.get(p.category) ?? 0) + 1)

  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([name, count]) => ({ name, count }))
}
