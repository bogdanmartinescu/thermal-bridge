import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type DragEvent,
} from 'react';
import type { LabelSize } from '@thermalbridge/printer-profiles';
import type { MenuActionId } from '@thermalbridge/shared';
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button.js';
import type { PreviewCommandsHandle } from '@/features/commands/command-handlers.js';
import { EditorIconPicker } from '@/features/editor/EditorIconPicker.js';
import { EditorPageStack } from '@/features/editor/EditorPageStack.js';
import { EditorPalette } from '@/features/editor/EditorPalette.js';
import { PhotoCleanupBanner } from '@/features/preview/PhotoCleanupBanner.js';
import { SourceFilmstrip } from '@/features/preview/SourceFilmstrip.js';
import { sourceFilmstripItems, type SourceFilmstripInput } from '@/features/preview/source-filmstrip.js';
import type { LabelPage } from '@/features/editor/label-pages.js';
import type { OverlayElement } from '@/features/editor/overlay.js';
import { normalizeImportedImage } from '@/features/editor/svg-source.js';
import { useEditorShortcuts } from '@/features/editor/use-editor-shortcuts.js';
import type { LinkState } from '@/features/printers/connection-status.js';
import { useI18n } from '@/i18n/I18nProvider.js';
import { cn } from '@/lib/utils.js';
import type { SourceDocument } from '@/state/types.js';
import { contentOverflowMm, type ContentBox } from './content-placement.js';
import { previewRulerChromePx } from './preview-rulers.js';
import { PreviewRulers } from './PreviewRulers.js';
import { PreviewViewToggles } from './PreviewViewToggles.js';
import {
  PREVIEW_ZOOM_DEFAULT,
  PREVIEW_ZOOM_MAX,
  PREVIEW_ZOOM_MIN,
  clampPreviewZoom,
  nextWellSize,
  PREVIEW_PAGE_CHROME_PX,
  previewDocumentSize,
  previewLabelSize,
  previewVisibleWell,
} from './preview-zoom.js';

interface PreviewPaneProps {
  source: SourceDocument | null;
  sourceUrl: string | null;
  sourceUrls: Readonly<Record<string, string>>;
  pages: LabelPage[];
  selectedPageId: string;
  selectedId: string | null;
  widthMm: number;
  heightMm: number;
  dpi: number;
  printerName: string | null;
  linkState: LinkState;
  printDisabled: boolean;
  busy: boolean;
  onContentBox: (box: ContentBox) => void;
  onSelect: (id: string | null) => void;
  onOverlayChange: (id: string, patch: Partial<OverlayElement>) => void;
  onAddIcon: (iconId: string) => void;
  onAddImage: (src: string, naturalWidth: number, naturalHeight: number) => void;
  run: (id: MenuActionId, payload?: unknown) => void;
  showGrid: boolean;
  showRuler: boolean | undefined;
  onSelectPage: (id: string) => void;
  onAddPageAfter: (id: string) => void;
  onDuplicatePage: (id: string) => void;
  onDeletePage: (id: string) => void;
  onMovePageUp: (id: string) => void;
  onMovePageDown: (id: string) => void;
  onConnectPrinter: () => void;
  onLabelSize: (size: { widthMm: number; heightMm: number }) => void;
  onFile: (file: File) => void;
  onOpenDialog: () => void;
  onPageChange: (page: number) => void;
  showSourcePagePicker?: boolean;
  onPrint: () => void;
  onSaveTemplate: () => void;
  showCleanupBanner?: boolean;
  onRevertCleanup?: () => void;
  onDismissCleanup?: () => void;
  shortcutsEnabled: boolean;
  labelSizes?: readonly LabelSize[];
  sourcePages?: readonly SourceFilmstripInput[];
}

const ZOOM_STEP = 5;

export const PreviewPane = forwardRef<PreviewCommandsHandle, PreviewPaneProps>(function PreviewPane(
  props,
  ref,
) {
  const { t } = useI18n();
  const wellRef = useRef<HTMLDivElement>(null);
  const selectedCanvasRef = useRef<HTMLDivElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [wellSize, setWellSize] = useState({ width: 0, height: 0 });
  const [rulerOrigin, setRulerOrigin] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(PREVIEW_ZOOM_DEFAULT);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const selectedPage =
    props.pages.find((page) => page.id === props.selectedPageId) ?? props.pages[0] ?? null;
  const contentBox = selectedPage?.contentBox ?? null;
  const filmstrip = sourceFilmstripItems(props.sourcePages ?? []);
  const pickImage = (): void => {
    imageInputRef.current?.click();
  };
  useImperativeHandle(ref, () => ({
    zoomIn: () => setZoom((current) => clampPreviewZoom(current + ZOOM_STEP)),
    zoomOut: () => setZoom((current) => clampPreviewZoom(current - ZOOM_STEP)),
    zoomActual: () => setZoom(PREVIEW_ZOOM_DEFAULT),
    openPalette: () => setPaletteOpen(true),
    openIconPicker: () => setIconPickerOpen(true),
    pickImage,
  }));
  const visibleWell = previewVisibleWell(wellSize.width, wellSize.height);
  const labelSize = previewLabelSize({
    wellWidth: visibleWell.width,
    wellHeight: visibleWell.height,
    widthMm: props.widthMm,
    heightMm: props.heightMm,
    zoomPercent: zoom,
  });
  const measured = wellSize.width > 0 && wellSize.height > 0;
  const overflow = contentBox
    ? contentOverflowMm(contentBox, props.widthMm, props.heightMm)
    : { leftMm: 0, topMm: 0, rightMm: 0, bottomMm: 0 };
  const overflowPad = measured
    ? Math.max(
        ((overflow.leftMm + overflow.rightMm) / props.widthMm) * labelSize.width,
        ((overflow.topMm + overflow.bottomMm) / props.heightMm) * labelSize.height,
      ) + 16
    : 16;
  const documentSize = measured
    ? previewDocumentSize({
        wellWidth: wellSize.width,
        wellHeight: wellSize.height,
        pageWidth: labelSize.width,
        pageHeight: labelSize.height,
        pageCount: props.pages.length,
        gutter: 0,
        padding: 64 + overflowPad,
        footer: 0,
        pageChrome: PREVIEW_PAGE_CHROME_PX,
      })
    : null;
  useEffect(() => {
    const preventWindowFileOpen = (event: Event): void => {
      event.preventDefault();
    };
    window.addEventListener('dragover', preventWindowFileOpen);
    window.addEventListener('drop', preventWindowFileOpen);
    return () => {
      window.removeEventListener('dragover', preventWindowFileOpen);
      window.removeEventListener('drop', preventWindowFileOpen);
    };
  }, []);

  useEffect(() => {
    const well = wellRef.current;
    if (!well) {
      return;
    }
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }
      setWellSize((current) =>
        nextWellSize(current, entry.contentRect.width, entry.contentRect.height),
      );
    });
    observer.observe(well);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (props.showRuler !== true) {
      return;
    }
    const well = wellRef.current;
    const page = selectedCanvasRef.current;
    if (!well || !page) {
      return;
    }
    const sync = (): void => {
      const wellBox = well.getBoundingClientRect();
      const pageBox = page.getBoundingClientRect();
      setRulerOrigin((current) => {
        const next = {
          x: Math.round(pageBox.left - wellBox.left),
          y: Math.round(pageBox.top - wellBox.top),
        };
        if (current.x === next.x && current.y === next.y) {
          return current;
        }
        return next;
      });
    };
    sync();
    well.addEventListener('scroll', sync, { passive: true });
    const observer = new ResizeObserver(sync);
    observer.observe(well);
    observer.observe(page);
    return () => {
      well.removeEventListener('scroll', sync);
      observer.disconnect();
    };
  }, [
    labelSize.height,
    labelSize.width,
    measured,
    props.pages.length,
    props.selectedPageId,
    props.showRuler,
  ]);

  useEffect(() => {
    const well = wellRef.current;
    if (!well) {
      return;
    }
    const onWheel = (event: WheelEvent): void => {
      if (!event.ctrlKey && !event.metaKey) {
        return;
      }
      event.preventDefault();
      const step = event.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      setZoom((current) => clampPreviewZoom(current + step));
    };
    well.addEventListener('wheel', onWheel, { passive: false });
    return () => well.removeEventListener('wheel', onWheel);
  }, []);

  const nudgeZoom = (delta: number): void => {
    setZoom((current) => clampPreviewZoom(current + delta));
  };

  const onDrop = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      props.onFile(file);
    }
  };

  useEditorShortcuts({
    enabled: props.shortcutsEnabled,
    run: props.run,
  });

  const pageIndex = props.pages.findIndex((page) => page.id === (selectedPage?.id ?? props.selectedPageId));
  const pageNumber = pageIndex >= 0 ? pageIndex + 1 : 1;
  const canPrevPage = pageIndex > 0;
  const canNextPage = pageIndex >= 0 && pageIndex < props.pages.length - 1;

  return (
    <div className="flex h-full min-h-0 flex-col bg-[var(--canvas-bg)]">
      {props.showCleanupBanner && props.onRevertCleanup && props.onDismissCleanup ? (
        <PhotoCleanupBanner onRevert={props.onRevertCleanup} onDismiss={props.onDismissCleanup} />
      ) : null}
      <div className="flex min-h-0 flex-1 flex-col">
        <input
          ref={imageInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml,.svg"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = '';
            if (!file) {
              return;
            }
            const reader = new FileReader();
            reader.onload = () => {
              const src = typeof reader.result === 'string' ? reader.result : '';
              if (!src) {
                return;
              }
              const image = new Image();
              image.onload = () => {
                const imported = normalizeImportedImage(src, image);
                props.onAddImage(imported.src, imported.width, imported.height);
              };
              image.src = src;
            };
            reader.readAsDataURL(file);
          }}
        />
        <div className="flex h-full min-h-0 flex-1 flex-col">
            <div className="relative h-full min-h-0 flex-1">
            {props.showRuler === true && measured ? (
              <PreviewRulers
                widthMm={props.widthMm}
                heightMm={props.heightMm}
                pageWidth={labelSize.width}
                pageHeight={labelSize.height}
                originX={rulerOrigin.x}
                originY={rulerOrigin.y}
              />
            ) : null}
            <div
              ref={wellRef}
              tabIndex={0}
              className={cn(
                'absolute overflow-auto bg-[var(--canvas-bg)] outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
                dragOver && 'ring-2 ring-primary/50',
              )}
              style={
                props.showRuler === true
                  ? {
                      top: previewRulerChromePx(),
                      right: 0,
                      bottom: 0,
                      left: previewRulerChromePx(),
                    }
                  : { inset: 0 }
              }
              aria-label={t('previewTitle')}
              onDragEnter={(event) => {
                event.preventDefault();
                setDragOver(true);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = 'copy';
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
            >
              <div
                className={cn('canvas-grid flex', filmstrip.length > 0 && 'pr-48')}
                style={
                  documentSize
                    ? {
                        minWidth: documentSize.width,
                        minHeight: documentSize.height,
                        alignItems: 'safe center',
                        justifyContent: 'safe center',
                      }
                    : {
                        minHeight: '100%',
                        minWidth: '100%',
                        alignItems: 'safe center',
                        justifyContent: 'safe center',
                      }
                }
              >
                <EditorPageStack
                  pages={props.pages}
                  selectedPageId={selectedPage?.id ?? props.selectedPageId}
                  selectedId={props.selectedId}
                  sourceUrl={props.sourceUrl}
                  sourceUrls={props.sourceUrls}
                  widthMm={props.widthMm}
                  heightMm={props.heightMm}
                  pageWidth={labelSize.width}
                  pageHeight={labelSize.height}
                  measured={measured}
                  showGrid={props.showGrid}
                  selectedCanvasRef={selectedCanvasRef}
                  onSelectPage={props.onSelectPage}
                  onSelect={props.onSelect}
                  onContentBox={props.onContentBox}
                  onOverlayChange={props.onOverlayChange}
                  onAddPageAfter={props.onAddPageAfter}
                  onDuplicatePage={props.onDuplicatePage}
                  onDeletePage={props.onDeletePage}
                  onMovePageUp={props.onMovePageUp}
                  onMovePageDown={props.onMovePageDown}
                />
              </div>
            </div>
            <div
              className={cn(
                'pointer-events-none absolute z-20',
                filmstrip.length > 0 ? 'right-48' : 'right-3',
                props.showRuler === true ? 'top-11' : 'top-3',
              )}
            >
              <PreviewViewToggles
                className="pointer-events-auto"
                showRuler={props.showRuler === true}
                showGrid={props.showGrid}
                onToggleRuler={() => props.run('view.toggleRuler')}
                onToggleGrid={() => props.run('view.toggleGrid')}
              />
            </div>
            {filmstrip.length > 0 ? (
              <div
                className={cn(
                  'pointer-events-none absolute right-3 bottom-3',
                  props.showRuler === true ? 'top-11' : 'top-3',
                )}
              >
                <SourceFilmstrip
                  items={filmstrip}
                  selectedPageId={selectedPage?.id ?? props.selectedPageId}
                  onSelectPage={(pageId) => {
                    props.onSelectPage(pageId);
                    props.onSelect(null);
                  }}
                />
              </div>
            ) : null}
            <div
              className={cn(
                'pointer-events-none absolute bottom-3 z-10',
                filmstrip.length > 0 ? 'right-48' : 'right-3',
              )}
            >
              <div className="pointer-events-auto flex h-12 items-center justify-center gap-1 rounded-xl border border-border bg-[var(--surface-1)] px-1 shadow-dock">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="size-9"
                  aria-label={t('zoomOut')}
                  disabled={zoom <= PREVIEW_ZOOM_MIN}
                  onClick={() => nudgeZoom(-ZOOM_STEP)}
                >
                  <Minus className="size-4" strokeWidth={1.75} />
                </Button>
                <span className="w-[72px] text-center text-[12px] font-medium tabular-nums text-foreground">
                  {zoom}%
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="size-9"
                  aria-label={t('zoomIn')}
                  disabled={zoom >= PREVIEW_ZOOM_MAX}
                  onClick={() => nudgeZoom(ZOOM_STEP)}
                >
                  <Plus className="size-4" strokeWidth={1.75} />
                </Button>
              </div>
            </div>
            <div
              className={cn(
                'pointer-events-none absolute bottom-2 z-20 flex h-8 items-center gap-3.5 font-mono text-[11px] leading-4 text-muted-foreground',
                props.showRuler === true ? 'left-12' : 'left-4',
              )}
            >
              <span>
                {props.widthMm} × {props.heightMm} mm
              </span>
              <span className="h-3 w-px bg-border" aria-hidden />
              <span>{props.dpi} DPI</span>
              <span className="h-3 w-px bg-border" aria-hidden />
              <span className="pointer-events-auto flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label={t('editorMovePageUp')}
                  disabled={!canPrevPage}
                  onClick={() => {
                    const prev = props.pages[pageIndex - 1];
                    if (prev) {
                      props.onSelectPage(prev.id);
                      props.onSelect(null);
                    }
                  }}
                >
                  <ChevronLeft className="size-3.5" />
                </Button>
                <span className="text-[12px] font-medium text-foreground">
                  {t('editorPageOf', { n: pageNumber, total: props.pages.length })}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label={t('editorMovePageDown')}
                  disabled={!canNextPage}
                  onClick={() => {
                    const next = props.pages[pageIndex + 1];
                    if (next) {
                      props.onSelectPage(next.id);
                      props.onSelect(null);
                    }
                  }}
                >
                  <ChevronRight className="size-3.5" />
                </Button>
              </span>
            </div>
            </div>
        </div>
      </div>
      <EditorPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        run={props.run}
      />
      <EditorIconPicker
        open={iconPickerOpen}
        onClose={() => setIconPickerOpen(false)}
        onPick={props.onAddIcon}
      />
    </div>
  );
});
