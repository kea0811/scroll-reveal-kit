import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { StrictMode } from 'react';
import { useScrollReveal } from './useScrollReveal';

type IOCallback = (entries: IntersectionObserverEntry[]) => void;

interface MockObserver {
  callback: IOCallback;
  init: IntersectionObserverInit | undefined;
  observed: Element[];
  unobserved: Element[];
  disconnected: boolean;
  trigger: (isIntersecting: boolean, target?: Element) => void;
}

const observers: MockObserver[] = [];

function installIntersectionObserverMock() {
  class FakeIO {
    callback: IOCallback;
    init: IntersectionObserverInit | undefined;
    observed: Element[] = [];
    unobserved: Element[] = [];
    disconnected = false;
    record: MockObserver;

    constructor(cb: IOCallback, init?: IntersectionObserverInit) {
      this.callback = cb;
      this.init = init;
      this.record = {
        callback: cb,
        init,
        observed: this.observed,
        unobserved: this.unobserved,
        disconnected: false,
        trigger: (isIntersecting: boolean, target?: Element) => {
          const t = target ?? this.observed[0];
          this.callback([
            {
              isIntersecting,
              target: t,
              intersectionRatio: isIntersecting ? 1 : 0,
              boundingClientRect: {} as DOMRectReadOnly,
              intersectionRect: {} as DOMRectReadOnly,
              rootBounds: null,
              time: 0,
            } as IntersectionObserverEntry,
          ]);
        },
      };
      observers.push(this.record);
    }
    observe(node: Element) {
      this.observed.push(node);
    }
    unobserve(node: Element) {
      this.unobserved.push(node);
    }
    disconnect() {
      this.disconnected = true;
      this.record.disconnected = true;
    }
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
    readonly root = null;
    readonly rootMargin = '';
    readonly thresholds = [];
  }
  (window as unknown as { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver =
    FakeIO as unknown as typeof IntersectionObserver;
}

function Probe(props: Parameters<typeof useScrollReveal>[0] = {}) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>(props);
  return (
    <div data-testid="target" ref={ref}>
      {isVisible ? 'visible' : 'hidden'}
    </div>
  );
}

describe('useScrollReveal', () => {
  beforeEach(() => {
    observers.length = 0;
    installIntersectionObserverMock();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts hidden and reveals when the element intersects', () => {
    render(<Probe />);
    expect(screen.getByTestId('target')).toHaveTextContent('hidden');
    expect(observers).toHaveLength(1);

    act(() => observers[0].trigger(true));

    expect(screen.getByTestId('target')).toHaveTextContent('visible');
  });

  it('passes threshold, rootMargin, and root to IntersectionObserver', () => {
    const customRoot = document.createElement('div');
    render(<Probe threshold={0.5} rootMargin="20px" root={customRoot} />);
    expect(observers[0].init).toMatchObject({ threshold: 0.5, rootMargin: '20px', root: customRoot });
  });

  it('unobserves after first reveal when `once` is true (default)', () => {
    render(<Probe />);
    act(() => observers[0].trigger(true));
    expect(observers[0].unobserved).toHaveLength(1);
  });

  it('keeps observing and toggles when `once: false`', () => {
    render(<Probe once={false} />);
    act(() => observers[0].trigger(true));
    expect(screen.getByTestId('target')).toHaveTextContent('visible');
    act(() => observers[0].trigger(false));
    expect(screen.getByTestId('target')).toHaveTextContent('hidden');
    expect(observers[0].unobserved).toHaveLength(0);
  });

  it('honors `delay` before flipping to visible', () => {
    render(<Probe delay={300} />);
    act(() => observers[0].trigger(true));
    expect(screen.getByTestId('target')).toHaveTextContent('hidden');
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByTestId('target')).toHaveTextContent('visible');
  });

  it('clears a pending delay timer if the element leaves before it fires', () => {
    render(<Probe delay={500} once={false} />);
    act(() => observers[0].trigger(true));
    act(() => observers[0].trigger(false));
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.getByTestId('target')).toHaveTextContent('hidden');
  });

  it('reveals immediately when `disabled` is true', () => {
    render(<Probe disabled />);
    expect(screen.getByTestId('target')).toHaveTextContent('visible');
  });

  it('reveals immediately when IntersectionObserver is unavailable', () => {
    const original = window.IntersectionObserver;
    (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = undefined;
    try {
      render(<Probe />);
      expect(screen.getByTestId('target')).toHaveTextContent('visible');
    } finally {
      window.IntersectionObserver = original;
    }
  });

  it('disconnects the observer on unmount', () => {
    const { unmount } = render(<Probe />);
    expect(observers).toHaveLength(1);
    unmount();
    expect(observers[0].disconnected).toBe(true);
  });

  it('survives React StrictMode (re-creates observer after simulated unmount)', () => {
    render(
      <StrictMode>
        <Probe />
      </StrictMode>,
    );
    // StrictMode in dev would mount/unmount/remount — under jsdom we just want
    // to confirm there is at least one live observer attached after the dust
    // settles, and that triggering it flips the state.
    const live = observers.filter((o) => !o.disconnected);
    expect(live.length).toBeGreaterThanOrEqual(1);
    act(() => live[live.length - 1].trigger(true));
    expect(screen.getByTestId('target')).toHaveTextContent('visible');
  });

  it('ignores empty entries arrays from a misbehaving observer', () => {
    render(<Probe />);
    act(() => {
      observers[0].callback([]);
    });
    expect(screen.getByTestId('target')).toHaveTextContent('hidden');
  });

  it('does nothing when ref is never attached', () => {
    function NoAttach() {
      useScrollReveal();
      return <span>nope</span>;
    }
    render(<NoAttach />);
    expect(observers).toHaveLength(0);
  });
});
