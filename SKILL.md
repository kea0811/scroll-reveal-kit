---
name: scroll-reveal-kit
description: Use when adding scroll-triggered reveal animations to a React app — drop-in `<Reveal>` component with eleven motion variants, accessibility-aware (prefers-reduced-motion), StrictMode-safe. React 18 and 19.
---

# scroll-reveal-kit

A small React library for "animate when scrolled into view" without pulling in a full animation engine.

## When to reach for this

User says things like:
- "fade up on scroll"
- "animate elements as they come into view"
- "intersection observer reveal"
- "accessibility-aware scroll animations"

User does NOT mean this when they say:
- ❌ Scroll-linked animations where progress maps to scroll position (use a scroll-linked lib instead).
- ❌ Full-page parallax or stacking effects.
- ❌ Triggered by hover, click, or anything other than viewport intersection.

## Install

```bash
pnpm add scroll-reveal-kit
```

Peer deps: `react@^18 || ^19`, `react-dom@^18 || ^19`. Zero runtime deps.

## Most common pattern (95% of cases)

```tsx
import { Reveal } from 'scroll-reveal-kit';

<Reveal variant="fade-up">
  <h1>Animates when scrolled into view</h1>
</Reveal>
```

That's the whole API for most uses.

## Variants

`fade-up` (default), `fade-down`, `fade-left`, `fade-right`, `scale`, `slide-up`, `slide-down`, `blur`, `zoom`, `flip-up`, `flip-down` — 11 total.

## Per-instance controls

```tsx
<Reveal variant="scale" delay={150} duration={600} once={false} threshold={0.3}>
  <Card />
</Reveal>
```

- `delay` (ms) — stagger reveals when mapping a list.
- `duration` (ms) — animation length.
- `once` (default `true`) — set `false` to re-animate when scrolled out + back in.
- `threshold` (0–1) — how much of the element must be visible to trigger.

## Hook form (for custom markup)

```tsx
import { useScrollReveal } from 'scroll-reveal-kit';

function MyCard() {
  const { ref, isVisible } = useScrollReveal({ variant: 'fade-up' });
  return <article ref={ref} data-visible={isVisible}>…</article>;
}
```

## Gotchas worth knowing

1. **Wrap the leafest element you can.** `<Reveal>` renders a `<div>` by default; if the wrapping div breaks your layout, pass `as="section"` (or any tag) to change the element.
2. **`prefers-reduced-motion` is respected by default** — it falls back to an instant fade-in. Don't override.
3. **React 19 StrictMode is safe** — the observer lifecycle lives inside a single `useEffect`. If you see a "broken observer after StrictMode remount" bug, the issue is in user code that puts observer setup in a ref-callback.
4. **One shared IntersectionObserver per page.** Adding 100 `<Reveal>` doesn't add 100 observers.

## API

| Export | What |
|---|---|
| `<Reveal variant delay? duration? once? threshold? as?>` | main component |
| `useScrollReveal(opts)` | low-level hook returning `{ ref, isVisible }` |
| `usePrefersReducedMotion()` | utility hook |
| `variants` | array of all 11 variant strings |

## Links

- npm: https://www.npmjs.com/package/scroll-reveal-kit
- demo: https://scroll-reveal-kit.vercel.app
- repo: https://github.com/kea0811/scroll-reveal-kit
