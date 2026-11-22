import { useState } from 'react'
import { Stethoscope } from 'lucide-react'
import { cn } from '@/lib/utils'

type ProductImageProps = {
  src: string | null
  alt: string
  className?: string
  imgClassName?: string
  eager?: boolean
}

/** A product photo on a soft tinted plate, with a quiet fallback when there's no image or it fails. */
export function ProductImage({ src, alt, className, imgClassName, eager }: ProductImageProps) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={cn('relative grid place-items-center overflow-hidden bg-[#eef0f6]', className)}>
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
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
