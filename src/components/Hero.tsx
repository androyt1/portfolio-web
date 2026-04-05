import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import SplitText from "./SplitText";
import MagneticButton from "./MagneticButton";
import { useNavigation } from "../context/NavigationContext";

const HeroScene = lazy(() => import("./HeroScene"));

/* Shared easing used across all hero animations */
const EASE = [0.16, 1, 0.3, 1] as const;

/* Fade-up animation for non-text elements (subtitle, scroll indicator) */
const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: EASE },
});

export default function Hero() {
  const navigateTo = useNavigation();

  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "center",
        padding: "0 clamp(20px,5vw,60px)",
        position: "relative",
        overflow: "hidden",
        gap: "clamp(20px,4vw,60px)",
      }}
    >
      {/* Background grid lines */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(238,235,228,.018) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(238,235,228,.018) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          pointerEvents: "none",
        }}
      />

      {/* Glow behind 3D scene */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: "-5%",
          top: "50%",
          transform: "translateY(-50%)",
          width: "55vw",
          height: "55vw",
          background:
            "radial-gradient(ellipse, rgba(232,75,26,.07) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* ── LEFT — text content ────────────────────────────────────── */}
      <div
        style={{
          paddingTop: "clamp(80px,12vh,120px)",
          paddingBottom: "clamp(44px,8vh,80px)",
          zIndex: 1,
        }}
      >
        {/* Location badge */}
        <motion.div {...fadeUp(0.1)}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              letterSpacing: ".22em",
              textTransform: "uppercase",
              color: "var(--dim)",
            }}
          >
            ◌ London, UK · Est. 2026
          </span>
        </motion.div>

        {/*
         * ── HERO WORDS ──────────────────────────────────────────────
         * Each word:
         *   1. SplitText animates chars up from behind a clip mask
         *   2. .text-grain-overlay sits on top with mix-blend-mode: overlay
         *      → noise only shows where text is light, creating letterpress grain
         */}
        <div
          id="hero-heading"
          style={{ marginTop: 24 }}
          aria-label="Crafting Digital Futures"
        >
          {(["CRAFTING", "DIGITAL", "FUTURES"] as const).map((word, i) => (
            <div
              key={word}
              style={{ position: "relative", display: "block" }}
              aria-hidden="true" /* parent div has aria-label for screen readers */
            >
              <SplitText
                text={word}
                className="hword"
                immediate
                delay={0.2 + i * 0.14}
                charDelay={0.036}
              />
              {/* Noise overlay — gives the "letterpress / screen-printed" texture */}
              <div className="text-grain-overlay" aria-hidden="true" />
            </div>
          ))}
        </div>

        {/* Subtitle */}
        <motion.p
          {...fadeUp(0.72)}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(13px,1.6vw,17px)",
            color: "var(--dim)",
            lineHeight: 1.65,
            marginTop: 24,
            maxWidth: 360,
          }}
        >
          Senior Frontend Engineer <span style={{ color: "#E84B1A" }}>→</span>{" "}
          AI Engineer in Progress.
          <br />
          React · TypeScript · LangChain · AWS
        </motion.p>

        {/*
         * ── MAGNETIC BUTTONS ────────────────────────────────────────
         * Each button tracks the cursor within its bounding box.
         * useSpring snaps it back with a satisfying "wobble" on mouse leave.
         */}
        <motion.div
          {...fadeUp(0.88)}
          style={{
            marginTop: 36,
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <MagneticButton
            className="btn-primary"
            onClick={() => navigateTo("work")}
            aria-label="View selected projects"
          >
            View Work ↗
          </MagneticButton>

          <MagneticButton
            className="btn-outline"
            onClick={() => navigateTo("contact")}
            aria-label="Get in touch"
          >
            Let's Talk
          </MagneticButton>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          {...fadeUp(1.0)}
          aria-hidden="true"
          style={{
            marginTop: 48,
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "var(--dim)",
          }}
        >
          <div
            style={{
              width: 1,
              height: 44,
              background:
                "linear-gradient(to bottom, transparent, rgba(238,235,228,.28))",
              animation: "float 2.2s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              letterSpacing: ".22em",
              textTransform: "uppercase",
              writingMode: "vertical-rl",
            }}
          >
            scroll
          </span>
        </motion.div>
      </div>

      {/* ── RIGHT — 3D scene ─────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          width: "100%",
          height: "clamp(340px, 55vw, 680px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </div>

      {/* Mobile: stack layout, hide 3D scene */}
      <style>{`
        @media (max-width: 768px) {
          #home {
            grid-template-columns: 1fr !important;
            padding-bottom: clamp(44px,8vh,80px) !important;
          }
          #home > div:last-child { display: none !important; }
          #home > div:first-child { padding-top: clamp(100px,16vh,140px) !important; }
        }
      `}</style>
    </section>
  );
}
