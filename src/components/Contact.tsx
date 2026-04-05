import { Github, Linkedin, Mail } from 'lucide-react'
import SplitText      from './SplitText'
import MagneticButton from './MagneticButton'
import { openLink, mailto } from '../utils'
import { LONDON_IMAGE } from '../data'

export default function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/*
       * London skyline background image
       * Sits behind everything via z-index.
       * Dark + blurred so it doesn't compete with the text.
       * In light mode: the overlay is lighter, image still subtle.
       */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, zIndex: 0,
      }}>
        <img
          src={LONDON_IMAGE}
          alt=""
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center 60%',
            filter: 'grayscale(40%) brightness(0.28)',
          }}
        />
        {/* Top fade — blends into the section above */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, var(--bg) 0%, transparent 30%, transparent 70%, var(--bg) 100%)',
          transition: 'background .45s',
        }} />
      </div>

      {/* All content sits above the background */}
      <div style={{
        position: 'relative', zIndex: 1,
        padding: 'clamp(80px,14vh,140px) clamp(20px,5vw,60px)',
        borderTop: '1px solid var(--brd)',
      }}>
        <div className="gnum" aria-hidden="true" style={{ position: 'absolute', right: 'clamp(20px,5vw,60px)', top: 0 }}>05</div>

        <div className="rv"><span className="slbl">Let's Connect</span></div>

        <h2 id="contact-heading" style={{
          fontFamily: "'Bebas Neue', impact, sans-serif",
          fontSize: 'clamp(44px,7vw,86px)', lineHeight: 0.92,
          marginTop: 12, maxWidth: '14ch',
        }}>
          <SplitText text="OPEN TO NEW"   delay={0}    charDelay={0.028} />
          <SplitText text="OPPORTUNITIES" delay={0.22} charDelay={0.028} />
        </h2>

        <p className="rv d2" style={{
          marginTop: 28,
          fontSize: 'clamp(14px,1.7vw,16px)', lineHeight: 1.75,
          color: 'var(--dim)', maxWidth: 460,
        }}>
          Whether it's an AI engineering role, a frontend contract, or a wild idea
          for the Nigerian market — let's talk.
        </p>

        <div className="rv d3" style={{ marginTop: 44 }}>
          <MagneticButton
            className="clink"
            onClick={() => mailto('hello@andrew.dev')}
            aria-label="Email Andrew"
            strength={0.18}
          >
            hello@andrew.dev
          </MagneticButton>
        </div>

        <div className="rv d4" style={{
          marginTop: 44, display: 'flex',
          gap: 14, alignItems: 'center', flexWrap: 'wrap',
        }}>
          <MagneticButton
            className="ibtn"
            onClick={() => openLink('https://github.com/andrewdev')}
            aria-label="GitHub profile"
            strength={0.5}
          >
            <Github size={17} aria-hidden="true" />
          </MagneticButton>

          <MagneticButton
            className="ibtn"
            onClick={() => openLink('https://linkedin.com/in/andrewdev')}
            aria-label="LinkedIn profile"
            strength={0.5}
          >
            <Linkedin size={17} aria-hidden="true" />
          </MagneticButton>

          <MagneticButton
            className="ibtn"
            onClick={() => mailto('hello@andrew.dev')}
            aria-label="Send email"
            strength={0.5}
          >
            <Mail size={17} aria-hidden="true" />
          </MagneticButton>

          <div style={{
            marginLeft: 8,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11, color: 'var(--dim)', letterSpacing: '.1em',
          }}>
            Based in London · Available worldwide
          </div>
        </div>
      </div>
    </section>
  )
}
