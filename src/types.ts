export type RevealVariant =
  | 'fade'
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'zoom-in'
  | 'zoom-out'
  | 'flip-up'
  | 'flip-down'
  | 'slide-up'
  | 'rotate';

export interface ScrollRevealOptions {
  /**
   * Visibility threshold (0–1) at which the element is considered "revealed".
   * Default: 0.15
   */
  threshold?: number;
  /**
   * Root margin passed to IntersectionObserver (e.g. `'0px 0px -10% 0px'`).
   * Default: `'0px'`
   */
  rootMargin?: string;
  /**
   * Optional scroll container. Defaults to the viewport.
   */
  root?: Element | Document | null;
  /**
   * If true (default), the element reveals once and stays revealed.
   * If false, it toggles back to hidden when it leaves the viewport.
   */
  once?: boolean;
  /**
   * Delay before showing, in milliseconds. Useful for staggered groups.
   * Default: 0
   */
  delay?: number;
  /**
   * If true, the hook returns `isVisible: true` immediately and skips
   * observation. Default: respects `prefers-reduced-motion`.
   */
  disabled?: boolean;
}

export interface ScrollRevealResult<T extends Element = HTMLElement> {
  ref: (node: T | null) => void;
  isVisible: boolean;
}
