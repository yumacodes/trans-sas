import { useState } from 'react'
import type { FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowUpRight, CheckCircle2, Loader2, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InputField, TextareaField } from '@/components/ui/field'
import { PageHeader } from '@/components/site/layout'
import { hasBackend, submitEnquiry } from '@/lib/api'
import { COMPANY, telHref } from '@/lib/company'
import type { Enquiry } from '@/lib/types'
import { cn } from '@/lib/utils'

const TOPICS = ['General enquiry', 'Quotation', 'Repair', 'Delivery', 'Tender or project']

type Errors = Partial<Record<keyof Enquiry, string>>

export default function ContactPage() {
  const [params] = useSearchParams()
  const preset = params.get('subject') ?? ''
  const [topic, setTopic] = useState(TOPICS.find(t => t.startsWith(preset)) ?? (preset ? 'General enquiry' : 'General enquiry'))
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: preset && !TOPICS.some(t => t.startsWith(preset)) ? `${preset}\n\n` : '' })
  const [errors, setErrors] = useState<Errors>({})
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const set = (key: 'name' | 'email' | 'phone' | 'message') => (e: { target: { value: string } }) => {
    setForm(f => ({ ...f, [key]: e.target.value }))
    if (errors[key]) setErrors(err => ({ ...err, [key]: undefined }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const found: Errors = {}

    if (form.name.trim().length < 2) found.name = 'Enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) found.email = 'Enter an email address like name@example.com.'
    if (form.message.trim().length < 10) found.message = 'Tell us a little more, at least a sentence.'

    setErrors(found)

    const first = Object.keys(found)[0]

    if (first) {
      document.querySelector<HTMLElement>(`[name='${first}']`)?.focus()

      return
    }

    setState('sending')

    try {
      await submitEnquiry({ ...form, subject: topic })
      setState('sent')
    } catch {
      setState('error')
    }
  }

  return (
    <>
      <PageHeader
        eyebrow='Contact'
        title={
          <>
            Talk to the people <span className='text-muted'>who will handle your order.</span>
          </>
        }
        lead='Quotations, repairs, delivery questions or a product we do not list. Send a message, call, or visit us in Accra.'
      />

      <section className='frame grid gap-12 py-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:py-20'>
        <div className='space-y-4'>
          <a href={telHref(COMPANY.phones[0])} className='group flex gap-4 rounded-2xl border border-line bg-white p-5 transition-colors hover:border-ink/25'>
            <Phone className='mt-0.5 size-5 shrink-0 text-accent' strokeWidth={1.6} aria-hidden />
            <span className='flex-1'>
              <span className='block text-[15.5px] font-medium'>Call us</span>
              <span className='mt-1 block text-[14.5px] text-muted tabular-nums'>{COMPANY.phones.join(' · ')}</span>
            </span>
          </a>
          <a
            href={COMPANY.whatsapp}
            target='_blank'
            rel='noreferrer'
            className='group flex gap-4 rounded-2xl border border-line bg-white p-5 transition-colors hover:border-ink/25'
          >
            <MessageCircle className='mt-0.5 size-5 shrink-0 text-accent' strokeWidth={1.6} aria-hidden />
            <span className='flex-1'>
              <span className='block text-[15.5px] font-medium'>WhatsApp</span>
              <span className='mt-1 block text-[14.5px] text-muted'>Send a photo of the item or your list</span>
            </span>
            <ArrowUpRight className='size-4 text-muted group-hover:text-ink' aria-hidden />
          </a>
          <a href={`mailto:${COMPANY.email}`} className='group flex gap-4 rounded-2xl border border-line bg-white p-5 transition-colors hover:border-ink/25'>
            <Mail className='mt-0.5 size-5 shrink-0 text-accent' strokeWidth={1.6} aria-hidden />
            <span className='flex-1'>
              <span className='block text-[15.5px] font-medium'>Email</span>
              <span className='mt-1 block text-[14.5px] text-muted'>{COMPANY.email}</span>
            </span>
          </a>
          <a
            href={COMPANY.maps}
            target='_blank'
            rel='noreferrer'
            className='group flex gap-4 rounded-2xl border border-line bg-white p-5 transition-colors hover:border-ink/25'
          >
            <MapPin className='mt-0.5 size-5 shrink-0 text-accent' strokeWidth={1.6} aria-hidden />
            <span className='flex-1'>
              <span className='block text-[15.5px] font-medium'>Visit us</span>
              <span className='mt-1 block text-[14.5px] text-muted'>{COMPANY.address}</span>
              <span className='mt-1 block text-[13px] text-muted'>GPS {COMPANY.gps}</span>
            </span>
            <ArrowUpRight className='size-4 text-muted group-hover:text-ink' aria-hidden />
          </a>
        </div>

        <div className='rounded-3xl border border-line bg-white p-6 sm:p-8 lg:p-10'>
          {state === 'sent' ? (
            <div className='flex flex-col items-start py-10' role='status'>
              <CheckCircle2 className='size-10 text-accent' strokeWidth={1.5} aria-hidden />
              <h2 className='mt-6 text-[24px] font-medium tracking-[-0.02em]'>
                {hasBackend ? 'Message received.' : 'Your email app is open.'}
              </h2>
              <p className='mt-3 text-[16px] leading-relaxed text-muted'>
                {hasBackend
                  ? 'Thank you. Our team will reply by email or phone.'
                  : `Send the drafted email to ${COMPANY.email} and our team will reply.`}
              </p>
              <Button variant='outline' className='mt-8' onClick={() => setState('idle')}>
                Send another message
              </Button>
            </div>
          ) : (
            <form noValidate onSubmit={handleSubmit} className='space-y-6'>
              <h2 className='text-[22px] font-medium tracking-[-0.02em]'>Send a message</h2>

              <fieldset>
                <legend className='text-[14px] font-medium'>What is it about?</legend>
                <div className='mt-3 flex flex-wrap gap-2'>
                  {TOPICS.map(t => (
                    <button
                      key={t}
                      type='button'
                      onClick={() => setTopic(t)}
                      aria-pressed={topic === t}
                      className={cn(
                        'h-10 rounded-full border px-4 text-[14px] transition-colors',
                        topic === t ? 'border-ink bg-ink text-white' : 'border-line text-ink hover:border-ink/30'
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className='grid gap-5 sm:grid-cols-2'>
                <InputField label='Name' name='name' autoComplete='name' value={form.name} onChange={set('name')} error={errors.name} />
                <InputField label='Phone' name='phone' type='tel' autoComplete='tel' optional value={form.phone} onChange={set('phone')} />
              </div>
              <InputField label='Email' name='email' type='email' autoComplete='email' value={form.email} onChange={set('email')} error={errors.email} />
              <TextareaField
                label='Message'
                name='message'
                hint={topic === 'Repair' ? 'Include the make, model and what is wrong.' : undefined}
                value={form.message}
                onChange={set('message')}
                error={errors.message}
              />

              {state === 'error' && (
                <p role='alert' className='rounded-xl border border-warn/30 bg-warn/5 p-3.5 text-[14px] text-warn'>
                  We couldn't send that. Please try again, or email {COMPANY.email}.
                </p>
              )}

              <Button type='submit' size='lg' disabled={state === 'sending'} className='w-full sm:w-auto'>
                {state === 'sending' ? (
                  <>
                    <Loader2 className='mr-2 size-4 animate-spin' aria-hidden /> Sending…
                  </>
                ) : (
                  'Send message'
                )}
              </Button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
