import { forwardRef } from 'react'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'dark' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex shrink-0 select-none items-center justify-center rounded-full font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-deep shadow-[0_8px_20px_-10px_rgb(46_48_148/0.7)]',
  dark: 'bg-ink text-white hover:bg-black',
  outline: 'border border-line bg-white/60 text-ink hover:border-ink/30 hover:bg-white',
  ghost: 'text-ink hover:bg-ink/5'
}

const sizes: Record<Size, string> = {
  sm: 'h-10 px-4 text-[14px]',
  md: 'h-12 px-6 text-[15px]',
  lg: 'h-13 px-7 text-[16px] sm:h-14'
}

export const buttonClass = ({ variant = 'primary', size = 'md', className }: { variant?: Variant; size?: Size; className?: string } = {}) =>
  cn(base, variants[variant], sizes[size], className)

/**
 * A button label drawn as two identical faces of a small cube; put `flip` on the button and
 * hovering turns it over. The twin face is hidden from screen readers.
 */
export function FlipLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className='flip-box'>
      <span className={cn('flip-face', className)}>{children}</span>
      <span aria-hidden className={cn('flip-face flip-back', className)}>
        {children}
      </span>
    </span>
  )
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size; flip?: boolean }

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, flip, className, children, type = 'button', ...props }, ref) => (
    <button ref={ref} type={type} className={buttonClass({ variant, size, className: cn(flip && 'flip', className) })} {...props}>
      {flip ? <FlipLabel className='gap-2'>{children}</FlipLabel> : children}
    </button>
  )
)
Button.displayName = 'Button'

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string; variant?: Variant; size?: Size; flip?: boolean }

/** Internal routes go through the router; anything with a scheme is a plain anchor. */
export function LinkButton({ to, variant, size, flip, className, children, ...props }: LinkButtonProps) {
  const cls = buttonClass({ variant, size, className: cn(flip && 'flip', className) })
  const content = flip ? <FlipLabel className='gap-2'>{children}</FlipLabel> : children

  if (/^[a-z]+:/i.test(to))
    return (
      <a href={to} className={cls} {...props}>
        {content}
      </a>
    )

  return (
    <Link to={to} className={cls} {...props}>
      {content}
    </Link>
  )
}
