import { useRef, CSSProperties } from 'react'
import { motion, useInView } from 'framer-motion'

interface SplitTextProps {
  text       : string
  className ?: string
  style     ?: CSSProperties
  /** Base delay before the first char starts (seconds) */
  delay     ?: number
  /** Stagger between each character (seconds) */
  charDelay ?: number
  /** true = animate immediately on mount (hero words)
   *  false = animate when element scrolls into view (default) */
  immediate ?: boolean
}

export default function SplitText({
  text,
  className,
  style,
  delay     = 0,
  charDelay = 0.034,
  immediate = false,
}: SplitTextProps) {
  const ref      = useRef<HTMLSpanElement>(null)
  // useInView watches when the element enters the viewport
  const isInView = useInView(ref, { once: true, margin: '-12% 0px' })

  // Hero words animate right away; section headings wait for scroll
  const shouldAnimate = immediate || isInView

  return (
    <span
      ref={ref}
      className={className}
      style={{ ...style, display: 'block' }}
      aria-label={text}    // screen readers see the full word, not individual chars
    >
      {text.split('').map((char, i) => (
        /*
         * Outer span = the "mask box". overflow:hidden clips the char.
         * Inner motion.span = the char itself, slides up from y:105% to y:0%.
         * When char is hidden below the clip, it looks like it's behind a wall.
         * When it slides up it "emerges" — the classic awwwards reveal.
         */
        <span
          key={i}
          aria-hidden="true"
          style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}
        >
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '108%' }}
            animate={shouldAnimate ? { y: '0%' } : { y: '108%' }}
            transition={{
              duration : 0.72,
              delay    : delay + i * charDelay,
              ease     : [0.16, 1, 0.3, 1],   // custom cubic-bezier: fast settle
            }}
          >
            {/* Non-breaking space keeps the gap between words */}
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
