import { createElement, type CSSProperties, type ElementType, type ReactElement, type ReactNode } from 'react';
import { useScrollReveal } from './useScrollReveal';
import { getVariantStyles } from './variants';
import type { RevealVariant, ScrollRevealOptions } from './types';

export interface RevealProps extends ScrollRevealOptions {
  /**
   * Animation preset to play when the element enters the viewport.
   * Default: `'fade-up'`
   */
  variant?: RevealVariant;
  /**
   * Animation duration in milliseconds. Default: 600.
   */
  duration?: number;
  /**
   * CSS transition timing function. Default: `'cubic-bezier(0.22, 1, 0.36, 1)'`.
   */
  easing?: string;
  /**
   * Element tag to render. Default: `'div'`.
   */
  as?: ElementType;
  /** Optional className applied to the wrapper. */
  className?: string;
  /** Optional inline styles merged ON TOP of the animation styles. */
  style?: CSSProperties;
  /** Children to reveal. */
  children?: ReactNode;
}

/**
 * `<Reveal>` — drop-in wrapper that animates its children into view on scroll.
 *
 * Pass `variant` to switch presets, `duration` / `easing` to tune timing, and
 * any of the underlying `useScrollReveal` options (`threshold`, `rootMargin`,
 * `once`, `delay`, `disabled`) to control the trigger behavior.
 */
export function Reveal({
  variant = 'fade-up',
  duration = 600,
  easing = 'cubic-bezier(0.22, 1, 0.36, 1)',
  delay = 0,
  threshold,
  rootMargin,
  root,
  once,
  disabled,
  as,
  className,
  style,
  children,
}: RevealProps): ReactElement {
  const Component: ElementType = as ?? 'div';
  const { ref, isVisible } = useScrollReveal<HTMLElement>({
    threshold,
    rootMargin,
    root,
    once,
    delay,
    disabled,
  });

  const animationStyles = getVariantStyles(variant, isVisible, duration, easing, 0);

  return createElement(
    Component,
    {
      ref,
      className,
      style: { ...animationStyles, ...style },
      'data-reveal-variant': variant,
      'data-reveal-visible': isVisible ? 'true' : 'false',
    },
    children,
  );
}
