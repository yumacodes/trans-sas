import { useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowRight, Check, Copy, Mail, MessageCircle, Phone } from 'lucide-react'
import { LinkButton } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { PageHeader } from '@/components/site/layout'
import { TeamCard, TeamPhoto } from '@/components/site/team-card'
import { DEPARTMENTS, TEAM } from '@/data/team'
import type { TeamMember } from '@/data/team'
import { COMPANY, telHref } from '@/lib/company'
import { cn } from '@/lib/utils'

const whatsappNumber = (phone: string) => phone.replace(/[^\d]/g, '')

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard blocked: the value is still visible to select by hand.
    }
  }

  return (
    <button
      type='button'
      onClick={copy}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
      className='grid size-10 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-ink/5 hover:text-ink'
    >
      {copied ? <Check className='size-4 text-accent' aria-hidden /> : <Copy className='size-4' aria-hidden />}
    </button>
  )
}

function ContactRow({ icon: Icon, label, value, href }: { icon: typeof Mail; label: string; value: string; href: string }) {
  return (
    <li className='flex items-center gap-3 rounded-2xl border border-line bg-white py-2 pr-2 pl-4'>
      <Icon className='size-[18px] shrink-0 text-accent' strokeWidth={1.7} aria-hidden />
      <a href={href} className='min-w-0 flex-1 py-1.5 hover:text-accent'>
        <span className='block text-[12px] text-muted'>{label}</span>
        <span className='block truncate text-[15px] font-medium'>{value}</span>
      </a>
      <CopyButton value={value} label={label.toLowerCase()} />
    </li>
  )
}

function MemberProfile({ member }: { member: TeamMember }) {
  const first = member.name.split(/\s+/)[0] ?? member.name

  return (
    <div className='grid sm:grid-cols-[0.85fr_1.15fr]'>
      <div className='@container relative aspect-[4/3] overflow-hidden sm:aspect-auto sm:min-h-full'>
        <TeamPhoto member={member} className='absolute inset-0' />
        <div className='absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent sm:hidden' />
      </div>

      <div className='flex flex-col p-6 sm:p-8'>
        <p className='eyebrow flex items-center gap-3'>
          <span aria-hidden className='dot size-2 rounded-full bg-accent' />
          {member.department}
        </p>
        <h2 className='mt-4 text-[clamp(1.6rem,1.3rem+1vw,2.1rem)] leading-tight font-normal tracking-[-0.03em]'>{member.name}</h2>
        <p className='mt-1 text-[16px] text-muted'>
          {member.role}
          {member.since && <> · with Trans-Sas since {member.since}</>}
        </p>

        <div className='mt-6 space-y-4 text-[15.5px] leading-[1.7] text-ink/85'>
          {member.bio.split(/\n\s*\n/).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {member.focus.length > 0 && (
          <ul className='mt-6 flex flex-wrap gap-2' aria-label='Areas of focus'>
            {member.focus.map(f => (
              <li key={f} className='rounded-full bg-accent-soft px-3 py-1.5 text-[13px] font-medium text-accent'>
                {f}
              </li>
            ))}
          </ul>
        )}

        <h3 className='mt-8 text-[13px] font-medium tracking-[0.16em] text-muted uppercase'>Contact {first}</h3>
        <ul className='mt-3 space-y-2'>
          {member.email ? (
            <ContactRow icon={Mail} label='Email' value={member.email} href={`mailto:${member.email}`} />
          ) : (
            <ContactRow icon={Mail} label='Email (sales team)' value={COMPANY.email} href={`mailto:${COMPANY.email}`} />
          )}
          {member.phone ? (
            <ContactRow icon={Phone} label='Phone' value={member.phone} href={telHref(member.phone)} />
          ) : (
            <ContactRow icon={Phone} label='Phone (main line)' value={COMPANY.phones[0]!} href={telHref(COMPANY.phones[0]!)} />
          )}
        </ul>

        <div className='mt-6 flex flex-wrap gap-2'>
          <a
            href={`mailto:${member.email ?? COMPANY.email}`}
            className='inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-accent px-5 text-[15px] font-medium text-white transition-colors hover:bg-accent-deep sm:flex-none'
          >
            <Mail className='size-4' aria-hidden /> Email {first}
          </a>
          {member.phone && (
            <a
              href={`https://wa.me/${whatsappNumber(member.phone)}`}
              target='_blank'
              rel='noreferrer'
              className='inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-line bg-white px-5 text-[15px] font-medium transition-colors hover:border-ink/30 sm:flex-none'
            >
              <MessageCircle className='size-4' aria-hidden /> WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TeamPage() {
  const [params, setParams] = useSearchParams()
  const department = params.get('department') ?? 'All'
  // ?member=<id> opens a profile, so a person's card can be linked to directly.
  const openId = params.get('member')
  const open = TEAM.find(m => m.id === openId) ?? null
  // Keeps the profile on screen while the dialog animates closed.
  const lastOpen = useRef<TeamMember | null>(null)

  if (open) lastOpen.current = open

  const departments = useMemo(
    () => DEPARTMENTS.map(d => ({ name: d, count: TEAM.filter(m => m.department === d).length })).filter(d => d.count > 0),
    []
  )
  const shown = department === 'All' ? TEAM : TEAM.filter(m => m.department === department)

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)

    if (!value || value === 'All') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: key === 'department', preventScrollReset: true })
  }

  return (
    <>
      <PageHeader
        eyebrow='Our team'
        title={
          <>
            The people behind <span className='text-muted'>every delivery.</span>
          </>
        }
        lead='Sales, engineers, finance and logistics: one team that sources your equipment, delivers it and keeps it working. Choose anyone to see how to reach them.'
      >
        <dl className='rise mt-10 grid max-w-xl grid-cols-3' style={{ animationDelay: '0.24s' }}>
          {[
            [String(TEAM.length), 'People'],
            [String(departments.length), 'Departments'],
            [String(COMPANY.founded), 'Serving since']
          ].map(([value, label], i) => (
            <div key={label} className={cn('pr-4', i > 0 && 'border-l border-line pl-5')}>
              <dd className='text-[26px] font-medium tracking-[-0.03em] tabular-nums'>{value}</dd>
              <dt className='text-[13px] text-muted'>{label}</dt>
            </div>
          ))}
        </dl>
      </PageHeader>

      <section className='frame py-12 lg:py-16'>
        <div role='group' aria-label='Filter by department' className='scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 pb-1'>
          {[{ name: 'All', count: TEAM.length }, ...departments].map(d => (
            <button
              key={d.name}
              type='button'
              onClick={() => setParam('department', d.name)}
              aria-pressed={department === d.name}
              className={cn(
                'inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-[14px] transition-colors duration-200',
                department === d.name ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink hover:border-ink/30'
              )}
            >
              {d.name}
              <span className={cn('text-[12px] tabular-nums', department === d.name ? 'text-white/60' : 'text-muted')}>{d.count}</span>
            </button>
          ))}
        </div>

        <ul className='mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {shown.map(member => (
            <li key={member.id}>
              <TeamCard member={member} onOpen={() => setParam('member', member.id)} />
            </li>
          ))}
        </ul>
      </section>

      <section className='frame pb-20 lg:pb-28'>
        <div className='flex flex-col gap-6 rounded-[2rem] border border-line bg-white p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between'>
          <div className='max-w-xl'>
            <h2 className='text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-normal tracking-[-0.025em]'>Not sure who to ask?</h2>
            <p className='mt-2 text-[16px] leading-relaxed text-muted'>
              Send one message and it reaches the right person. Equipment requests go straight to our sales team.
            </p>
          </div>
          <div className='flex flex-wrap gap-3'>
            <LinkButton to='/contact' flip>
              Contact us <ArrowRight className='size-4' aria-hidden />
            </LinkButton>
            <LinkButton to='/shop' variant='outline'>
              Request items
            </LinkButton>
          </div>
        </div>
      </section>

      <Dialog open={Boolean(open)} onClose={() => setParam('member', null)} title={open ? `${open.name}, ${open.role}` : 'Team member'}>
        {lastOpen.current && <MemberProfile member={lastOpen.current} />}
      </Dialog>
    </>
  )
}
