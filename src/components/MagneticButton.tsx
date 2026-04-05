import { useRef, ReactNode, CSSProperties } from 'react'
import { motion, useSpring } from 'framer-motion'

interface MagneticButtonProps {
  children    : ReactNode
  className  ?: string
  style      ?: CSSProperties
  onClick    ?: () => void
  'aria-label'?: string
  /**
   * How strongly the button moves toward the cursor.
   * 0 = no movement, 1 = full cursor offset.
   * Sweet spot: 0.3 – 0.45
   */
  strength   ?: number
}

export default function MagneticButton({
  children,
  className,
  style,
  onClick,
  strength = 0.38,
  'aria-label': ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)

  /*
   * useSpring creates motion values that behave like physical springs.
   * stiffness: how fast it snaps back  |  damping: how much it overshoots
   * mass: lighter = more responsive
   */
  const x = useSpring(0, { stiffness: 160, damping: 18, mass: 0.08 })
  const y = useSpring(0, { stiffness: 160, damping: 18, mass: 0.08 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    // Distance from cursor to button centre
    const cx = rect.left + rect.width  / 2
    const cy = rect.top  + rect.height / 2
    // Push button toward cursor, scaled by strength
    x.set((e.clientX - cx) * strength)
    y.set((e.clientY - cy) * strength)
  }

  const handleMouseLeave = () => {
    // Spring physics automatically animates back to 0,0
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      className={className}
      style={{ ...style, x, y }}   // framer-motion reads MotionValues here
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label={ariaLabel}
      // Subtle scale on press — feels physical
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.button>
  )
}
