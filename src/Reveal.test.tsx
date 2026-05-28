import { describe, it, expect, beforeEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { Reveal } from './Reveal';

type IOCallback = (entries: IntersectionObserverEntry[]) => void;

const records: Array<{ cb: IOCallback; trigger: (v: boolean) => void }> = [];

beforeEach(() => {
  records.length = 0;
  class FakeIO {
    cb: IOCallback;
    targets: Element[] = [];
    constructor(cb: IOCallback) {
      this.cb = cb;
      records.push({
        cb,
        trigger: (v: boolean) => {
          const target = this.targets[0];
          this.cb([
            {
              isIntersecting: v,
              target,
              intersectionRatio: v ? 1 : 0,
            } as IntersectionObserverEntry,
          ]);
        },
      });
    }
    observe(n: Element) {
      this.targets.push(n);
    }
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
    readonly root = null;
    readonly rootMargin = '';
    readonly thresholds = [];
  }
  (window as unknown as { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver =
    FakeIO as unknown as typeof IntersectionObserver;
});

describe('<Reveal>', () => {
  it('renders a div by default with hidden state', () => {
    render(<Reveal>hello</Reveal>);
    const node = screen.getByText('hello');
    expect(node.tagName).toBe('DIV');
    expect(node).toHaveAttribute('data-reveal-variant', 'fade-up');
    expect(node).toHaveAttribute('data-reveal-visible', 'false');
  });

  it('flips data-reveal-visible to true after intersection', () => {
    render(<Reveal>hello</Reveal>);
    act(() => records[0].trigger(true));
    expect(screen.getByText('hello')).toHaveAttribute('data-reveal-visible', 'true');
  });

  it('renders the requested element via `as`', () => {
    render(
      <Reveal as="section" variant="zoom-in">
        boom
      </Reveal>,
    );
    const node = screen.getByText('boom');
    expect(node.tagName).toBe('SECTION');
    expect(node).toHaveAttribute('data-reveal-variant', 'zoom-in');
  });

  it('merges custom className and style on top of animation styles', () => {
    render(
      <Reveal className="card" style={{ background: 'red' }}>
        ok
      </Reveal>,
    );
    const node = screen.getByText('ok');
    expect(node).toHaveClass('card');
    expect(node.getAttribute('style')).toContain('background: red');
    expect(node.getAttribute('style')).toContain('transition');
  });

  it('forwards duration and easing into the transition CSS', () => {
    render(
      <Reveal duration={1200} easing="linear">
        timing
      </Reveal>,
    );
    const style = screen.getByText('timing').getAttribute('style') ?? '';
    expect(style).toContain('1200ms');
    expect(style).toContain('linear');
  });

  it('passes useScrollReveal options through (disabled → instantly visible)', () => {
    render(<Reveal disabled>instant</Reveal>);
    expect(screen.getByText('instant')).toHaveAttribute('data-reveal-visible', 'true');
  });
});
