# a3outsourcing — Insurance Website

Modern, dark-mode, glassmorphism insurance website with scroll-driven animations, particle effects, and responsive design.

## Directory Structure

```
a3site/
├── index.html            ← Home page
├── services.html         ← Services page
├── contact.html          ← Contact page
├── css/
│   ├── tokens.css        ← Design tokens (CSS variables)
│   └── styles.css        ← Global styles, animations, responsive
├── js/
│   ├── components.js     ← Shared navbar + footer (injected via JS)
│   └── main.js           ← Scroll reveals, particles, carousels, form validation
├── assets/
│   ├── heroes/           ← Hero slide background images
│   │   └── (place slide1.jpg, slide2.jpg, etc. here)
│   └── logos/            ← Partner & brand logo images
│       └── (place lic.png, hdfc.png, a3logo.svg, etc. here)
└── README.md
```

## Pages

| Page | File | Content |
|------|------|---------|
| **Home** | `index.html` | Hero image carousel, KPI counters, mission, growth timeline, core services, partner marquee, testimonials, CTA |
| **Services** | `services.html` | Expandable service cards (Health, Life, Motor, Home, Personal Accident) with features |
| **Contact** | `contact.html` | Validated form, contact details, Google Maps embed (dark themed) |

## Design System

- **Fonts**: Bricolage Grotesque (display), Manrope (body), JetBrains Mono (numbers)
- **Colors**: `#FF2A2A` (brand red), `#050608` (background), glass panels with backdrop-blur
- **Icons**: All inline SVG — zero emoji, zero icon library dependency
- **Logo**: CSS `.a3-logo` class with gradient background

## Features

- Hero carousel with real background images (crossfade + Ken Burns zoom)
- Animated counters for KPIs (IntersectionObserver triggered)
- Partner logo marquee (dual-row, auto-scroll, hover-pause)
- Testimonial slider (5 client reviews, auto-advance)
- Mouse-reactive particle canvas (desktop only, auto-disabled on mobile)
- Scroll progress bar
- Glass-morphism cards with gradient border hover
- Expandable service cards with features grid
- Contact form with client-side validation
- Google Maps embed with dark-mode filter
- Fully responsive (mobile-first grid collapse)
- `prefers-reduced-motion` respected

## How to Run

Open `index.html` in any browser. No build step needed.

```bash
# Optional local server:
npx serve .
# or
python3 -m http.server 8000
```

## Replacing Placeholder Images

### Hero backgrounds
In `index.html`, replace the Unsplash `src` URLs in `.hero-img-slide img` elements:
```html
<img src="assets/heroes/slide1.jpg" alt="..." loading="eager">
```

### Partner logos
In the marquee section, replace the `.partner-logo-mark` div with actual images:
```html
<!-- Before (placeholder) -->
<div class="partner-logo-mark" style="...">LI</div>

<!-- After (real logo) -->
<img src="assets/logos/lic.png" alt="LIC" style="height:28px">
```

## Customization

| What | Where |
|------|-------|
| Brand colors | `css/tokens.css` → `:root` variables |
| Fonts | `css/styles.css` → `@import url(...)` + `:root` font variables |
| Animation timing | `css/styles.css` → `@keyframes` and `.sr` transition values |
| Particle density | `js/main.js` → `initParticles()` → change `length: 40` |
| Carousel speed | `js/main.js` → `setInterval` values (6000ms hero, 5000ms testimonials) |
| Content text | Edit directly in each `.html` file |
