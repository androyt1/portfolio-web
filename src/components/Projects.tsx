import { useRef, useState } from 'react'
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
} from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import SplitText from './SplitText'
import { PROJECTS } from '../data'
import { openLink } from '../utils'

/* ─────────────────────────────────────────────
   PROJECT CARD
───────────────────────────────────────────── */
function ProjectCard({ p, index }: { p: typeof PROJECTS[0]; index: number }) {
  const [hovered, setHovered] = useState(false)

  /* ── Card entrance ref (fade + slide up on scroll into view) ── */
  const cardRef    = useRef<HTMLDivElement>(null)
  const inView     = useInView(cardRef, { once: true, margin: '-8% 0px' })

  /* ── Parallax ref — attached to the image container ── */
  const imageRef   = useRef<HTMLDivElement>(null)

  /*
   * useScroll tracks scroll progress relative to the image container.
   * offset: ["start end", "end start"]
   *   → progress = 0 when container's TOP hits viewport BOTTOM (entering)
   *   → progress = 1 when container's BOTTOM hits viewport TOP  (leaving)
   *
   * This gives us the full travel of the element through the viewport.
   */
  const { scrollYProgress } = useScroll({
    target : imageRef,
    offset : ['start end', 'end start'],
  })

  /*
   * useTransform maps 0→1 progress to -50px→50px image shift.
   * At progress 0 (card entering from below): image starts 50px HIGH
   * At progress 0.5 (card centred):           image is at 0 (natural)
   * At progress 1 (card leaving above):        image ends  50px LOW
   *
   * The image content therefore moves SLOWER than the page scroll —
   * that lag is the depth illusion.
   *
   * useSpring smooths the discrete scroll events into a buttery curve.
   * stiffness 80 / damping 20 = gentle, not snappy.
   */
  const rawY      = useTransform(scrollYProgress, [0, 1], [-50, 50])
  const parallaxY = useSpring(rawY, { stiffness: 80, damping: 20, mass: 0.4 })

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 56 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.82, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
      <button
        onClick={() => openLink(p.link)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={`View ${p.title} on GitHub`}
        style={{
          width: '100%', textAlign: 'left',
          background: 'none', border: 'none', color: 'inherit',
          cursor: 'pointer', display: 'block', padding: 0,
        }}
      >

        {/* ── IMAGE CONTAINER — clips the parallax image ── */}
        <div
          ref={imageRef}
          style={{
            position    : 'relative',
            width       : '100%',
            paddingBottom: '62%',        /* 16:10 aspect ratio */
            overflow    : 'hidden',      /* clips image that extends beyond bounds */
            borderLeft  : `3px solid ${p.color}`,
            transition  : 'border-color .3s',
          }}
        >

          {/*
           * ── SCALE WRAPPER ──
           * Handles the hover scale separately from parallax.
           * If we put scale + y on the same motion element, they
           * compose as a single matrix — which is fine but harder
           * to reason about. Separating them keeps the intent clear.
           */}
          <motion.div
            style={{ position: 'absolute', inset: 0 }}
            animate={{ scale: hovered ? 1.06 : 1 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            {/*
             * ── PARALLAX IMAGE ──
             *
             * height: 130% + top: -15%  →  centred, 30% extra room
             * (15% above, 15% below the container)
             * The ±50px parallax travel fits comfortably within that buffer
             * so we never see the background peeking through.
             *
             * style.y = parallaxY (MotionValue) — framer-motion updates
             * this directly on the DOM node, bypassing React re-renders.
             * That's why it stays silky even at 60fps while scrolling.
             */}
            <motion.img
              src={p.image}
              alt={`${p.title} project cover`}
              loading="lazy"
              style={{
                position      : 'absolute',
                width         : '100%',
                height        : '130%',        /* taller than container */
                top           : '-15%',        /* centred vertically */
                left          : 0,
                objectFit     : 'cover',
                objectPosition: 'center',
                y             : parallaxY,     /* the parallax shift */
                filter        : hovered
                  ? 'grayscale(0%)   brightness(0.72) saturate(1.1)'
                  : 'grayscale(30%) brightness(0.55) saturate(0.9)',
                transition    : 'filter .55s ease',
              }}
            />
          </motion.div>

          {/* Gradient overlay — ensures text legibility over any image */}
          <div style={{
            position  : 'absolute', inset: 0,
            background: `linear-gradient(
              to top,
              rgba(8,8,8,0.92) 0%,
              rgba(8,8,8,0.45) 45%,
              rgba(8,8,8,0.10) 100%
            )`,
            pointerEvents: 'none',
          }} />

          {/* Top-right: year + arrow */}
          <div style={{
            position: 'absolute', top: 16, right: 16,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10, letterSpacing: '.12em',
              color: 'rgba(255,255,255,0.5)',
            }}>
              {p.year}
            </span>
            <div style={{
              width: 32, height: 32,
              border: '1px solid rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,0.7)',
              transform: hovered ? 'translate(4px,-4px)' : 'translate(0,0)',
              transition: 'transform .35s ease',
            }}>
              <ArrowUpRight size={14} />
            </div>
          </div>

          {/* Ghost project number */}
          <div
            aria-hidden="true"
            style={{
              position       : 'absolute', top: 10, left: 14,
              fontFamily     : "'Bebas Neue', impact, sans-serif",
              fontSize       : 'clamp(52px,8vw,88px)',
              color          : 'transparent',
              WebkitTextStroke: '1px rgba(255,255,255,0.08)',
              lineHeight     : 1, userSelect: 'none',
            }}
          >
            {p.id}
          </div>

          {/* Bottom text — category + title */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding : '20px 18px 18px',
          }}>
            <div style={{
              fontFamily   : "'JetBrains Mono', monospace",
              fontSize     : 10, letterSpacing: '.18em', textTransform: 'uppercase',
              color        : p.color, marginBottom: 6,
              opacity      : hovered ? 1 : 0.8,
              transition   : 'opacity .3s',
            }}>
              {p.cat}
            </div>
            <h3 style={{
              fontFamily  : "'Bebas Neue', impact, sans-serif",
              fontSize    : 'clamp(22px,3.2vw,38px)', lineHeight: 0.95,
              letterSpacing: '.01em', color: '#fff', margin: 0,
            }}>
              {p.title}
            </h3>
          </div>
        </div>

        {/* Below image: description + tags */}
        <div style={{
          padding     : '18px 4px 28px',
          borderBottom: '1px solid var(--brd)',
        }}>
          <p style={{
            fontSize  : 'clamp(13px,1.4vw,14px)', lineHeight: 1.72,
            color     : 'var(--dim)', margin: '0 0 14px', maxWidth: 560,
            opacity   : hovered ? 1 : 0.85,
            transition: 'opacity .35s',
          }}>
            {p.desc}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {p.tags.map(t => (
              <span
                key={t}
                className="ptag"
                style={{
                  borderColor: hovered ? p.color + '55' : undefined,
                  transition : 'border-color .35s',
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

      </button>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   PROJECTS SECTION
───────────────────────────────────────────── */
export default function Projects() {
  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      style={{ padding: 'clamp(80px,14vh,140px) clamp(20px,5vw,60px)', position: 'relative' }}
    >
      <div className="gnum" aria-hidden="true" style={{ position: 'absolute', right: 'clamp(20px,5vw,60px)', top: 0 }}>03</div>

      <div style={{
        display        : 'flex', alignItems: 'flex-end',
        justifyContent : 'space-between',
        marginBottom   : 56, flexWrap: 'wrap', gap: 16,
      }}>
        <div>
          <div className="rv"><span className="slbl">Selected Work</span></div>
          <h2 id="work-heading" style={{
            fontFamily: "'Bebas Neue', impact, sans-serif",
            fontSize  : 'clamp(44px,7vw,86px)', lineHeight: 0.92, marginTop: 12,
          }}>
            <SplitText text="FEATURED" delay={0}    charDelay={0.03} />
            <SplitText text="PROJECTS" delay={0.18} charDelay={0.03} />
          </h2>
        </div>
        <div className="rv d2" style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11, color: 'var(--dim)', letterSpacing: '.1em',
        }}>
          0{PROJECTS.length} projects
        </div>
      </div>

      <div style={{
        display              : 'grid',
        gridTemplateColumns  : 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))',
        gap                  : 'clamp(24px,4vw,48px)',
      }}>
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.id} p={p} index={i} />
        ))}
      </div>
    </section>
  )
}
