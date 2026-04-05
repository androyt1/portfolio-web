# Andrew · Portfolio

A cinematic, awwwards-level developer portfolio built with **React 18 + TypeScript + Vite + Tailwind CSS**.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

## 📦 Build for Production

```bash
npm run build    # compiles TypeScript + bundles with Vite
npm run preview  # preview the production build locally
```

## 🗂 Project Structure

```
portfolio/
├── index.html                  # HTML entry point
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.tsx                # React root mount
    ├── App.tsx                 # Root component — wires everything together
    ├── styles/
    │   └── portfolio.css       # All global styles + animations
    ├── data/
    │   └── index.ts            # Projects, skills, marquee data — edit here
    ├── utils/
    │   └── index.ts            # scrollTo, openLink, mailto helpers
    └── components/
        ├── LoadScreen.tsx      # Animated loading counter
        ├── Nav.tsx             # Fixed nav + mobile menu
        ├── Hero.tsx            # Full-viewport hero section
        ├── Marquee.tsx         # Scrolling tech stack ticker
        ├── About.tsx           # About + stats table
        ├── Projects.tsx        # Featured work cards
        ├── Stack.tsx           # Skills grid
        ├── Contact.tsx         # Contact section + social links
        └── Footer.tsx          # Footer
```

## ✏️ Personalising the Portfolio

All content lives in **`src/data/index.ts`** — open that file and update:

- `PROJECTS` — your project titles, descriptions, GitHub links, tags
- `SKILLS` — your skill groups and items
- `MARQUEE_ITEMS` — the scrolling ticker text

Update your personal details in these components:

| What to change | File |
|---|---|
| Name, email, GitHub, LinkedIn | `src/components/Contact.tsx` |
| Hero tagline, role title | `src/components/Hero.tsx` |
| About bio, stats table | `src/components/About.tsx` |
| Logo text `// andrew.dev` | `src/components/Nav.tsx` |
| Page title & meta description | `index.html` |

## 🎨 Changing the Accent Colour

Open `src/styles/portfolio.css` and update the `--acc` CSS variable:

```css
:root {
  --acc: #E84B1A;  /* ← change this to any colour you like */
}
```

## 📱 Responsive

- Full responsive layout for all screen sizes
- Mobile fullscreen slide-down menu
- Custom cursor hidden on touch devices automatically

## ♿ Accessibility (WCAG 2.1 AA)

- Skip-to-main-content link
- All interactive elements have `aria-label`
- Keyboard navigable with visible focus rings
- `aria-hidden` on all decorative elements
- `role` and `aria-expanded` on mobile menu

## 🛠 Tech Stack

- **React 18** + **TypeScript**
- **Vite** — lightning fast dev server
- **Tailwind CSS** — utility classes
- **lucide-react** — icons
- **Google Fonts** — Bebas Neue, DM Sans, JetBrains Mono
