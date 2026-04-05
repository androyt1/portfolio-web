import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  visible: boolean
}

/*
 * How the curtain works:
 *
 * 1. User clicks a nav item  →  curtain starts sliding in from the LEFT
 * 2. At ~500ms it fully covers the screen
 * 3. App scrolls to the target section (user can't see it happen)
 * 4. curtain visible = false  →  AnimatePresence plays the exit animation
 * 5. Curtain slides out to the RIGHT — revealing the new section underneath
 *
 * The "wipe left → wipe right" creates the classic cinema curtain effect.
 */
export default function CurtainTransition({ visible }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Main orange curtain */}
          <motion.div
            aria-hidden="true"
            key="curtain-main"
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.52, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position    : 'fixed',
              inset       : 0,
              background  : '#E84B1A',
              zIndex      : 9999,
              pointerEvents: 'none',
            }}
          />

          {/* Thin trailing edge — gives depth, makes it feel layered */}
          <motion.div
            aria-hidden="true"
            key="curtain-trail"
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.52, ease: [0.76, 0, 0.24, 1], delay: 0.06 }}
            style={{
              position    : 'fixed',
              inset       : 0,
              background  : '#080808',
              zIndex      : 9998,
              pointerEvents: 'none',
            }}
          />
        </>
      )}
    </AnimatePresence>
  )
}
