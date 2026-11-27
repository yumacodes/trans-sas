import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Loader2, MapPin, Truck } from 'lucide-react'
import { CopyButton } from '@/components/ui/copy-button'
import { TrustBand } from '@/components/site/trust-band'
import { usePageMeta } from '@/lib/use-page-meta'
import { Button, LinkButton } from '@/components/ui/button'
import { InputField, TextareaField } from '@/components/ui/field'
import { PageHeader } from '@/components/site/layout'
import { CatalogueError, useResolvedCart } from '@/components/site/cart-lines'
import { OrderSummary } from '@/components/site/order-summary'
import { newSubmissionKey, submitRequest } from '@/lib/api'
import { useCart } from '@/lib/cart'
import { COMPANY } from '@/lib/company'
import { ApiError } from '@/lib/types'
import type { Customer, RequestReceipt } from '@/lib/types'
import { cn } from '@/lib/utils'

type Errors = Partial<Record<keyof Customer, string>>

const EMPTY: Customer = { name: '', organisation: '', email: '', phone: '', address: '', notes: '', reference: '', taxId: '' }

/** What was sent, kept for the confirmation page (the list itself is cleared on success). */
type Sent = RequestReceipt & { items: { name: string; sku: string; qty: number }[]; email: string; phone: string }

const validate = (c: Customer, delivery: 'delivery' | 'pickup'): Errors => {
  const e: Errors = {}

  if (c.name.trim().length < 2) e.name = 'Enter your full name.'
  if (!/^\S+@\S+\.\S+$/.test(c.email.trim())) e.email = 'Enter an email address like name@example.com.'
  if (c.phone.replace(/\D/g, '').length < 9) e.phone = 'Enter a phone number we can reach you on.'
  if (delivery === 'delivery' && c.address.trim().length < 5) e.address = 'Enter the delivery address, with a landmark or GPS code.'
  if (c.reference.trim().length > 80) e.reference = 'Keep the reference to 80 characters or fewer.'
  if (c.taxId.trim().length > 40) e.taxId = 'Keep the TIN to 40 characters or fewer.'

  return e
}

export default function CheckoutPage() {
  usePageMeta({ title: 'Request a quote', description: 'Send your quote list. We reply with a proforma invoice showing prices and availability.', noindex: true })
  const { clear } = useCart()
  const { lines, saved, loading, error, reload } = useResolvedCart()
  const [customer, setCustomer] = useState<Customer>(EMPTY)
  const [delivery, setDelivery] = useState<'delivery' | 'pickup'>('delivery')
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [failure, setFailure] = useState<string | null>(null)
  const [receipt, setReceipt] = useState<Sent | null>(null)
  // One key for this submission: retrying after a dropped connection can't create a second proforma.
  const [submissionKey] = useState(newSubmissionKey)

  const set = (key: keyof Customer) => (e: { target: { value: string } }) => {
    setCustomer(c => ({ ...c, [key]: e.target.value }))
    if (errors[key]) setErrors(err => ({ ...err, [key]: undefined }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const found = validate(customer, delivery)

    setErrors(found)

    const first = Object.keys(found)[0]

    if (first) {
      document.querySelector<HTMLElement>(`[name='${first}']`)?.focus()

      return
    }

    setSubmitting(true)
    setFailure(null)

    try {
      const result = await submitRequest(
        { submissionKey, customer, delivery, lines: lines.map(l => ({ sku: l.product.sku, qty: l.qty })) },
        Object.fromEntries(lines.map(l => [l.product.sku, l.product.name]))
      )

      setReceipt({
        ...result,
        items: lines.map(l => ({ name: l.product.name, sku: l.product.sku, qty: l.qty })),
        email: customer.email.trim(),
        phone: customer.phone.trim()
      })
      clear()
      window.scrollTo({ top: 0 })
    } catch (error) {
      if (error instanceof ApiError && Object.keys(error.fields).length) {
        // The system checked the form and pointed at fields: show its messages beside them.
        const fieldErrors: Errors = {}

        for (const [key, message] of Object.entries(error.fields)) if (key in EMPTY) fieldErrors[key as keyof Customer] = message
        setErrors(fieldErrors)
      }

      setFailure(
        error instanceof ApiError
          ? `${error.message} If it keeps happening, email ${COMPANY.email} or call ${COMPANY.phones[0]}.`
          : `We couldn't send your request. Please try again, or email ${COMPANY.email}.`
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (receipt)
    return (
      <div className='frame flex flex-col items-center py-20 text-center lg:py-28'>
        <span className='grid size-16 place-items-center rounded-full bg-accent-soft text-accent'>
          <CheckCircle2 className='size-8' strokeWidth={1.5} aria-hidden />
        </span>
        <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
          <p className='eyebrow'>Reference {receipt.reference}</p>
          <CopyButton value={receipt.reference} label='reference'>
            Copy reference
          </CopyButton>
        </div>
        <h1 className='h2 mt-4 max-w-xl font-normal' role='status'>
          {receipt.mode === 'api' ? 'Quote request received. Thank you.' : 'Almost there: send the email to finish.'}
        </h1>
        <p className='mt-5 max-w-lg text-[17px] leading-relaxed text-muted'>
          {receipt.mode === 'api'
            ? `Our sales team will prepare a proforma invoice with prices and availability and contact you at ${receipt.email} or ${receipt.phone}${
                COMPANY.replyTime ? `, ${COMPANY.replyTime}` : ''
              }. Quote this reference if you call us.`
            : `Your email app has opened with the request filled in. Send it to ${COMPANY.email} and our sales team will contact you at ${receipt.email} or ${receipt.phone}.`}
        </p>

        <div className='mt-10 w-full max-w-lg rounded-2xl border border-line bg-white p-6 text-left'>
          <h2 className='text-[15px] font-medium'>What you asked us to quote</h2>
          <ul className='mt-4 space-y-2.5 text-[14.5px]'>
            {receipt.items.map(item => (
              <li key={item.sku} className='flex justify-between gap-4'>
                <span className='min-w-0'>{item.name}</span>
                <span className='shrink-0 text-muted tabular-nums'>× {item.qty}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className='mt-10 flex flex-wrap justify-center gap-3'>
          <LinkButton to='/shop'>Keep browsing</LinkButton>
          <LinkButton to='/' variant='outline'>
            Back to home
          </LinkButton>
        </div>
      </div>
    )

  if (error && saved.length > 0)
    return (
      <div className='frame py-16 lg:py-20'>
        <h1 className='h2 font-normal'>Request a quote</h1>
        <CatalogueError count={saved.length} onRetry={reload} className='mt-8 max-w-2xl' />
      </div>
    )

  if (saved.length === 0)
    return (
      <div className='frame py-24 text-center'>
        <h1 className='h2 font-normal'>Your quote list is empty</h1>
        <p className='mt-4 text-muted'>Add equipment to your quote list first, then send one request for everything.</p>
        <LinkButton to='/shop' className='mt-8'>
          Browse equipment
        </LinkButton>
      </div>
    )

  return (
    <>
      <PageHeader
        eyebrow='Request a quote'
        title='Send your quote request'
        lead='Nothing is paid online. We prepare a proforma invoice with prices and availability, and send it to you.'
      />
      <form noValidate onSubmit={handleSubmit} className='frame grid gap-10 py-10 lg:grid-cols-[1fr_400px] lg:gap-14 lg:py-14'>
        <div className='space-y-12'>
          <fieldset>
            <legend className='text-[19px] font-medium tracking-[-0.01em]'>1. Your details</legend>
            <div className='mt-6 grid gap-5 sm:grid-cols-2'>
              <InputField label='Full name' name='name' autoComplete='name' value={customer.name} onChange={set('name')} error={errors.name} />
              <InputField
                label='Hospital or organisation'
                name='organisation'
                autoComplete='organization'
                optional
                value={customer.organisation}
                onChange={set('organisation')}
              />
              <InputField
                label='Email'
                name='email'
                type='email'
                inputMode='email'
                autoComplete='email'
                value={customer.email}
                onChange={set('email')}
                error={errors.email}
              />
              <InputField
                label='Phone'
                name='phone'
                type='tel'
                inputMode='tel'
                autoComplete='tel'
                placeholder='024 000 0000'
                value={customer.phone}
                onChange={set('phone')}
                error={errors.phone}
              />
            </div>
          </fieldset>

          <fieldset>
            <legend className='text-[19px] font-medium tracking-[-0.01em]'>2. Delivery</legend>
            <div role='radiogroup' className='mt-6 grid gap-3 sm:grid-cols-2'>
              {[
                { value: 'delivery' as const, title: 'Deliver to me', body: `Free delivery to your facility or home. ${COMPANY.deliveryNote}`, icon: Truck },
                { value: 'pickup' as const, title: 'Pick up in Accra', body: 'Abossey Okai, near Obetsebi-Lamptey Circle.', icon: MapPin }
              ].map(({ value, title, body, icon: Icon }) => (
                <label
                  key={value}
                  className={cn(
                    'flex cursor-pointer gap-4 rounded-2xl border bg-white p-5 transition-[border-color,box-shadow]',
                    delivery === value ? 'border-accent shadow-[0_0_0_3px_rgb(46_48_148/0.12)]' : 'border-line hover:border-ink/25'
                  )}
                >
                  <input type='radio' name='delivery' value={value} checked={delivery === value} onChange={() => setDelivery(value)} className='sr-only' />
                  <Icon className={cn('mt-0.5 size-5 shrink-0', delivery === value ? 'text-accent' : 'text-muted')} strokeWidth={1.6} aria-hidden />
                  <span>
                    <span className='block text-[15.5px] font-medium'>{title}</span>
                    <span className='mt-0.5 block text-[14px] text-muted'>{body}</span>
                  </span>
                </label>
              ))}
            </div>
            {delivery === 'delivery' && (
              <div className='mt-5'>
                <TextareaField
                  label='Delivery address'
                  name='address'
                  autoComplete='street-address'
                  hint='Include a landmark or your Ghana Post GPS code.'
                  value={customer.address}
                  onChange={set('address')}
                  error={errors.address}
                  className='min-h-24'
                />
              </div>
            )}
          </fieldset>

          <fieldset>
            <legend className='text-[19px] font-medium tracking-[-0.01em]'>3. References and notes</legend>
            <div className='mt-6 grid gap-5 sm:grid-cols-2'>
              <InputField
                label='Tender / PO reference'
                name='reference'
                optional
                maxLength={80}
                hint='Your tender, LPO or purchase order number, if you have one.'
                value={customer.reference}
                onChange={set('reference')}
                error={errors.reference}
              />
              <InputField
                label='TIN'
                name='taxId'
                optional
                maxLength={40}
                hint='Tax identification number to show on the proforma.'
                value={customer.taxId}
                onChange={set('taxId')}
                error={errors.taxId}
              />
            </div>
            <div className='mt-5'>
              <TextareaField
                label='Notes for our sales team'
                name='notes'
                optional
                hint='Preferred delivery date, or questions about a product.'
                value={customer.notes}
                onChange={set('notes')}
              />
            </div>
          </fieldset>

          <TrustBand />
        </div>

        <OrderSummary showLines>
          {failure && (
            <p role='alert' className='mt-5 rounded-xl border border-warn/30 bg-warn/5 p-3.5 text-[14px] text-warn'>
              {failure}
            </p>
          )}
          <Button type='submit' size='lg' className='mt-6 w-full' disabled={submitting || loading}>
            {submitting ? (
              <>
                <Loader2 className='mr-2 size-4 animate-spin' aria-hidden /> Sending request…
              </>
            ) : (
              'Send quote request'
            )}
          </Button>
          <p className='mt-4 text-center text-[13px] leading-relaxed text-muted'>
            By sending, you agree to be contacted about this request. <Link to='/quote' className='underline underline-offset-2 hover:text-ink'>Edit list</Link>
          </p>
        </OrderSummary>
      </form>
    </>
  )
}
