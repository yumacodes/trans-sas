import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { CartLine } from '@/lib/types'

const KEY = 'trans-sas.cart.v1'
const MAX_QTY = 99

type CartContextValue = {
  lines: CartLine[]
  count: number
  add: (slug: string, qty?: number) => void
  setQty: (slug: string, qty: number) => void
  remove: (slug: string) => void
  clear: () => void
  /** Puts back a list removed by clear (the Undo after "Clear list"). */
  restore: (lines: CartLine[]) => void
  /** Drops lines whose product is no longer in the catalogue. */
  prune: (keep: (slug: string) => boolean) => void
  drawerOpen: boolean
  setDrawerOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextValue | null>(null)

const readStored = (): CartLine[] => {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []

    return Array.isArray(parsed)
      ? parsed.filter((l): l is CartLine => typeof l?.slug === 'string' && Number.isInteger(l?.qty) && l.qty > 0)
      : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(readStored)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines))
    } catch {
      // Storage unavailable (private mode): the quote list still works for this visit.
    }
  }, [lines])

  const add = useCallback((slug: string, qty = 1) => {
    setLines(prev =>
      prev.some(l => l.slug === slug)
        ? prev.map(l => (l.slug === slug ? { ...l, qty: Math.min(l.qty + qty, MAX_QTY) } : l))
        : [...prev, { slug, qty: Math.min(qty, MAX_QTY) }]
    )
  }, [])

  const setQty = useCallback((slug: string, qty: number) => {
    setLines(prev =>
      qty <= 0 ? prev.filter(l => l.slug !== slug) : prev.map(l => (l.slug === slug ? { ...l, qty: Math.min(qty, MAX_QTY) } : l))
    )
  }, [])

  const remove = useCallback((slug: string) => setLines(prev => prev.filter(l => l.slug !== slug)), [])
  const clear = useCallback(() => setLines([]), [])
  const restore = useCallback((saved: CartLine[]) => setLines(saved), [])
  const prune = useCallback(
    (keep: (slug: string) => boolean) => setLines(prev => (prev.every(l => keep(l.slug)) ? prev : prev.filter(l => keep(l.slug)))),
    []
  )

  const value = useMemo(
    () => ({ lines, count: lines.reduce((n, l) => n + l.qty, 0), add, setQty, remove, clear, restore, prune, drawerOpen, setDrawerOpen }),
    [lines, add, setQty, remove, clear, restore, prune, drawerOpen]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)

  if (!ctx) throw new Error('useCart must be used inside CartProvider')

  return ctx
}
