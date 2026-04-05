import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SplitText from "./SplitText";

const STATS = [
  { label: "Experience", val: "7+ Years" },
  { label: "Focus", val: "AI Engineering" },
  { label: "Location", val: "London, UK" },
  { label: "Market", val: "Nigeria-first" },
  { label: "Current", val: "10-Wk AI Course" },
  { label: "Status", val: "Open to Roles", hi: true },
];

/* ── Photo component with all its visual effects ── */
function ProfilePhoto() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      style={{
        /* Constrain photo width — tall portrait on desktop, full-width on mobile */
        width: "min(260px, 100%)",
        flexShrink: 0,
        position: "relative",
      }}
    >
      {/* ── Decorative orange bracket — top-left corner ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -10,
          left: -10,
          width: 28,
          height: 28,
          borderTop: "2px solid var(--acc)",
          borderLeft: "2px solid var(--acc)",
          zIndex: 2,
          pointerEvents: "none",
          transition: "border-color .45s",
        }}
      />

      {/* ── Decorative bracket — bottom-right corner ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: -10,
          right: -10,
          width: 28,
          height: 28,
          borderBottom: "2px solid var(--acc)",
          borderRight: "2px solid var(--acc)",
          zIndex: 2,
          pointerEvents: "none",
          transition: "border-color .45s",
        }}
      />

      {/* ── Orange side accent bar ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: "var(--acc)",
          zIndex: 2,
          transition: "background .45s",
        }}
      />

      {/*
       * ── The photo itself ──
       *
       * filter: grayscale(25%) saturate(0.85) → editorial, not a selfie
       * On hover: full colour snaps back → feels intentional and alive
       * object-position: center 15% → keeps face centred despite portrait crop
       * The group hover pattern: we put the hover on the wrapper div,
       * then the img transition handles the rest via CSS.
       */}
      <div
        className="photo-wrapper"
        style={{
          width: "100%",
          paddingBottom: "130%" /* 3:4 portrait ratio */,
          position: "relative",
          overflow: "hidden",
          /* Subtle warm shadow — stronger in dark mode */
          boxShadow: "8px 8px 0px var(--acc)",
          transition: "box-shadow .35s ease",
        }}
      >
        <img
          src="/andrew.png"
          alt="Andrew — Senior Frontend & AI Engineer"
          className="profile-img"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 18%",
            /* Grayscale + slight desaturate in default state */
            filter: "grayscale(22%) saturate(0.88)",
            transition: "filter .45s ease, transform .55s ease",
            display: "block",
          }}
        />
      </div>

      {/* ── Name tag underneath photo ── */}
      <div
        style={{
          marginTop: 14,
          paddingLeft: 12,
          borderLeft: "2px solid var(--brd)",
          transition: "border-color .45s",
        }}
      >
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: ".14em",
            textTransform: "uppercase",
            color: "var(--acc)",
            marginBottom: 4,
          }}
        >
          Andrew Aghoghovwia.
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            letterSpacing: ".1em",
            color: "var(--dim)",
          }}
        >
          Sr. Frontend → AI Engineer
        </div>
      </div>

      {/* Inline styles for hover — CSS class approach */}
      <style>{`
        .photo-wrapper:hover .profile-img {
          filter: grayscale(0%) saturate(1);
          transform: scale(1.03);
        }
        .photo-wrapper:hover {
          box-shadow: 12px 12px 0px var(--acc);
        }
      `}</style>
    </motion.div>
  );
}

/* ── Main About section ── */
export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      style={{
        padding: "clamp(80px,14vh,140px) clamp(20px,5vw,60px)",
        position: "relative",
      }}
    >
      <div
        className="gnum"
        aria-hidden="true"
        style={{ position: "absolute", right: "clamp(20px,5vw,60px)", top: 0 }}
      >
        02
      </div>

      <div className="rv">
        <span className="slbl">About Me</span>
      </div>

      {/*
       * Layout: 3 columns on desktop (photo | bio | stats)
       *         stacked on mobile
       *
       * auto-fit with minmax means:
       *   - If there's room for 3 cols → 3 cols
       *   - On tablet → 2 cols (photo + bio, stats below)
       *   - On mobile → 1 col (all stacked)
       */}
      <div
        style={{
          marginTop: 48,
          display: "flex",
          flexWrap: "wrap",
          gap: "clamp(36px,6vw,80px)",
          alignItems: "flex-start",
        }}
      >
        {/* ── COL 1: Photo ── */}
        <ProfilePhoto />

        {/* ── COL 2: Bio + heading ── */}
        <div style={{ flex: "1 1 280px", minWidth: 0 }}>
          <h2
            id="about-heading"
            style={{
              fontFamily: "'Bebas Neue', impact, sans-serif",
              fontSize: "clamp(40px,6vw,78px)",
              lineHeight: 0.92,
              letterSpacing: "-.01em",
              marginBottom: 28,
            }}
          >
            <SplitText text="BUILDING AT THE" delay={0} charDelay={0.026} />
            <SplitText
              text="FRONTIER OF"
              delay={0.18}
              charDelay={0.026}
              style={{ color: "var(--acc)" }}
            />
            <SplitText text="WEB & AI" delay={0.36} charDelay={0.026} />
          </h2>

          <p
            className="rv d2"
            style={{
              fontSize: "clamp(14px,1.6vw,16px)",
              lineHeight: 1.8,
              color: "var(--dim)",
              maxWidth: 460,
            }}
          >
            I'm a Senior Frontend Engineer based in London with 7+ years
            shipping production React and TypeScript at scale — most recently at
            HSBC. I'm actively transitioning into AI engineering, building RAG
            systems, multi-agent workflows, and LLM-powered applications.
          </p>

          <p
            className="rv d3"
            style={{
              fontSize: "clamp(14px,1.6vw,16px)",
              lineHeight: 1.8,
              color: "var(--dim)",
              marginTop: 16,
              maxWidth: 460,
            }}
          >
            My passion is bridging beautiful user experiences with cutting-edge
            AI — particularly for underserved markets. I'm building tools for
            Nigeria with voice AI, mobile-first design, and offline-capable
            systems.
          </p>

          {/* Availability pill — repeated here for mobile where the nav badge is hidden */}
          <div
            className="rv d4"
            style={{
              marginTop: 28,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                letterSpacing: ".14em",
                textTransform: "uppercase",
                color: "var(--grn)",
                padding: "6px 14px",
                border: "1px solid var(--grn-bdr)",
                borderRadius: 100,
                transition: "color .45s, border-color .45s",
              }}
            >
              <span
                className="bk"
                style={{
                  display: "inline-block",
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "var(--grn)",
                  transition: "background .45s",
                }}
              />
              Open to opportunities
            </div>
          </div>
        </div>

        {/* ── COL 3: Stats table ── */}
        <div className="rv d2" style={{ flex: "1 1 220px", minWidth: 0 }}>
          {/* Mono label above table */}
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              letterSpacing: ".22em",
              textTransform: "uppercase",
              color: "var(--acc)",
              marginBottom: 20,
            }}
          >
            Quick Facts
          </div>

          {STATS.map(({ label, val, hi }) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 0",
                borderBottom: "1px solid var(--brd-sec)",
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  color: "var(--dim)",
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: hi ? "var(--grn)" : "var(--fg)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "color .45s",
                }}
              >
                {hi && (
                  <span
                    className="bk"
                    style={{
                      display: "inline-block",
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "var(--grn)",
                      transition: "background .45s",
                    }}
                  />
                )}
                {val}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
