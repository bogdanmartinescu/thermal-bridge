import { PREVIEW_RULER_SIZE_PX, previewOverlayTickPx, previewRulerTicks } from './preview-rulers.js';
import { cn } from '@/lib/utils.js';

interface PreviewRulersProps {
  widthMm: number;
  heightMm: number;
  pageWidth: number;
  pageHeight: number;
  originX: number;
  originY: number;
}

export function PreviewRulers(props: PreviewRulersProps) {
  const hTicks = previewRulerTicks(props.widthMm);
  const vTicks = previewRulerTicks(props.heightMm);
  const size = PREVIEW_RULER_SIZE_PX;

  return (
    <div className="pointer-events-none absolute inset-0 z-10" aria-hidden>
      <div
        className="absolute left-0 top-0 border-b border-r border-[color:var(--border-soft)] bg-[var(--surface-0)]"
        style={{ width: size, height: size }}
      />
      <div
        className="absolute top-0 overflow-hidden border-b border-[color:var(--border-soft)] bg-[var(--surface-0)]"
        style={{ left: size, right: 0, height: size }}
      >
        {hTicks.map((tick) => (
          <span
            key={`h-${tick.mm}`}
            className="absolute top-0 flex h-full flex-col items-center"
            style={{
              left: previewOverlayTickPx(tick.pos, props.originX, props.pageWidth),
              transform: 'translateX(-50%)',
            }}
          >
            <span
              className={cn(
                'w-px',
                tick.major ? 'h-2.5 bg-[#718096]' : 'h-1.5 bg-[rgba(113,128,150,0.48)]',
              )}
            />
            {tick.major ? (
              <span className="mt-px font-mono text-[10px] leading-none text-[#8b99ac]">
                {tick.mm}
              </span>
            ) : null}
          </span>
        ))}
      </div>
      <div
        className="absolute left-0 overflow-hidden border-r border-[color:var(--border-soft)] bg-[var(--surface-0)]"
        style={{ top: size, bottom: 0, width: size }}
      >
        {vTicks.map((tick) => (
          <span
            key={`v-${tick.mm}`}
            className="absolute left-0 flex w-full items-center"
            style={{
              top: previewOverlayTickPx(tick.pos, props.originY, props.pageHeight),
              transform: 'translateY(-50%)',
            }}
          >
            <span
              className={cn(
                'h-px shrink-0',
                tick.major ? 'w-2.5 bg-[#718096]' : 'w-1.5 bg-[rgba(113,128,150,0.48)]',
              )}
            />
            {tick.major ? (
              <span className="ml-px max-w-[18px] truncate font-mono text-[10px] leading-none text-[#8b99ac]">
                {tick.mm}
              </span>
            ) : null}
          </span>
        ))}
      </div>
    </div>
  );
}
