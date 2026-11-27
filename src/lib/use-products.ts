import { useCallback, useEffect, useState } from 'react'
import { getProduct, listProducts } from '@/lib/api'
import type { Product } from '@/lib/types'

type State<T> = { data: T; loading: boolean; error: string | null }

/** Loads again after a failure (e.g. the API was briefly unreachable). */
function useReload() {
  const [attempt, setAttempt] = useState(0)

  return [attempt, useCallback(() => setAttempt(a => a + 1), [])] as const
}

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

// A retry anywhere reloads every component that shows the catalogue (page, navbar, footer).
let catalogueAttempt = 0
const catalogueListeners = new Set<(attempt: number) => void>()

function reloadCatalogue() {
  catalogueAttempt += 1
  catalogueListeners.forEach(fn => fn(catalogueAttempt))
}

export function useProducts() {
  const [state, setState] = useState<State<Product[]>>({ data: [], loading: true, error: null })
  const [attempt, setAttempt] = useState(catalogueAttempt)

  useEffect(() => {
    catalogueListeners.add(setAttempt)

    return () => {
      catalogueListeners.delete(setAttempt)
    }
  }, [])

  const reload = reloadCatalogue

  useEffect(() => {
    let live = true

    setState(s => (s.error ? { ...s, loading: true, error: null } : s))
    sharedCatalogue()
      .then(data => live && setState({ data, loading: false, error: null }))
      .catch((e: Error) => live && setState({ data: [], loading: false, error: e.message }))

    return () => {
      live = false
    }
  }, [attempt])

  return { ...state, reload }
}

export function useProduct(slug: string | undefined) {
  const [state, setState] = useState<State<Product | null>>({ data: null, loading: true, error: null })
  const [attempt, reload] = useReload()

  useEffect(() => {
    let live = true

    if (!slug) return

    setState(s => ({ ...s, loading: true, error: null }))
    getProduct(slug)
      .then(data => live && setState({ data, loading: false, error: null }))
      .catch((e: Error) => live && setState({ data: null, loading: false, error: e.message }))

    return () => {
      live = false
    }
  }, [slug, attempt])

  return { ...state, reload }
}

/** Categories that have at least one product, with counts, in a stable order. */
export function categoriesOf(products: Product[]) {
  const counts = new Map<string, number>()

  for (const p of products) if (p.category) counts.set(p.category, (counts.get(p.category) ?? 0) + 1)

  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([name, count]) => ({ name, count }))
}
