import { forwardRef, useId } from 'react'
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const control =
  'w-full rounded-xl border border-line bg-white px-4 text-[16px] text-ink placeholder:text-muted transition-[border-color,box-shadow] duration-200 hover:border-ink/25 focus:border-accent focus:shadow-[0_0_0_4px_rgb(46_48_148/0.12)] focus:outline-none aria-[invalid=true]:border-warn'

type FieldShellProps = { label: string; hint?: string; error?: string; optional?: boolean; id: string; children: ReactNode }

function FieldShell({ label, hint, error, optional, id, children }: FieldShellProps) {
  return (
    <div className='flex flex-col gap-2'>
      <label htmlFor={id} className='flex items-baseline justify-between text-[14px] font-medium text-ink'>
        {label}
        {optional && <span className='text-[12.5px] font-normal text-muted'>Optional</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-msg`} role='alert' className='text-[13px] text-warn'>
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-msg`} className='text-[13px] text-muted'>
          {hint}
        </p>
      ) : null}
    </div>
  )
}

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string; optional?: boolean }

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(({ label, hint, error, optional, className, ...props }, ref) => {
  const id = useId()

  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional}>
      <input
        ref={ref}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? `${id}-msg` : undefined}
        className={cn(control, 'h-12', className)}
        {...props}
      />
    </FieldShell>
  )
})
InputField.displayName = 'InputField'

type TextareaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: string; error?: string; optional?: boolean }

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, hint, error, optional, className, ...props }, ref) => {
    const id = useId()

    return (
      <FieldShell id={id} label={label} hint={hint} error={error} optional={optional}>
        <textarea
          ref={ref}
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error || hint ? `${id}-msg` : undefined}
          className={cn(control, 'min-h-32 resize-y py-3 leading-relaxed', className)}
          {...props}
        />
      </FieldShell>
    )
  }
)
TextareaField.displayName = 'TextareaField'
