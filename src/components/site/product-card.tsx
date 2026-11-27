import { Link } from 'react-router-dom'
import { Check, Plus } from 'lucide-react'
import { useState } from 'react'
import { ProductImage } from '@/components/ui/product-image'
import { useCart } from '@/lib/cart'
import type { Product } from '@/lib/types'
import { cn } from '@/lib/utils'

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const { add } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    add(product.slug)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1600)
  }

  return (
    <article className={cn('group relative flex flex-col', className)}>
      <Link to={`/shop/${product.slug}`} className='block overflow-hidden rounded-2xl' aria-label={product.name}>
        <ProductImage
          src={product.image}
          alt={product.name}
          className='aspect-[4/5] rounded-2xl'
          imgClassName='transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]'
        />
      </Link>

      <button
        type='button'
        onClick={handleAdd}
        aria-label={added ? `${product.name} added to your quote list` : `Add ${product.name} to your quote list`}
        className={cn(
          'absolute top-3 right-3 grid size-11 place-items-center rounded-full border shadow-sm backdrop-blur transition-all duration-200',
          added ? 'border-accent bg-accent text-white' : 'border-white bg-white/85 text-ink hover:bg-ink hover:text-white'
        )}
      >
        {added ? <Check className='size-4' aria-hidden /> : <Plus className='size-4' aria-hidden />}
      </button>

      <div className='mt-4 flex flex-1 flex-col'>
        <p className='text-[12px] font-medium tracking-[0.14em] text-muted uppercase'>{product.category ?? 'Equipment'}</p>
        <h3 className='mt-1.5 text-[16.5px] leading-snug font-medium tracking-[-0.01em] text-ink'>
          <Link to={`/shop/${product.slug}`} className='hover:text-accent'>
            {product.name}
          </Link>
        </h3>
        <p className='mt-1.5 line-clamp-2 text-[14px] leading-relaxed text-muted'>{product.summary}</p>
      </div>
    </article>
  )
}

export function ProductCardSkeleton() {
  return (
    <div aria-hidden className='animate-pulse'>
      <div className='aspect-[4/5] rounded-2xl bg-ink/[0.06]' />
      <div className='mt-4 h-3 w-1/3 rounded bg-ink/[0.06]' />
      <div className='mt-3 h-4 w-3/4 rounded bg-ink/[0.06]' />
      <div className='mt-2 h-3 w-full rounded bg-ink/[0.06]' />
    </div>
  )
}
