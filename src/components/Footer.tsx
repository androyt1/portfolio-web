export default function Footer() {
  return (
    <footer style={{
      padding: '22px clamp(20px,5vw,60px)',
      borderTop: '1px solid var(--brd)',
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', flexWrap: 'wrap', gap: 10,
      transition: 'border-color .45s ease',
    }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--dim)', letterSpacing: '.1em', transition: 'color .45s ease' }}>
        © {new Date().getFullYear()} Andrew — Senior Frontend &amp; AI Engineer
      </span>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--dim)', letterSpacing: '.1em', transition: 'color .45s ease' }}>
        Built with React · Tailwind · 🤍
      </span>
    </footer>
  )
}
