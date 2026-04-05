import SplitText from './SplitText'
import { SKILLS } from '../data'

export default function Stack() {
  return (
    <section
      id="stack"
      aria-labelledby="stack-heading"
      style={{ padding: 'clamp(80px,14vh,140px) clamp(20px,5vw,60px)', position: 'relative' }}
    >
      <div className="gnum" aria-hidden="true" style={{ position: 'absolute', right: 'clamp(20px,5vw,60px)', top: 0 }}>04</div>

      <div className="rv"><span className="slbl">Capabilities</span></div>

      <h2 id="stack-heading" style={{
        fontFamily: "'Bebas Neue', impact, sans-serif",
        fontSize: 'clamp(44px,7vw,86px)', lineHeight: 0.92,
        marginTop: 12, marginBottom: 56,
      }}>
        <SplitText text="MY STACK" delay={0} charDelay={0.04} />
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
        gap: 'clamp(36px,5.5vw,68px)',
      }}>
        {SKILLS.map((group, gi) => (
          <div key={group.label} className={`rv d${Math.min(gi + 1, 4)}`}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: '#E84B1A', marginBottom: 20 }}>
              {group.label}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }} role="list" aria-label={`${group.label} skills`}>
              {group.items.map(item => <span key={item} className="spill" role="listitem">{item}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
