import { useState, useEffect } from "react";

interface Props {
  onDone: () => void;
}

export default function LoadScreen({ onDone }: Props) {
  const [n, setN] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let val = 0;
    const id = setInterval(() => {
      val += Math.floor(Math.random() * 7) + 2;
      if (val >= 100) {
        setN(100);
        clearInterval(id);
        setTimeout(() => {
          setExiting(true);
          setTimeout(onDone, 650);
        }, 280);
      } else {
        setN(val);
      }
    }, 36);
    return () => clearInterval(id);
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--bg)",
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "clamp(28px,6vw,72px)",
        transition:
          "opacity .65s ease, transform .65s cubic-bezier(.16,1,.3,1)",
        opacity: exiting ? 0 : 1,
        transform: exiting ? "translateY(-24px)" : "none",
        pointerEvents: exiting ? "none" : "all",
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          letterSpacing: ".2em",
          textTransform: "uppercase",
          color: "var(--dim)",
          marginBottom: 14,
        }}
      >
        Building experience
      </div>
      <div
        style={{
          fontFamily: "'Bebas Neue', impact, sans-serif",
          fontSize: "clamp(96px,21vw,240px)",
          lineHeight: 0.9,
          color: "var(--fg)",
        }}
      >
        {String(Math.min(n, 100)).padStart(3, "0")}
      </div>
      <div
        style={{
          marginTop: 28,
          height: 1,
          background: "var(--brd)",
          width: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            background: "var(--acc)",
            width: n + "%",
            transition: "width .08s linear",
          }}
        />
      </div>
      <div
        style={{
          marginTop: 12,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          letterSpacing: ".1em",
          color: "var(--dim)",
        }}
      >
        <span>androyt1@gmail.com</span>
        <span>{Math.min(n, 100)}%</span>
      </div>
    </div>
  );
}
