import type { PointerEvent as ReactPointerEvent } from 'react'
import { LazyMotion, domAnimation, m, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { ArrowUpRight, UserRound } from 'lucide-react'
import { initials } from '@/data/team'
import type { TeamMember } from '@/data/team'
import { cn } from '@/lib/utils'

/** Maximum tilt toward the pointer, in degrees. */
const TILT = 9

/** The person's photo, or their initials on a brand plate until a photo is added. */
export function TeamPhoto({ member, className }: { member: TeamMember; className?: string }) {
  if (member.photo)
    return <img src={member.photo} alt='' loading='lazy' decoding='async' className={cn('size-full object-cover object-top', className)} />

  return (
    <div
      aria-hidden
      className={cn(
        'relative grid size-full place-items-center overflow-hidden bg-[radial-gradient(120%_90%_at_30%_10%,#4a4fc4_0%,#2e3094_45%,#181a5c_100%)]',
        className
      )}
    >
      <svg className='absolute inset-0 size-full opacity-[0.12]' aria-hidden>
        <defs>
          <pattern id='team-grid' width='28' height='28' patternUnits='userSpaceOnUse'>
            <path d='M28 0H0V28' fill='none' stroke='#fff' strokeWidth='0.6' />
          </pattern>
        </defs>
        <rect width='100%' height='100%' fill='url(#team-grid)' />
      </svg>
      <UserRound className='absolute -bottom-[8%] size-[78%] text-white/[0.07]' strokeWidth={1} />
      <span className='relative text-[clamp(2.5rem,8cqw,4rem)] font-medium tracking-[-0.04em] text-white/90'>{initials(member.name)}</span>
    </div>
  )
}

type TeamCardProps = { member: TeamMember; onOpen: () => void }

/**
 * A portrait card that tilts toward the pointer, with a glare that follows it and the name
 * plate standing off the photo. Hovering or focusing reveals the summary; clicking opens
 * the profile. Touch screens get the summary without tilt; reduced motion gets no tilt.
 */
export function TeamCard({ member, onOpen }: TeamCardProps) {
  const reduce = useReducedMotion() ?? false

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const spring = { stiffness: 180, damping: 18, mass: 0.6 }
  const rotateY = useSpring(useTransform(px, v => (v - 0.5) * 2 * TILT), spring)
  const rotateX = useSpring(useTransform(py, v => (0.5 - v) * 2 * TILT), spring)
  const glareX = useTransform(px, v => `${v * 100}%`)
  const glareY = useTransform(py, v => `${v * 100}%`)
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgb(255 255 255 / 0.28), transparent 55%)`

  const handleMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (reduce || e.pointerType !== 'mouse') return

    const box = e.currentTarget.getBoundingClientRect()

    px.set((e.clientX - box.left) / box.width)
    py.set((e.clientY - box.top) / box.height)
  }

  const handleLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <LazyMotion features={domAnimation}>
      <div className='[perspective:1100px]'>
        <m.button
          type='button'
          onClick={onOpen}
          onPointerMove={handleMove}
          onPointerLeave={handleLeave}
          aria-label={`${member.name}, ${member.role}. Open profile`}
          style={reduce ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className='group @container relative block aspect-[4/5] w-full cursor-pointer rounded-3xl text-left shadow-[0_1px_2px_rgb(15_20_48/0.06),0_18px_40px_-24px_rgb(15_20_48/0.45)] transition-shadow duration-500 hover:shadow-[0_2px_4px_rgb(15_20_48/0.08),0_40px_70px_-30px_rgb(46_48_148/0.55)] focus-visible:outline-offset-4'
        >
          {/* Photo layer */}
          <div className='absolute inset-0 overflow-hidden rounded-3xl'>
            <div className='size-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] group-focus-visible:scale-[1.06]'>
              <TeamPhoto member={member} />
            </div>
            {/* Legibility: a gradient under the text, deepening when the summary shows. */}
            <div className='absolute inset-0 bg-gradient-to-t from-[#0f1430]/90 via-[#0f1430]/25 to-transparent transition-opacity duration-500' />
            <div className='absolute inset-0 bg-[#0f1430]/45 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100' />
            {!reduce && (
              <m.div
                aria-hidden
                style={{ backgroundImage: glare }}
                className='pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-300 group-hover:opacity-100'
              />
            )}
          </div>

          {/* Department tag floats furthest from the photo. */}
          <span
            style={{ transform: 'translateZ(50px)' }}
            className='absolute top-4 left-4 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[11.5px] font-medium tracking-[0.12em] text-white uppercase backdrop-blur-md'
          >
            {member.department}
          </span>

          {/* Name plate and the summary that slides up on hover. */}
          <div style={{ transform: 'translateZ(36px)' }} className='absolute inset-x-0 bottom-0 p-5 text-white'>
            <p className='text-[19px] leading-tight font-medium tracking-[-0.02em]'>{member.name}</p>
            <p className='mt-1 text-[14px] text-white/75'>{member.role}</p>

            <div className='grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr] [@media(hover:none)]:grid-rows-[1fr]'>
              <div className='overflow-hidden'>
                <p className='pt-3 text-[13.5px] leading-relaxed text-white/85'>{member.summary}</p>
                <span className='mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-white'>
                  View profile
                  <ArrowUpRight className='size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5' aria-hidden />
                </span>
              </div>
            </div>
          </div>

          {/* A thin rim catches the light at the edge. */}
          <span aria-hidden className='pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/15 ring-inset' />
        </m.button>
      </div>
    </LazyMotion>
  )
}
