import type { CSSProperties } from 'react';
import type { RevealVariant } from './types';

interface VariantStyles {
  from: CSSProperties;
  to: CSSProperties;
}

const SLIDE_DISTANCE = '32px';

export const VARIANT_STYLES: Record<RevealVariant, VariantStyles> = {
  fade: {
    from: { opacity: 0, transform: 'none' },
    to: { opacity: 1, transform: 'none' },
  },
  'fade-up': {
    from: { opacity: 0, transform: `translate3d(0, ${SLIDE_DISTANCE}, 0)` },
    to: { opacity: 1, transform: 'translate3d(0, 0, 0)' },
  },
  'fade-down': {
    from: { opacity: 0, transform: `translate3d(0, -${SLIDE_DISTANCE}, 0)` },
    to: { opacity: 1, transform: 'translate3d(0, 0, 0)' },
  },
  'fade-left': {
    from: { opacity: 0, transform: `translate3d(${SLIDE_DISTANCE}, 0, 0)` },
    to: { opacity: 1, transform: 'translate3d(0, 0, 0)' },
  },
  'fade-right': {
    from: { opacity: 0, transform: `translate3d(-${SLIDE_DISTANCE}, 0, 0)` },
    to: { opacity: 1, transform: 'translate3d(0, 0, 0)' },
  },
  'zoom-in': {
    from: { opacity: 0, transform: 'scale(0.85)' },
    to: { opacity: 1, transform: 'scale(1)' },
  },
  'zoom-out': {
    from: { opacity: 0, transform: 'scale(1.15)' },
    to: { opacity: 1, transform: 'scale(1)' },
  },
  'flip-up': {
    from: { opacity: 0, transform: 'perspective(800px) rotateX(40deg)' },
    to: { opacity: 1, transform: 'perspective(800px) rotateX(0deg)' },
  },
  'flip-down': {
    from: { opacity: 0, transform: 'perspective(800px) rotateX(-40deg)' },
    to: { opacity: 1, transform: 'perspective(800px) rotateX(0deg)' },
  },
  'slide-up': {
    from: { opacity: 1, transform: `translate3d(0, ${SLIDE_DISTANCE}, 0)` },
    to: { opacity: 1, transform: 'translate3d(0, 0, 0)' },
  },
  rotate: {
    from: { opacity: 0, transform: 'rotate(-8deg) scale(0.95)' },
    to: { opacity: 1, transform: 'rotate(0deg) scale(1)' },
  },
};

export function getVariantStyles(
  variant: RevealVariant,
  isVisible: boolean,
  duration: number,
  easing: string,
  delay: number,
): CSSProperties {
  const styles = VARIANT_STYLES[variant];
  const state = isVisible ? styles.to : styles.from;
  return {
    ...state,
    transition: `transform ${duration}ms ${easing} ${delay}ms, opacity ${duration}ms ${easing} ${delay}ms`,
    willChange: 'opacity, transform',
  };
}
