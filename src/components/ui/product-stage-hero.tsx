import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import type { PointerEvent as ReactPointerEvent, SVGProps } from 'react'
import { Link } from 'react-router-dom'
import {
  AnimatePresence,
  LazyMotion,
  animate,
  domAnimation,
  m,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform
} from 'motion/react'
import type { MotionValue } from 'motion/react'
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play, ShieldCheck, Truck, Wrench } from 'lucide-react'
import { FlipLabel, LinkButton } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/types'

/**
 * Adapted from the Syntra hero: same alignment system, floor grid, cursor spotlight and flip
 * labels. The isometric core on the right is replaced by a stage of product cards on an
 * elliptical track. One card at a time pops forward with its details; the loop pauses on hover,
 * focus, off-screen, in a hidden tab, and for reduced-motion users.
 */

// ───── The dials ─────
const STAGE = {
  // Seconds each product holds the front of the stage.
  holdSeconds: 3.2,

  // Horizontal and vertical radius of the track, in % of the stage width.
  radiusX: 31,
  radiusY: 10,

  // Card width at the front, in % of the stage width.
  cardWidth: 38,

  // Scale of a card at the very back of the track.
  backScale: 0.5,

  // How far the front card lifts off the floor when it pops, in % of the stage width.
  popLift: 4.5,

  // Maximum tilt of the stage toward the cursor, in degrees.
  tiltDegrees: 4,

  spring: { stiffness: 70, damping: 18, mass: 1 }
}

const EASE = [0.22, 1, 0.36, 1] as const

// Follows the tab being shown or hidden.
const subscribeToVisibility = (onChange: () => void) => {
  document.addEventListener('visibilitychange', onChange)

  return () => document.removeEventListener('visibilitychange', onChange)
}

const isPageVisible = () => !document.hidden

// ───── Floor grid with the cursor spotlight ─────
const CELL = { w: 84, h: 48 }

function FloorGrid({ id, stroke = '#d3d7e4', strokeWidth = 0.8, ...props }: SVGProps<SVGSVGElement> & { id: string }) {
  return (
    <svg aria-hidden width='100%' height='100%' {...props}>
      <defs>
        <pattern id={id} width={CELL.w} height={CELL.h} patternUnits='userSpaceOnUse'>
          <path
            d={`M0 ${CELL.h / 2}L${CELL.w / 2} 0L${CELL.w} ${CELL.h / 2}M0 ${CELL.h / 2}L${CELL.w / 2} ${CELL.h}L${CELL.w} ${CELL.h / 2}`}
            fill='none'
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </pattern>
      </defs>
      <rect width='100%' height='100%' fill={`url(#${id})`} />
    </svg>
  )
}

const SPOT = 340

/**
 * The floor grid, plus an accent copy seen through a round window that follows the cursor.
 * Both move by opposite transforms only, so nothing repaints.
 */
function HeroFloor() {
  const ref = useRef<HTMLDivElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)
  const litRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    const spot = spotRef.current
    const lit = litRef.current
    const section = el?.parentElement

    if (!el || !spot || !lit || !section) return

    const resize = new ResizeObserver(([entry]) => {
      lit.style.width = `${entry.contentRect.width}px`
      lit.style.height = `${entry.contentRect.height}px`
    })

    resize.observe(section)

    let frame = 0

    const handleMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return

      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const box = section.getBoundingClientRect()
        const x = e.clientX - box.left - SPOT / 2
        const y = e.clientY - box.top - SPOT / 2

        spot.style.transform = `translate3d(${x}px, ${y}px, 0)`
        lit.style.transform = `translate3d(${-x}px, ${-y}px, 0)`
        el.dataset.spot = 'on'
      })
    }

    const handleLeave = () => {
      cancelAnimationFrame(frame)
      el.dataset.spot = 'off'
    }

    section.addEventListener('pointermove', handleMove)
    section.addEventListener('pointerleave', handleLeave)

    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      section.removeEventListener('pointermove', handleMove)
      section.removeEventListener('pointerleave', handleLeave)
    }
  }, [])

  return (
    <div ref={ref} aria-hidden data-spot='off' className='pointer-events-none absolute inset-0 -z-10 overflow-hidden'>
      <FloorGrid id='ts-floor' className='floor absolute inset-0' />
      <div ref={spotRef} style={{ width: SPOT, height: SPOT }} className='floor-spot'>
        <div ref={litRef} className='floor-lit'>
          <FloorGrid id='ts-floor-lit' stroke='#2e3094' strokeWidth={1} className='block size-full' />
        </div>
      </div>
    </div>
  )
}

// ───── One product on the track ─────
type Placement = { x: number; y: number; scale: number; depth: number; pop: number; opacity: number }

/** Where a card sits for a given offset from the front, in slots. Continuous, so motion runs along the arc. */
const place = (offset: number, count: number): Placement => {
  const a = (offset / count) * Math.PI * 2
  const depth = (Math.cos(a) + 1) / 2 // 1 at the front, 0 at the back
  const pop = Math.pow(Math.max(0, Math.cos(a)), 14) // only the card right at the front

  return {
    x: Math.sin(a) * STAGE.radiusX,
    y: (depth - 0.5) * 2 * STAGE.radiusY,
    scale: STAGE.backScale + (1 - STAGE.backScale) * depth + pop * 0.08,
    depth,
    pop,
    opacity: 0.25 + 0.75 * Math.pow(depth, 0.8)
  }
}

// The shortest signed distance from the front, wrapped into (-count/2, count/2].
const wrap = (v: number, count: number) => {
  const r = (((v % count) + count) % count) as number

  return r > count / 2 ? r - count : r
}

type StageCardProps = {
  product: Product
  index: number
  count: number
  rotation: MotionValue<number>
  active: boolean
  onSelect: () => void
}

function StageCard({ product, index, count, rotation, active, onSelect }: StageCardProps) {
  const at = (r: number) => place(wrap(index - r, count), count)

  const x = useTransform(rotation, r => `${at(r).x}cqw`)
  const y = useTransform(rotation, r => `${at(r).y}cqw`)
  const scale = useTransform(rotation, r => at(r).scale)
  const opacity = useTransform(rotation, r => at(r).opacity)
  const zIndex = useTransform(rotation, r => Math.round(at(r).depth * 100))
  const lift = useTransform(rotation, r => `${-at(r).pop * STAGE.popLift}cqw`)
  const tilt = useTransform(rotation, r => wrap(index - r, count) * -9)
  const shadowOpacity = useTransform(rotation, r => 0.18 + at(r).depth * 0.3 - at(r).pop * 0.12)
  const shadowScale = useTransform(rotation, r => 1 - at(r).pop * 0.18)
  const ring = useTransform(rotation, r => at(r).pop)

  return (
    <m.li
      style={{ x, y, scale, opacity, zIndex, width: `${STAGE.cardWidth}cqw` }}
      className='absolute top-1/2 left-1/2 -mt-[24cqw] -ml-[19cqw] list-none'
    >
      {/* Contact shadow stays on the floor while the card lifts. */}
      <m.div
        aria-hidden
        style={{ opacity: shadowOpacity, scaleX: shadowScale }}
        className='absolute -bottom-[3.2cqw] left-[12%] h-[3.6cqw] w-[76%] rounded-[50%] bg-[#262a4a] blur-[1.6cqw]'
      />
      <m.button
        type='button'
        tabIndex={-1}
        aria-hidden={!active}
        onClick={onSelect}
        style={{ y: lift, rotateY: tilt }}
        className='relative block w-full cursor-pointer [transform-style:preserve-3d]'
      >
        <div className='glass-card relative overflow-hidden rounded-[2.6cqw]'>
          <div className='aspect-[4/5] bg-gradient-to-b from-white to-[#eceff7]'>
            <img
              src={product.image ?? ''}
              alt=''
              draggable={false}
              loading='eager'
              decoding='async'
              className='product-shot size-full object-contain p-[12%]'
            />
          </div>
          {/* A thin accent rim comes up on the card at the front. */}
          <m.div aria-hidden style={{ opacity: ring }} className='pointer-events-none absolute inset-0 rounded-[2.6cqw] ring-2 ring-accent/35 ring-inset' />
        </div>
      </m.button>
    </m.li>
  )
}

// ───── The stage ─────
function ProductStage({ products }: { products: Product[] }) {
  const items = products.filter(p => p.image)
  const count = items.length

  const [active, setActive] = useState(0)
  const [hovering, setHovering] = useState(false)
  const [userPaused, setUserPaused] = useState(false)

  const stageRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion() ?? false
  const onScreen = useInView(stageRef, { margin: '0px' })
  const pageVisible = useSyncExternalStore(subscribeToVisibility, isPageVisible, () => true)

  // `rotation` counts slots without wrapping, so the spring always takes the short way round.
  const rotation = useMotionValue(0)
  const target = useRef(0)

  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 55, damping: 18 })
  const sy = useSpring(py, { stiffness: 55, damping: 18 })
  const rotateY = useTransform(sx, v => v * STAGE.tiltDegrees)
  const rotateX = useTransform(sy, v => 8 - v * STAGE.tiltDegrees)

  const playing = !reduce && !userPaused && !hovering && onScreen && pageVisible && count > 1

  const go = (step: number) => {
    target.current += step
    setActive(a => (((a + step) % count) + count) % count)

    if (reduce) rotation.set(target.current)
    else animate(rotation, target.current, { type: 'spring', ...STAGE.spring })
  }

  const goTo = (index: number) => {
    const step = wrap(index - active, count)

    if (step !== 0) go(step)
  }

  useEffect(() => {
    if (!playing) return

    const id = window.setInterval(() => go(1), STAGE.holdSeconds * 1000)

    return () => window.clearInterval(id)
    // `go` only touches refs and setters; restarting on `active` would reset the hold on manual steps, which is what we want.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, active])

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse') return

    const box = e.currentTarget.getBoundingClientRect()

    px.set(((e.clientX - box.left) / box.width - 0.5) * 2)
    py.set(((e.clientY - box.top) / box.height - 0.5) * 2)
  }

  const handlePointerLeave = () => {
    px.set(0)
    py.set(0)
    setHovering(false)
  }

  if (count === 0) return null

  const current = items[active]

  return (
    <div
      ref={stageRef}
      role='region'
      aria-roledescription='carousel'
      aria-label='Featured equipment'
      onPointerEnter={e => e.pointerType === 'mouse' && setHovering(true)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onFocus={() => setHovering(true)}
      onBlur={e => !e.currentTarget.contains(e.relatedTarget) && setHovering(false)}
      className='enter @container relative mx-auto aspect-[3/4] w-full max-w-[720px] sm:aspect-square lg:max-w-none'
    >
      {/* Soft light pooled under the track. */}
      <div aria-hidden className='pointer-events-none absolute inset-[8%] rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.95),rgb(255_255_255/0))]' />

      {/* The track itself: two faint ellipses on the floor. */}
      <svg aria-hidden viewBox='0 0 100 100' className='pointer-events-none absolute inset-0 size-full overflow-visible'>
        <ellipse cx='50' cy='58' rx={STAGE.radiusX + 12} ry={STAGE.radiusY + 7} fill='none' stroke='#d3d7e4' strokeWidth='0.18' />
        <ellipse cx='50' cy='58' rx={STAGE.radiusX + 4} ry={STAGE.radiusY + 2.5} fill='none' stroke='#d3d7e4' strokeWidth='0.14' strokeDasharray='0.6 1.2' />
      </svg>

      <LazyMotion features={domAnimation}>
        <div className='absolute inset-0 [perspective:1600px]'>
          <m.div style={{ rotateX, rotateY }} className='absolute inset-0 [transform-style:preserve-3d]'>
            <div className='float absolute inset-x-0 top-[2%] bottom-[40%] sm:top-[6%] sm:bottom-0'>
              <ul className='absolute inset-0 m-0 p-0'>
                {items.map((p, i) => (
                  <StageCard
                    key={p.slug}
                    product={p}
                    index={i}
                    count={count}
                    rotation={rotation}
                    active={i === active}
                    onSelect={() => goTo(i)}
                  />
                ))}
              </ul>
            </div>
          </m.div>
        </div>

        {/* The pop-up: details of the product at the front, swapping with it. */}
        <div className='pointer-events-none absolute inset-x-0 bottom-14 z-[200] sm:inset-x-auto sm:right-[1%] sm:bottom-[7%] sm:w-[min(46cqw,300px)] sm:min-w-[240px]'>
          <AnimatePresence mode='wait' initial={false}>
            <m.div
              key={current.slug}
              initial={reduce ? false : { opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.45, ease: EASE }}
              className='glass-card pointer-events-auto rounded-2xl p-4'
            >
              <p className='flex items-center gap-2 text-[11.5px] font-medium tracking-[0.16em] text-accent uppercase'>
                <span aria-hidden className='size-1.5 rounded-full bg-accent' />
                {current.category ?? 'Equipment'}
              </p>
              <p className='mt-1.5 text-[16px] leading-snug font-semibold tracking-[-0.015em] text-ink'>{current.name}</p>
              <p className='mt-1 line-clamp-2 text-[13.5px] leading-relaxed text-muted'>{current.summary}</p>
              <Link
                to={`/shop/${current.slug}`}
                className='group mt-3 inline-flex items-center gap-1.5 text-[14px] font-medium text-ink underline-offset-4 hover:underline'
              >
                View product
                <ArrowUpRight className='size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5' aria-hidden />
              </Link>
            </m.div>
          </AnimatePresence>
        </div>

        {/* Small facts that pop in once, then drift with the stage. */}
        <m.div
          initial={reduce ? false : { opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6, ease: EASE }}
          className='glass-card absolute top-[9%] left-[2%] z-[200] hidden items-center gap-3 rounded-2xl px-4 py-3 sm:flex'
        >
          <span className='grid size-9 place-items-center rounded-xl bg-accent-soft text-accent'>
            <Truck className='size-[18px]' strokeWidth={1.7} aria-hidden />
          </span>
          <span className='text-[13px] leading-tight'>
            <span className='block font-semibold text-ink'>Free delivery</span>
            <span className='text-muted'>On equipment orders</span>
          </span>
        </m.div>
        <m.div
          initial={reduce ? false : { opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.6, ease: EASE }}
          className='glass-card absolute top-[4%] right-[4%] z-[200] hidden items-center gap-3 rounded-2xl px-4 py-3 md:flex'
        >
          <span className='grid size-9 place-items-center rounded-xl bg-accent-soft text-accent'>
            <Wrench className='size-[18px]' strokeWidth={1.7} aria-hidden />
          </span>
          <span className='text-[13px] leading-tight'>
            <span className='block font-semibold text-ink'>Repairs & servicing</span>
            <span className='text-muted'>For broken equipment</span>
          </span>
        </m.div>
      </LazyMotion>

      {/* Controls: step, jump, and pause (anything that moves on its own must be stoppable). */}
      <div className='absolute bottom-0 left-0 z-[200] flex items-center gap-1 sm:bottom-[7%] sm:left-[2%]'>
        <button
          type='button'
          onClick={() => go(-1)}
          aria-label='Previous product'
          className='grid size-11 place-items-center rounded-full border border-line bg-white/80 text-ink backdrop-blur transition-colors hover:bg-white'
        >
          <ChevronLeft className='size-4' aria-hidden />
        </button>
        <button
          type='button'
          onClick={() => go(1)}
          aria-label='Next product'
          className='grid size-11 place-items-center rounded-full border border-line bg-white/80 text-ink backdrop-blur transition-colors hover:bg-white'
        >
          <ChevronRight className='size-4' aria-hidden />
        </button>
        {!reduce && (
          <button
            type='button'
            onClick={() => setUserPaused(v => !v)}
            aria-label={userPaused ? 'Play product loop' : 'Pause product loop'}
            className='grid size-11 place-items-center rounded-full text-muted transition-colors hover:text-ink'
          >
            {userPaused ? <Play className='size-4' aria-hidden /> : <Pause className='size-4' aria-hidden />}
          </button>
        )}
        <ol className='ml-1 hidden items-center gap-1.5 sm:flex' aria-label='Choose a product'>
          {items.map((p, i) => (
            <li key={p.slug}>
              <button
                type='button'
                onClick={() => goTo(i)}
                aria-label={p.name}
                aria-current={i === active}
                className='group grid h-6 place-items-center px-0.5'
              >
                <span
                  className={cn(
                    'block h-1.5 rounded-full transition-all duration-300',
                    i === active ? 'w-5 bg-accent' : 'w-1.5 bg-ink/20 group-hover:bg-ink/40'
                  )}
                />
              </button>
            </li>
          ))}
        </ol>
      </div>
      <p className='sr-only' aria-live='polite'>
        {hovering || userPaused ? `Showing ${current.name}` : ''}
      </p>
    </div>
  )
}

// ───── Copy ─────
const rise = (delay: number) => ({ style: { animationDelay: `${delay}s` } })

const PROOF = [
  { value: '1981', label: 'Serving Ghana since', icon: ShieldCheck },
  { value: '35+ yrs', label: 'In medical supply', icon: ShieldCheck },
  { value: 'Free', label: 'Equipment delivery', icon: Truck }
] as const

function HeroCopy() {
  return (
    <div className='flex flex-col justify-center'>
      <p {...rise(0.1)} className='rise eyebrow flex items-center gap-3'>
        <span aria-hidden className='dot size-2 rounded-full bg-accent' />
        Medical equipment · Accra, Ghana
      </p>

      <h1 id='hero-title' {...rise(0.18)} className='rise display mt-7 font-normal text-ink'>
        <span className='block'>Equipment that</span>
        <span className='block'>keeps care moving,</span>
        <span className='block'>
          <span className='text-accent'>delivered.</span>
        </span>
      </h1>

      <p {...rise(0.3)} className='rise mt-7 max-w-[32rem] text-[17px] leading-[1.6] text-muted lg:text-[19px]'>
        Hospital furniture, diagnostics, theatre and laboratory equipment, and non-drug consumables for hospitals, clinics and
        homes. Supplied, delivered and repaired by one team.
      </p>

      <div {...rise(0.4)} className='rise mt-9 flex flex-wrap items-center gap-3'>
        <LinkButton to='/shop' size='lg' flip>
          Browse equipment
          <ArrowRight className='size-4' strokeWidth={1.8} aria-hidden />
        </LinkButton>
        <Link
          to='/contact?subject=Quotation'
          className='flip inline-flex h-13 items-center rounded-full border border-line bg-white/60 px-6 text-[16px] text-ink transition-colors hover:bg-white sm:h-14'
        >
          <FlipLabel>Request a quotation</FlipLabel>
        </Link>
      </div>

      <dl {...rise(0.58)} className='rise mt-12 grid grid-cols-3 lg:mt-20'>
        {PROOF.map(({ value, label }, i) => (
          <div key={label} className={cn('flex flex-col gap-0.5 pr-3 sm:pr-8', i > 0 && 'border-l border-line pl-4 sm:pl-8')}>
            <dd className='text-[20px] leading-7 font-medium tracking-[-0.02em] text-ink sm:text-[22px]'>{value}</dd>
            <dt className='text-[13px] leading-5 text-muted'>{label}</dt>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default function ProductStageHero({ products }: { products: Product[] }) {
  return (
    <section aria-labelledby='hero-title' className='hero-bg hero-min relative isolate overflow-x-clip'>
      <HeroFloor />
      <div className='frame grid items-center gap-8 pt-6 pb-14 lg:min-h-[inherit] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12 lg:py-10 xl:gap-16'>
        <HeroCopy />
        <ProductStage products={products} />
      </div>
    </section>
  )
}
