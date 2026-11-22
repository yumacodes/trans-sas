import { cn } from '@/lib/utils'

/**
 * The Trans-Sas wordmark (public/logo.png, 209x39, transparent). On dark surfaces it is drawn
 * white with a filter, so one file serves both. Swap in an SVG when one is available.
 */
export function Logo({ className, tone = 'brand' }: { className?: string; tone?: 'brand' | 'white' }) {
  return (
    <img
      src='/logo.png'
      alt='Trans-Sas Trading & Mfg. Co. Ltd.'
      width={209}
      height={39}
      decoding='async'
      className={cn('h-7 w-auto sm:h-9 lg:h-10', tone === 'white' && 'brightness-0 invert', className)}
    />
  )
}
