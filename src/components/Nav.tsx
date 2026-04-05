import { useState, useEffect } from "react";
import { useNavigation } from "../context/NavigationContext";
import ThemeToggle from "./ThemeToggle";

interface Props {
  progress: number;
  menuOpen: boolean;
  toggle: () => void;
}

const NAV_LINKS = ["Work", "About", "Stack", "Contact"];

export default function Nav({ progress, menuOpen, toggle }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const navigateTo = useNavigation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleNav = (id: string) => {
    if (menuOpen) toggle();
    navigateTo(id);
  };

  return (
    <>
      {/* Scroll progress bar */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: 2,
          width: progress + "%",
          background: "var(--acc)",
          zIndex: 1002,
          transition: "width .12s",
        }}
      />

      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{
          position: "fixed",
          top: 2,
          left: 0,
          right: 0,
          zIndex: 1001,
          padding: "18px clamp(20px,5vw,60px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? "var(--bg-nav)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid var(--brd)" : "none",
          transition: "background .4s, border-color .4s",
        }}
      >
        {/* Logo */}
        <button
          onClick={() => navigateTo("home")}
          aria-label="Go to top"
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              color: "var(--fg)",
              letterSpacing: ".12em",
              transition: "color .45s ease",
            }}
          >
            <span style={{ color: "var(--acc)" }}>// </span>androyt1@gmail.com
          </span>
        </button>

        {/* Desktop nav links */}
        <div
          className="hide-m"
          style={{ display: "flex", gap: 36, alignItems: "center" }}
        >
          {NAV_LINKS.map((l) => (
            <button
              key={l}
              onClick={() => handleNav(l.toLowerCase())}
              className="nl"
            >
              {l}
            </button>
          ))}
        </div>

        {/* Right side: available badge + theme toggle + hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Available badge — desktop only */}
          <div
            className="hide-m"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              letterSpacing: ".1em",
              color: "var(--grn)",
              padding: "5px 12px",
              border: "1px solid var(--grn-bdr)",
              borderRadius: 100,
              transition: "color .45s, border-color .45s",
            }}
          >
            <div
              className="bk"
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "var(--grn)",
                transition: "background .45s",
              }}
            />
            Available
          </div>

          {/* Theme toggle — always visible */}
          <ThemeToggle />

          {/* Hamburger — mobile only */}
          <button
            className="show-m"
            onClick={toggle}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            style={{
              background: "none",
              border: "none",
              padding: "4px 0",
              color: "var(--fg)",
              flexDirection: "column",
              gap: 5,
              cursor: "pointer",
            }}
          >
            <span
              style={{
                display: "block",
                width: 24,
                height: 1.5,
                background: menuOpen ? "transparent" : "var(--fg)",
                transition: "all .3s",
              }}
            />
            <span
              style={{
                display: "block",
                width: 24,
                height: 1.5,
                background: "var(--fg)",
                transition: "all .3s",
                transform: menuOpen
                  ? "translateY(-6.5px) rotate(45deg)"
                  : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: 16,
                height: 1.5,
                background: "var(--fg)",
                transition: "all .3s",
                transform: menuOpen
                  ? "translateY(0) scaleX(1.5) rotate(-45deg) translateX(-4px)"
                  : "none",
                transformOrigin: "left",
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile fullscreen menu */}
      <div
        className={`mmenu${menuOpen ? " open" : ""}`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-label="Navigation menu"
      >
        {NAV_LINKS.map((l) => (
          <button
            key={l}
            onClick={() => handleNav(l.toLowerCase())}
            className="mml"
          >
            {l}
          </button>
        ))}
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: "var(--grn)",
            letterSpacing: ".15em",
            marginTop: 8,
            transition: "color .45s",
          }}
        >
          ● Open to Opportunities
        </div>
      </div>
    </>
  );
}
