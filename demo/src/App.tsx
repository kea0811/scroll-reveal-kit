import { useState } from 'react';
import { Reveal, type RevealVariant } from 'scroll-reveal-kit';

const ALL_VARIANTS: RevealVariant[] = [
  'fade',
  'fade-up',
  'fade-down',
  'fade-left',
  'fade-right',
  'zoom-in',
  'zoom-out',
  'flip-up',
  'flip-down',
  'slide-up',
  'rotate',
];

function CodeBlock({ children }: { children: string }) {
  return <pre>{children}</pre>;
}

export function App() {
  const [forceReduced, setForceReduced] = useState(false);

  return (
    <>
      <header className="hero">
        <span className="hero-eyebrow">scroll-reveal-kit · v0.1.0</span>
        <h1>Drop-in scroll reveals for React.</h1>
        <p>
          One hook. One component. Eleven presets. Zero dependencies. Respects{' '}
          <code>prefers-reduced-motion</code> out of the box.
        </p>
        <div className="install-pill">
          <span className="prompt">$</span>
          <span>pnpm add scroll-reveal-kit</span>
        </div>
        <div className="hero-cta">
          <a
            className="btn btn-primary"
            href="https://github.com/kea0811/scroll-reveal-kit"
            target="_blank"
            rel="noreferrer"
          >
            ★ GitHub
          </a>
          <a className="btn btn-secondary" href="#variants">
            See every variant ↓
          </a>
        </div>
      </header>

      <section id="variants">
        <div className="container">
          <div className="section-head">
            <h2>Every variant, all at once.</h2>
            <p>
              Scroll. Each tile animates the first time it crosses into view. Same{' '}
              <code>&lt;Reveal&gt;</code> component, different <code>variant</code> prop.
            </p>
          </div>
          <div className="variant-grid">
            {ALL_VARIANTS.map((v) => (
              <Reveal key={v} variant={v} className="tile">
                <span className="variant-name">{`<Reveal variant="${v}" />`}</span>
                <span className="variant-label">{v}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="section-head">
            <h2>Stagger via delay.</h2>
            <p>
              Pass an incremental <code>delay</code> to chain reveals into a satisfying cascade.
            </p>
          </div>
          <div className="stagger-row">
            {['One', 'Two', 'Three', 'Four', 'Five'].map((label, i) => (
              <Reveal
                key={label}
                variant="fade-up"
                delay={i * 120}
                className="stagger-card"
              >
                {label}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="section-head">
            <h2>Tune the timing.</h2>
            <p>
              <code>duration</code> and <code>easing</code> are just CSS — pass any values you'd
              put in a transition.
            </p>
          </div>
          <div className="duration-row">
            <Reveal variant="zoom-in" duration={300} className="duration-card">
              <div className="num">300ms</div>
              <div className="lbl">snappy</div>
            </Reveal>
            <Reveal variant="zoom-in" duration={600} className="duration-card">
              <div className="num">600ms</div>
              <div className="lbl">default</div>
            </Reveal>
            <Reveal variant="zoom-in" duration={1200} className="duration-card">
              <div className="num">1200ms</div>
              <div className="lbl">cinematic</div>
            </Reveal>
            <Reveal
              variant="zoom-in"
              duration={1800}
              easing="cubic-bezier(0.65, 0, 0.35, 1)"
              className="duration-card"
            >
              <div className="num">1800ms</div>
              <div className="lbl">custom easing</div>
            </Reveal>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="section-head">
            <h2>Respects reduced motion.</h2>
            <p>
              Users who opt out of motion see content instantly — never invisible, never animated.
            </p>
          </div>
          <div className="toggle-row">
            <button
              onClick={() => setForceReduced(false)}
              aria-pressed={!forceReduced}
            >
              animate
            </button>
            <button
              onClick={() => setForceReduced(true)}
              aria-pressed={forceReduced}
            >
              disabled (instant)
            </button>
          </div>
          <div className="stagger-row">
            {['accessible', 'by default', 'no flash', 'no fuss'].map((t, i) => (
              <Reveal
                key={t + String(forceReduced)}
                variant="fade-up"
                delay={i * 100}
                disabled={forceReduced}
                className="stagger-card"
              >
                {t}
              </Reveal>
            ))}
          </div>
          <div style={{ marginTop: 28 }}>
            <p className="reduced-note">
              <strong>Pro tip:</strong> the hook also auto-disables when the OS reports{' '}
              <code>prefers-reduced-motion: reduce</code>. Toggle the setting in your OS to
              see it without changing code.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="section-head">
            <h2>The 5-second integration.</h2>
            <p>Two import paths — the component for 90% of cases, the hook for the other 10%.</p>
          </div>
          <div className="code-grid">
            <Reveal variant="fade-up">
              <CodeBlock>{`// The component
import { Reveal } from 'scroll-reveal-kit';

<Reveal variant="fade-up">
  <h2>Hello, scroll.</h2>
</Reveal>`}</CodeBlock>
            </Reveal>
            <Reveal variant="fade-up" delay={120}>
              <CodeBlock>{`// The hook
import { useScrollReveal } from 'scroll-reveal-kit';

const { ref, isVisible } = useScrollReveal();

<div ref={ref} className={isVisible ? 'in' : ''}>
  ...
</div>`}</CodeBlock>
            </Reveal>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>
          MIT licensed · built by{' '}
          <a href="https://github.com/kea0811" target="_blank" rel="noreferrer">
            kea0811
          </a>
        </p>
      </footer>
    </>
  );
}
