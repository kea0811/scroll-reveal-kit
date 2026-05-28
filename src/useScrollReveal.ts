import { useCallback, useEffect, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';
import type { ScrollRevealOptions, ScrollRevealResult } from './types';

const hasIntersectionObserver = (): boolean =>
  typeof window !== 'undefined' && typeof window.IntersectionObserver === 'function';

/**
 * `useScrollReveal` — attach the returned `ref` to any element to track whether
 * it has scrolled into view. `isVisible` flips to `true` once the element's
 * intersection ratio crosses the configured `threshold`.
 *
 * Works under React 18 + 19 StrictMode: the IntersectionObserver lifecycle is
 * fully contained inside a `useEffect`, so the simulated unmount/remount cycle
 * does not leave a dangling observer.
 */
export function useScrollReveal<T extends Element = HTMLElement>(
  options: ScrollRevealOptions = {},
): ScrollRevealResult<T> {
  const {
    threshold = 0.15,
    rootMargin = '0px',
    root = null,
    once = true,
    delay = 0,
    disabled,
  } = options;

  const prefersReducedMotion = usePrefersReducedMotion();
  const effectivelyDisabled = disabled ?? prefersReducedMotion;

  const [node, setNode] = useState<T | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const ref = useCallback((next: T | null) => {
    setNode(next);
  }, []);

  useEffect(() => {
    if (effectivelyDisabled) {
      setIsVisible(true);
      return;
    }

    if (!node) return;

    if (!hasIntersectionObserver()) {
      // Environments without IO (older browsers, very old SSR rehydration):
      // reveal immediately so content is never invisible.
      setIsVisible(true);
      return;
    }

    let timer: ReturnType<typeof setTimeout> | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          if (delay > 0) {
            timer = setTimeout(() => setIsVisible(true), delay);
          } else {
            setIsVisible(true);
          }
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          if (timer !== undefined) {
            clearTimeout(timer);
            timer = undefined;
          }
          setIsVisible(false);
        }
      },
      { threshold, rootMargin, root: root as Element | Document | null },
    );

    observer.observe(node);

    return () => {
      if (timer !== undefined) clearTimeout(timer);
      observer.disconnect();
    };
  }, [node, threshold, rootMargin, root, once, delay, effectivelyDisabled]);

  return { ref, isVisible };
}
