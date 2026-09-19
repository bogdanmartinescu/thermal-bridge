import { useEffect, useRef } from 'react';
import { useI18n } from '@/i18n/I18nProvider.js';
import { cn } from '@/lib/utils.js';
import type { SourceFilmstripItem } from './source-filmstrip.js';

interface SourceFilmstripProps {
  items: readonly SourceFilmstripItem[];
  selectedPageId: string;
  onSelectPage: (pageId: string) => void;
}

export function SourceFilmstrip(props: SourceFilmstripProps) {
  const { t } = useI18n();
  const header = props.items[0];
  const selectedRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [props.selectedPageId]);

  if (header === undefined) {
    return null;
  }

  return (
    <div className="pointer-events-auto flex h-full w-40 flex-col overflow-hidden rounded-xl border border-[color:var(--border-soft)] bg-[var(--surface-0)] shadow-dock">
      <div className="shrink-0 border-b border-[color:var(--border-soft)] px-3 py-2.5">
        <p
          className="truncate text-[12px] font-semibold leading-4 text-[color:var(--text-primary)]"
          title={header.name}
        >
          {header.name}
        </p>
        <p className="mt-1 text-[11px] leading-4 text-[color:var(--text-secondary)]">
          {t('sourcePreviewPages', { n: header.pageCount })}
        </p>
      </div>
      <div
        className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2.5"
        role="listbox"
        aria-label={t('sourcePreviewTitle')}
      >
        {props.items.map((item) => {
          const selected = item.pageId === props.selectedPageId;
          return (
            <button
              key={item.pageId}
              ref={selected ? selectedRef : undefined}
              type="button"
              role="option"
              aria-selected={selected}
              title={t('sourcePreviewPage', { n: item.pageNumber })}
              className={cn(
                'relative aspect-[2/3] w-full shrink-0 overflow-hidden rounded-[6px] bg-[var(--surface-2)] transition-all hover-fade',
                selected
                  ? 'outline outline-2 outline-primary'
                  : 'outline outline-1 outline-[color:var(--border-soft)] hover:outline-[color:var(--border-strong)]',
              )}
              onClick={() => props.onSelectPage(item.pageId)}
            >
              <img
                src={item.previewUrl}
                alt={t('sourcePreviewPage', { n: item.pageNumber })}
                className="size-full bg-white object-contain"
              />
              <span className="absolute bottom-1.5 left-1.5 rounded-md bg-[var(--surface-0)] px-1.5 py-0.5 text-[11px] font-medium leading-none text-[color:var(--text-secondary)] shadow-sm">
                {item.pageNumber}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
