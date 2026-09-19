import { describe, expect, it } from 'vitest';
import {
  PREVIEW_RULER_SIZE_PX,
  previewGridLines,
  previewOverlayTickPx,
  previewRulerChromePx,
  previewRulerOffsetPx,
  previewRulerStepMm,
  previewRulerTicks,
} from './preview-rulers.js';

describe('previewRulerChromePx', () => {
  it('reserves only the well-side ruler track', () => {
    expect(previewRulerChromePx()).toBe(PREVIEW_RULER_SIZE_PX);
  });
});

describe('previewRulerStepMm', () => {
  it('uses 20 mm steps on AWB 100 × 150 labels', () => {
    expect(previewRulerStepMm(100)).toBe(20);
    expect(previewRulerStepMm(150)).toBe(20);
  });

  it('uses finer steps on small labels', () => {
    expect(previewRulerStepMm(40)).toBe(5);
    expect(previewRulerStepMm(60)).toBe(10);
  });
});

describe('previewRulerTicks', () => {
  it('includes 0 and the label length', () => {
    const ticks = previewRulerTicks(100);
    expect(ticks[0]).toMatchObject({ mm: 0, pos: 0, major: true });
    expect(ticks[ticks.length - 1]).toMatchObject({ mm: 100, pos: 1, major: true });
  });

  it('places a tick every 20 mm on a 100 mm axis', () => {
    expect(previewRulerTicks(100).map((tick) => tick.mm)).toEqual([0, 20, 40, 60, 80, 100]);
  });

  it('returns nothing for a non-positive length', () => {
    expect(previewRulerTicks(0)).toEqual([]);
  });
});

describe('previewRulerOffsetPx', () => {
  it('maps 0–1 onto the page edge so ticks share the canvas origin', () => {
    expect(previewRulerOffsetPx(0, 400)).toBe(0);
    expect(previewRulerOffsetPx(1, 400)).toBe(400);
    expect(previewRulerOffsetPx(0.4, 400)).toBe(160);
  });
});

describe('previewOverlayTickPx', () => {
  it('places ticks from the page origin inside the well', () => {
    expect(previewOverlayTickPx(0, 80, 400)).toBe(80);
    expect(previewOverlayTickPx(0.5, 80, 400)).toBe(280);
    expect(previewOverlayTickPx(1, 80, 400)).toBe(480);
  });
});

describe('previewGridLines', () => {
  it('places a 5 mm line on the same pixels as a 20 mm ruler tick', () => {
    const lines = previewGridLines(100, 400);
    expect(lines.find((line) => line.mm === 20)).toMatchObject({ posPx: 80, major: true });
    expect(lines.find((line) => line.mm === 5)).toMatchObject({ posPx: 20, major: false });
  });

  it('returns nothing until the stage has a size', () => {
    expect(previewGridLines(100, 0)).toEqual([]);
  });
});
