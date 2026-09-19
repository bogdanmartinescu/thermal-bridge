export const PREVIEW_RULER_SIZE_PX = 28;
export const PREVIEW_GRID_STEP_MM = 5;

export function previewRulerChromePx(): number {
  return PREVIEW_RULER_SIZE_PX;
}

export interface PreviewGridLine {
  mm: number;
  posPx: number;
  major: boolean;
}

export interface PreviewRulerTick {
  mm: number;
  /** 0–1 along the measured axis */
  pos: number;
  major: boolean;
}

export function previewRulerStepMm(lengthMm: number): number {
  if (lengthMm <= 40) {
    return 5;
  }
  if (lengthMm <= 80) {
    return 10;
  }
  return 20;
}

export function previewRulerTicks(lengthMm: number): PreviewRulerTick[] {
  if (!(lengthMm > 0)) {
    return [];
  }
  const step = previewRulerStepMm(lengthMm);
  const ticks: PreviewRulerTick[] = [];
  for (let mm = 0; mm <= lengthMm + 1e-6; mm += step) {
    const clamped = Math.min(mm, lengthMm);
    ticks.push({
      mm: Math.round(clamped),
      pos: clamped / lengthMm,
      major: clamped === 0 || clamped === lengthMm || clamped % (step * 2) === 0,
    });
  }
  if (ticks[ticks.length - 1]?.mm !== Math.round(lengthMm)) {
    ticks.push({ mm: Math.round(lengthMm), pos: 1, major: true });
  }
  return ticks;
}

export function previewRulerOffsetPx(pos: number, lengthPx: number): number {
  return pos * lengthPx;
}

export function previewOverlayTickPx(pos: number, origin: number, lengthPx: number): number {
  return origin + pos * lengthPx;
}

export function previewGridLines(lengthMm: number, stagePx: number): PreviewGridLine[] {
  if (!(lengthMm > 0) || !(stagePx > 0)) {
    return [];
  }
  const majorEvery = previewRulerStepMm(lengthMm);
  const lines: PreviewGridLine[] = [];
  for (let mm = PREVIEW_GRID_STEP_MM; mm < lengthMm - 1e-6; mm += PREVIEW_GRID_STEP_MM) {
    lines.push({
      mm,
      posPx: (mm / lengthMm) * stagePx,
      major: mm % majorEvery === 0,
    });
  }
  return lines;
}
