import { useState } from 'react'
import { Stethoscope } from 'lucide-react'
import { cn } from '@/lib/utils'

type ProductImageProps = {
  src: string | null
  alt: string
  className?: string
  imgClassName?: string
  eager?: boolean
  /** Rendered width hint for the browser, as an `<img sizes>` value. */
  sizes?: string
}

// Intrinsic size hint. The image always fills its plate (object-contain), and every plate
// has a fixed aspect ratio or size, so nothing shifts while photos load.
const BOX = 800

/** A product photo on a soft tinted plate, with a quiet fallback when there's no image or it fails. */
export function ProductImage({ src, alt, className, imgClassName, eager, sizes = '(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 50vw' }: ProductImageProps) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={cn('relative grid place-items-center overflow-hidden bg-[#eef0f6]', className)}>
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          width={BOX}
          height={BOX}
          sizes={sizes}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : undefined}
          decoding='async'
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            'product-shot size-full object-contain p-[9%] transition-opacity duration-500',
            loaded ? 'opacity-100' : 'opacity-0',
            imgClassName
          )}
        />
      ) : (
        <div className='flex flex-col items-center gap-2 text-muted' role='img' aria-label={`${alt} (image coming soon)`}>
          <Stethoscope className='size-8' strokeWidth={1.3} aria-hidden />
          <span className='text-[12.5px]'>Image coming soon</span>
        </div>
      )}
    </div>
  )
}
