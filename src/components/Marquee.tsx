import { MARQUEE_ITEMS } from '../data'

export default function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <div aria-hidden="true" className="marquee-band" style={{ padding: '13px 0', overflow: 'hidden' }}>
      <div className="mar" style={{ display: 'flex', gap: 52 }}>
        {items.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              letterSpacing: '.18em', textTransform: 'uppercase',
              color: 'var(--dim)', flexShrink: 0,
              display: 'flex', alignItems: 'center', gap: 52,
              transition: 'color .45s ease',
            }}
          >
            {item}
            <span style={{ color: 'var(--acc)', fontSize: 7, transition: 'color .45s ease' }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
