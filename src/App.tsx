import { useState, useEffect, useCallback } from 'react'
import { scrollTo } from './utils'
import { NavigationContext } from './context/NavigationContext'

import LoadScreen        from './components/LoadScreen'
import Nav               from './components/Nav'
import Hero              from './components/Hero'
import Marquee           from './components/Marquee'
import About             from './components/About'
import Projects          from './components/Projects'
import Stack             from './components/Stack'
import Contact           from './components/Contact'
import Footer            from './components/Footer'
import CurtainTransition from './components/CurtainTransition'

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

export default function App() {
  const [loaded,        setLoaded]        = useState(false)
  const [progress,      setProgress]      = useState(0)
  const [menuOpen,      setMenuOpen]      = useState(false)
  const [curtainVisible,setCurtainVisible] = useState(false)

  const handleDone = useCallback(() => setLoaded(true), [])

  /*
   * navigateTo — the curtain-aware navigation function.
   * Sequence:
   *   t=0      curtain slides in (500ms)
   *   t=540ms  scroll jumps to target (invisible behind curtain)
   *   t=640ms  curtain starts sliding out
   *   t=1140ms curtain gone, user sees new section
   */
  const navigateTo = useCallback(async (id: string) => {
    setCurtainVisible(true)
    await sleep(540)
    scrollTo(id)
    await sleep(100)
    setCurtainVisible(false)
  }, [])

  // ── Custom cursor (desktop only) ──────────────────────────────────────
  useEffect(() => {
    if (!loaded) return
    const c  = document.getElementById('_c')
    const cf = document.getElementById('_cf')
    if (!c || !cf) return
    let fx = -100, fy = -100, mx = -100, my = -100
    let raf: number
    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY
      c.style.left = mx - 5 + 'px'
      c.style.top  = my - 5 + 'px'
    }
    const loop = () => {
      fx += (mx - fx) * 0.11
      fy += (my - fy) * 0.11
      cf.style.left = fx - 19 + 'px'
      cf.style.top  = fy - 19 + 'px'
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(loop)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [loaded])

  // ── Scroll progress bar ───────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      if (h > 0) setProgress((window.scrollY / h) * 100)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [loaded])

  // ── .rv scroll reveals (paragraphs, tags etc — not headings) ─────────
  useEffect(() => {
    if (!loaded) return
    const els = document.querySelectorAll<HTMLElement>('.rv')
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          ;(e.target as HTMLElement).style.opacity   = '1'
          ;(e.target as HTMLElement).style.transform = 'translateY(0)'
        }
      })
    }, { threshold: 0.07 })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [loaded])

  // ── Close mobile menu on resize ───────────────────────────────────────
  useEffect(() => {
    const fn = () => { if (window.innerWidth > 768) setMenuOpen(false) }
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  return (
    /*
     * NavigationContext.Provider makes navigateTo available to every
     * component in the tree — no prop drilling needed.
     */
    <NavigationContext.Provider value={navigateTo}>
      {!loaded && <LoadScreen onDone={handleDone} />}

      {/* Curtain lives at the root so it covers everything */}
      <CurtainTransition visible={curtainVisible} />

      {loaded && (
        <>
          <button onClick={() => navigateTo('main-content')} className="skip-link">
            Skip to main content
          </button>

          <div id="_c"  aria-hidden="true" />
          <div id="_cf" aria-hidden="true" />

          <Nav
            progress={progress}
            menuOpen={menuOpen}
            toggle={() => setMenuOpen(m => !m)}
          />

          <main id="main-content" tabIndex={-1}>
            <Hero />
            <Marquee />
            <About />
            <Projects />
            <Stack />
            <Contact />
          </main>

          <Footer />
        </>
      )}
    </NavigationContext.Provider>
  )
}
