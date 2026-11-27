import { useState } from 'react'
import type { FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowUpRight, CheckCircle2, Clock, Loader2, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/ui/copy-button'
import { InputField, TextareaField } from '@/components/ui/field'
import { PageHeader } from '@/components/site/layout'
import { newSubmissionKey, submitEnquiry } from '@/lib/api'
import { COMPANY, telHref, whatsappHref } from '@/lib/company'
import { usePageMeta } from '@/lib/use-page-meta'
import { ApiError } from '@/lib/types'
import type { EnquiryReceipt, EnquiryTopic } from '@/lib/types'
import { cn } from '@/lib/utils'

/** Topics shown on the form, each sent as one of the API's topic codes. `match` reads ?subject= presets. */
const TOPICS: { label: string; value: EnquiryTopic; match: RegExp }[] = [
  { label: 'General enquiry', value: 'general', match: /^general/i },
  { label: 'Quotation', value: 'quotation', match: /^quot/i },
  { label: 'Sourcing a product', value: 'sourcing', match: /^sourc/i },
  { label: 'Repair', value: 'repairs', match: /^repair/i },
  { label: 'Tender or project', value: 'tender', match: /^tender/i },
  { label: 'Something else', value: 'other', match: /^(other|delivery)/i }
]

type Form = { name: string; organisation: string; email: string; phone: string; subject: string; message: string }
type Errors = Partial<Record<keyof Form, string>>

const FIELDS: (keyof Form)[] = ['name', 'organisation', 'email', 'phone', 'subject', 'message']

/**
 * Presets from links: ?topic=quotation, or ?subject=Repair / ?subject=Sourcing: <product>.
 * A subject that is more than a topic word ("Sourcing: oxygen concentrator") prefills the subject.
 */
function presetFrom(params: URLSearchParams) {
  const topicParam = params.get('topic')
  const subject = (params.get('subject') ?? '').trim()
  const byCode = TOPICS.find(t => t.value === topicParam)
  const bySubject = subject ? TOPICS.find(t => t.match.test(subject)) : undefined
  const topic = byCode ?? bySubject ?? TOPICS[0]!
  const subjectIsJustTopic = Boolean(bySubject) && /^[a-z ]+$/i.test(subject) && subject.split(/\s+/).length <= 2

  return { topic: topic.value, subject: subject && !subjectIsJustTopic ? subject : '' }
}

export default function ContactPage() {
  usePageMeta({
    title: 'Contact',
    description: `Call, WhatsApp, email or visit ${COMPANY.name} in ${COMPANY.locality} about quotations, sourcing, repairs and tenders.`
  })
  const [params] = useSearchParams()
  const [preset] = useState(() => presetFrom(params))
  const [topic, setTopic] = useState<EnquiryTopic>(preset.topic)
  const [form, setForm] = useState<Form>({ name: '', organisation: '', email: '', phone: '', subject: preset.subject, message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [sending, setSending] = useState(false)
  const [failure, setFailure] = useState<{ message: string; rateLimited: boolean } | null>(null)
  const [receipt, setReceipt] = useState<EnquiryReceipt | null>(null)
  // One key per message: a retry after a dropped connection can't record it twice.
  const [submissionKey, setSubmissionKey] = useState(newSubmissionKey)

  const topicLabel = TOPICS.find(t => t.value === topic)?.label ?? 'General enquiry'

  const set = (key: keyof Form) => (e: { target: { value: string } }) => {
    setForm(f => ({ ...f, [key]: e.target.value }))
    if (errors[key]) setErrors(err => ({ ...err, [key]: undefined }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (sending) return

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

    setSending(true)
    setFailure(null)

    try {
      setReceipt(await submitEnquiry({ ...form, submissionKey, topic, topicLabel }))
    } catch (error) {
      if (error instanceof ApiError && Object.keys(error.fields).length) {
        // The system checked the form and pointed at fields: show its messages beside them.
        const fieldErrors: Errors = {}

        for (const [key, message] of Object.entries(error.fields)) {
          if ((FIELDS as string[]).includes(key)) fieldErrors[key as keyof Form] = message
        }

        setErrors(fieldErrors)

        const firstField = Object.keys(fieldErrors)[0]

        if (firstField) document.querySelector<HTMLElement>(`[name='${firstField}']`)?.focus()
      }

      const rateLimited = error instanceof ApiError && error.status === 429

      setFailure({
        rateLimited,
        message: rateLimited
          ? 'We have received several messages from you in a short time, so this one was not sent. Please call or WhatsApp us instead.'
          : error instanceof ApiError
            ? `${error.message} Your message was not sent.`
            : `We couldn't send your message. Please try again, or email ${COMPANY.email}.`
      })
    } finally {
      setSending(false)
    }
  }

  const startAnother = () => {
    setReceipt(null)
    setFailure(null)
    setSubmissionKey(newSubmissionKey())
    setForm(f => ({ ...f, subject: '', message: '' }))
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
          <div className='flex gap-4 rounded-2xl border border-line bg-white p-5'>
            <Phone className='mt-0.5 size-5 shrink-0 text-accent' strokeWidth={1.6} aria-hidden />
            <div className='flex-1'>
              <p className='text-[15.5px] font-medium'>Call us</p>
              <ul className='mt-1 flex flex-col gap-1 text-[14.5px] tabular-nums'>
                {COMPANY.phones.map(p => (
                  <li key={p}>
                    <a href={telHref(p)} className='inline-flex min-h-8 items-center text-muted underline-offset-2 hover:text-ink hover:underline'>
                      {p}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
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
            href={COMPANY.maps || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${COMPANY.legalName}, ${COMPANY.address}`)}`}
            target='_blank'
            rel='noreferrer'
            className='group flex gap-4 rounded-2xl border border-line bg-white p-5 transition-colors hover:border-ink/25'
          >
            <MapPin className='mt-0.5 size-5 shrink-0 text-accent' strokeWidth={1.6} aria-hidden />
            <span className='flex-1'>
              <span className='block text-[15.5px] font-medium'>Visit us</span>
              <span className='mt-1 block text-[14.5px] text-muted'>{COMPANY.address}</span>
              <span className='mt-1 block text-[13px] text-muted'>GPS {COMPANY.gps} · Open in Google Maps</span>
            </span>
            <ArrowUpRight className='size-4 text-muted group-hover:text-ink' aria-hidden />
          </a>
          {COMPANY.hours.length > 0 && (
            <div className='flex gap-4 rounded-2xl border border-line bg-white p-5'>
              <Clock className='mt-0.5 size-5 shrink-0 text-accent' strokeWidth={1.6} aria-hidden />
              <div className='flex-1'>
                <p className='text-[15.5px] font-medium'>Opening hours</p>
                <dl className='mt-1 space-y-1 text-[14.5px]'>
                  {COMPANY.hours.map(h => (
                    <div key={h.days} className='flex justify-between gap-4'>
                      <dt className='text-muted'>{h.days}</dt>
                      <dd className='tabular-nums'>{h.time}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}
          {COMPANY.mapEmbedUrl && (
            <iframe
              src={COMPANY.mapEmbedUrl}
              title={`Map showing ${COMPANY.name} in ${COMPANY.locality}`}
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
              className='aspect-[4/3] w-full rounded-2xl border border-line'
            />
          )}
        </div>

        <div className='rounded-3xl border border-line bg-white p-6 sm:p-8 lg:p-10'>
          {receipt ? (
            <div className='flex flex-col items-start py-10' role='status'>
              <CheckCircle2 className='size-10 text-accent' strokeWidth={1.5} aria-hidden />
              <h2 className='mt-6 text-[24px] font-medium tracking-[-0.02em]'>
                {receipt.mode === 'api' ? 'Message received.' : 'Your email app is open.'}
              </h2>
              <p className='mt-3 text-[16px] leading-relaxed text-muted'>
                {receipt.mode === 'api'
                  ? `Thank you. Our team will reply to ${form.email.trim()}${form.phone.trim() ? ` or call ${form.phone.trim()}` : ''}${
                      COMPANY.replyTime ? `, ${COMPANY.replyTime}` : ''
                    }.`
                  : `Your message is drafted in your email app. Send it to ${COMPANY.email} and our team will reply. If nothing opened, email us directly.`}
              </p>
              {receipt.reference && (
                <div className='mt-6 flex flex-wrap items-center gap-3'>
                  <p className='text-[15px]'>
                    Reference <span className='font-medium tabular-nums'>{receipt.reference}</span>
                  </p>
                  <CopyButton value={receipt.reference} label='reference'>
                    Copy reference
                  </CopyButton>
                </div>
              )}
              <Button variant='outline' className='mt-8' onClick={startAnother}>
                Send another message
              </Button>
            </div>
          ) : (
            <form noValidate onSubmit={handleSubmit} className='space-y-6' aria-busy={sending}>
              <h2 className='text-[22px] font-medium tracking-[-0.02em]'>Send a message</h2>

              <fieldset>
                <legend className='text-[14px] font-medium'>What is it about?</legend>
                <div className='mt-3 flex flex-wrap gap-2'>
                  {TOPICS.map(t => (
                    <button
                      key={t.value}
                      type='button'
                      onClick={() => setTopic(t.value)}
                      aria-pressed={topic === t.value}
                      className={cn(
                        'h-10 rounded-full border px-4 text-[14px] transition-colors',
                        topic === t.value ? 'border-ink bg-ink text-white' : 'border-line text-ink hover:border-ink/30'
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className='grid gap-5 sm:grid-cols-2'>
                <InputField label='Name' name='name' autoComplete='name' value={form.name} onChange={set('name')} error={errors.name} />
                <InputField
                  label='Hospital or organisation'
                  name='organisation'
                  autoComplete='organization'
                  optional
                  value={form.organisation}
                  onChange={set('organisation')}
                  error={errors.organisation}
                />
                <InputField label='Email' name='email' type='email' autoComplete='email' value={form.email} onChange={set('email')} error={errors.email} />
                <InputField label='Phone' name='phone' type='tel' autoComplete='tel' optional value={form.phone} onChange={set('phone')} error={errors.phone} />
              </div>
              <InputField label='Subject' name='subject' optional maxLength={150} value={form.subject} onChange={set('subject')} error={errors.subject} />
              <TextareaField
                label='Message'
                name='message'
                hint={
                  topic === 'repairs'
                    ? 'Include the make, model and what is wrong.'
                    : topic === 'sourcing'
                      ? 'Name the product, the quantity, and any brand or model you need.'
                      : undefined
                }
                value={form.message}
                onChange={set('message')}
                error={errors.message}
              />

              {failure && (
                <div role='alert' className='rounded-xl border border-warn/30 bg-warn/5 p-3.5 text-[14px] text-warn'>
                  <p>{failure.message}</p>
                  <p className='mt-2 flex flex-wrap gap-x-4 gap-y-1'>
                    <a href={telHref(COMPANY.phones[0])} className='underline underline-offset-2'>
                      Call {COMPANY.phones[0]}
                    </a>
                    <a href={whatsappHref(form.message || 'Hello')} target='_blank' rel='noreferrer' className='underline underline-offset-2'>
                      WhatsApp us
                    </a>
                  </p>
                </div>
              )}

              <Button type='submit' size='lg' disabled={sending} className='w-full sm:w-auto'>
                {sending ? (
                  <>
                    <Loader2 className='mr-2 size-4 animate-spin' aria-hidden /> Sending…
                  </>
                ) : failure && !failure.rateLimited ? (
                  'Try again'
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
