import { useState, useEffect, Suspense, lazy } from "react";
import { motion } from "framer-motion";
import SplitText from "./SplitText";
import MagneticButton from "./MagneticButton";
import { useNavigation } from "../context/NavigationContext";

const HeroScene = lazy(() => import("./HeroScene"));

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: EASE },
});

function useMobileDetect(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < breakpoint,
  );
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", fn, { passive: true });
    return () => window.removeEventListener("resize", fn);
  }, [breakpoint]);
  return isMobile;
}

export default function Hero() {
  const navigateTo = useNavigation();
  const isMobile = useMobileDetect();

  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
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

      {/* Glow — centred on mobile, right-side on desktop */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: isMobile ? "50%" : "-5%",
          top: "50%",
          transform: isMobile ? "translate(50%, -50%)" : "translateY(-50%)",
          width: isMobile ? "90vw" : "55vw",
          height: isMobile ? "90vw" : "55vw",
          background:
            "radial-gradient(ellipse, rgba(232,75,26,.06) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* ── TEXT CONTENT ── */}
      <div
        style={{
          paddingTop: "clamp(100px,16vh,140px)",
          paddingBottom: "clamp(44px,8vh,80px)",
          zIndex: 1,
        }}
      >
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

        <div
          id="hero-heading"
          style={{ marginTop: 24 }}
          aria-label="Crafting Digital Futures"
        >
          {(["CRAFTING", "DIGITAL", "FUTURES"] as const).map((word, i) => (
            <div
              key={word}
              style={{ position: "relative", display: "block" }}
              aria-hidden="true"
            >
              <SplitText
                text={word}
                className="hword"
                immediate
                delay={0.2 + i * 0.14}
                charDelay={0.036}
              />
              <div className="text-grain-overlay" aria-hidden="true" />
            </div>
          ))}
        </div>

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
          Senior Frontend Engineer{" "}
          <span style={{ color: "var(--acc)" }}>→</span> AI Engineer in
          Progress.
          <br />
          React · TypeScript · LangChain · AWS
        </motion.p>

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
                "linear-gradient(to bottom, transparent, rgba(var(--fg-raw),.28))",
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

      {/* ── 3D SCENE — desktop only, never mounts on mobile ── */}
      {!isMobile && (
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
      )}
    </section>
  );
}
