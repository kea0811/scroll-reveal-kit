import { describe, it, expect } from 'vitest';
import { VARIANT_STYLES, getVariantStyles } from './variants';
import type { RevealVariant } from './types';

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

describe('variants', () => {
  it('exports a definition for every public variant', () => {
    for (const v of ALL_VARIANTS) {
      expect(VARIANT_STYLES[v]).toBeDefined();
      expect(VARIANT_STYLES[v].from).toBeDefined();
      expect(VARIANT_STYLES[v].to).toBeDefined();
    }
  });

  it('returns "from" styles when not visible', () => {
    for (const v of ALL_VARIANTS) {
      const result = getVariantStyles(v, false, 500, 'ease', 0);
      expect(result).toMatchObject(VARIANT_STYLES[v].from);
      expect(result.transition).toContain('500ms');
      expect(result.willChange).toBe('opacity, transform');
    }
  });

  it('returns "to" styles when visible', () => {
    for (const v of ALL_VARIANTS) {
      const result = getVariantStyles(v, true, 800, 'linear', 100);
      expect(result).toMatchObject(VARIANT_STYLES[v].to);
      expect(result.transition).toContain('800ms');
      expect(result.transition).toContain('100ms');
      expect(result.transition).toContain('linear');
    }
  });
});
