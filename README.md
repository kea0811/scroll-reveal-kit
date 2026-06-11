# scroll-reveal-kit

![tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)
![coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)
![license](https://img.shields.io/badge/license-MIT-blue.svg)

**🌐 [Live demo →](https://scroll-reveal-kit.vercel.app)**

> Drop-in IntersectionObserver reveal animations for React. One hook, one component, eleven presets, zero dependencies.

Most "animate on scroll" libraries come with their own animation engine, a config file, and a small philosophy about how you should organize your CSS. This isn't that.

It's the boring 90% of "fade something in when it scrolls into view" — with sensible defaults, full TypeScript types, a respectful default for `prefers-reduced-motion`, and just enough escape hatches to keep you out of trouble.

## For AI coding agents

Drop [`SKILL.md`](./SKILL.md) into your AI editor / Claude Code workspace and it learns how to use this library. Tells the agent when to reach for it, the install + canonical pattern, the public API, and the gotchas that are easy to miss.

## Install

**From GitHub** (always works):

```bash
pnpm add github:kea0811/scroll-reveal-kit
```

**From npm** _(when published to npm)_:

```bash
pnpm add scroll-reveal-kit
```

> Using npm or yarn? `npm install scroll-reveal-kit` / `yarn add scroll-reveal-kit` work too.

Requires React 18+.

## Quick example

```tsx
import { Reveal } from 'scroll-reveal-kit';

export function Pricing() {
  return (
    <section>
      <Reveal variant="fade-up">
        <h2>Simple, honest pricing</h2>
      </Reveal>
      <Reveal variant="fade-up" delay={120}>
        <p>Pay for what you use. Cancel any time.</p>
      </Reveal>
    </section>
  );
}
```

Need finer-grained control? Use the hook:

```tsx
import { useScrollReveal } from 'scroll-reveal-kit';

function Card() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.4 });
  return (
    <div ref={ref} className={isVisible ? 'card card--in' : 'card'}>
      ...
    </div>
  );
}
```

## API

### `<Reveal>` component

```tsx
<Reveal
  variant="fade-up"          // animation preset (see list below)
  duration={600}             // ms
  easing="cubic-bezier(...)" // any CSS timing function
  delay={0}                  // ms — useful for staggered groups
  threshold={0.15}           // 0–1 — visibility ratio
  rootMargin="0px"           // IntersectionObserver rootMargin
  once={true}                // reveal once, or toggle on enter/leave
  disabled={false}           // force-skip animation (still renders content)
  as="div"                   // any tag or React component
  className="..."
  style={{}}
>
  {children}
</Reveal>
```

### `useScrollReveal(options)` hook

Returns `{ ref, isVisible }`. Pass any of the same options as the component (minus the visual ones — `variant`, `duration`, `easing`, `as`).

### Variants

`fade` · `fade-up` · `fade-down` · `fade-left` · `fade-right` · `zoom-in` · `zoom-out` · `flip-up` · `flip-down` · `slide-up` · `rotate`

Open the [live demo](https://scroll-reveal-kit.vercel.app) to see them all at once.

## Accessibility

If a user has set `prefers-reduced-motion: reduce` at the OS level, `useScrollReveal` auto-flips to "already visible" — no opacity transition, no transform. You don't need to do anything; this is the default. Pass `disabled={false}` explicitly to override.

## How it works (in a sentence)

A single `IntersectionObserver` per element, tracked via `useState` so the lifecycle is fully contained inside one `useEffect` — which makes it safe under React 18 + 19 StrictMode's simulated unmount/remount cycle. Visual state is plain CSS transitions, so there's no animation engine to fight your design system.

## Contributing

PRs welcome — especially new variants and reduced-motion edge cases. Run:

```bash
pnpm install
pnpm test
pnpm build
```

The demo lives in `/demo`. `pnpm demo:dev` runs it locally.

## License

MIT © [kea0811](https://github.com/kea0811)
