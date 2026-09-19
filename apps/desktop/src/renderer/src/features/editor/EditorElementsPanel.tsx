import {
  ArrowRight,
  Barcode,
  CalendarClock,
  Circle,
  Copy,
  Grid3x3,
  ImageIcon,
  Minus,
  QrCode,
  Shapes,
  Square,
  Table,
  Trash2,
  TriangleAlert,
  Type,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { commandSpec, type MenuActionId } from '@thermalbridge/shared';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.js';
import { displayAccelerator } from '@/features/commands/accelerator-display.js';
import { AWB_IMAGE_ID } from './LabelCanvas.js';
import { useI18n } from '@/i18n/I18nProvider.js';
import type { MessageKey } from '@/i18n/messages.js';
import { cn } from '@/lib/utils.js';

interface EditorElementsPanelProps {
  selectedId: string | null;
  showGrid: boolean;
  run: (id: MenuActionId) => void;
}

const PRIMARY: Array<{ id: MenuActionId; icon: LucideIcon; labelKey: MessageKey }> = [
  { id: 'insert.text', icon: Type, labelKey: 'editorAddText' },
  { id: 'insert.qr', icon: QrCode, labelKey: 'editorAddQr' },
  { id: 'insert.barcode', icon: Barcode, labelKey: 'editorAddBarcode' },
];

const SHAPES: Array<{ id: MenuActionId; icon: LucideIcon; labelKey: MessageKey }> = [
  { id: 'insert.box', icon: Square, labelKey: 'editorAddBox' },
  { id: 'insert.line', icon: Minus, labelKey: 'editorAddLine' },
  { id: 'insert.circle', icon: Circle, labelKey: 'editorAddCircle' },
  { id: 'insert.arrow', icon: ArrowRight, labelKey: 'editorAddArrow' },
];

const MORE: Array<{ id: MenuActionId; icon: LucideIcon; labelKey: MessageKey }> = [
  { id: 'insert.icon', icon: TriangleAlert, labelKey: 'editorAddIcon' },
  { id: 'insert.image', icon: ImageIcon, labelKey: 'editorAddImage' },
  { id: 'insert.table', icon: Table, labelKey: 'editorAddTable' },
  { id: 'insert.field', icon: CalendarClock, labelKey: 'editorAddField' },
];

export function EditorElementsPanel(props: EditorElementsPanelProps) {
  const { t } = useI18n();
  const canDuplicate = Boolean(props.selectedId) && props.selectedId !== AWB_IMAGE_ID;
  const canDelete = Boolean(props.selectedId);

  return (
    <aside className="flex w-[286px] shrink-0 flex-col overflow-hidden border-r border-[color:var(--border-soft)] bg-[var(--surface-1)]">
      <div className="shrink-0 px-[18px] pt-5 pb-4">
        <h2 className="text-[18px] font-semibold leading-6 tracking-[-0.015em]">
          {t('elementsTitle')}
        </h2>
        <p className="mt-1 text-[12px] leading-[17px] text-muted-foreground">
          {t('elementsSubtitle')}
        </p>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-2 content-start gap-3 overflow-auto px-[18px] pb-5">
        {PRIMARY.map((tool) => (
          <ElementTile
            key={tool.id}
            icon={tool.icon}
            label={t(tool.labelKey)}
            onClick={() => props.run(tool.id)}
          />
        ))}
        <ShapesTile
          label={t('editorAddShapes')}
          items={SHAPES.map((tool) => ({
            id: tool.id,
            label: t(tool.labelKey),
            shortcut: displayAccelerator(commandSpec(tool.id).accelerator),
            icon: tool.icon,
            onSelect: () => props.run(tool.id),
          }))}
        />
        {MORE.map((tool) => (
          <ElementTile
            key={tool.id}
            icon={tool.icon}
            label={t(tool.labelKey)}
            onClick={() => props.run(tool.id)}
          />
        ))}
        <div className="col-span-2 my-1 h-px bg-[color:var(--border-soft)]" />
        <ElementTile
          icon={Copy}
          label={t('editorDuplicate')}
          compact
          disabled={!canDuplicate}
          onClick={() => props.run('edit.duplicate')}
        />
        <ElementTile
          icon={Trash2}
          label={t('editorDelete')}
          compact
          disabled={!canDelete}
          onClick={() => props.run('edit.delete')}
        />
        <ElementTile
          icon={Grid3x3}
          label={t('editorAddGrid')}
          compact
          short
          active={props.showGrid}
          onClick={() => props.run('view.toggleGrid')}
        />
      </div>
    </aside>
  );
}

function ElementTile(props: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  compact?: boolean;
  short?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  const Icon = props.icon;
  return (
    <button
      type="button"
      disabled={props.disabled === true}
      aria-label={props.label}
      aria-pressed={props.active === true ? true : undefined}
      onClick={props.onClick}
      className={cn(
        'tb-tool-card min-w-0',
        props.compact === true && 'min-h-[84px]',
        props.short === true && 'min-h-[72px]',
        props.active === true &&
          'border-[color:var(--tb-accent-border)] bg-[color:var(--tb-accent-soft)] text-foreground',
        props.disabled === true &&
          'cursor-not-allowed opacity-45 hover:translate-y-0 hover:border-border hover:bg-[var(--surface-2)]',
      )}
    >
      <Icon className="size-6 shrink-0" strokeWidth={1.75} />
      <span className="w-full text-center text-[12px] font-medium leading-tight">
        {props.label}
      </span>
    </button>
  );
}

function ShapesTile(props: {
  label: string;
  items: Array<{
    id: MenuActionId;
    label: string;
    shortcut: string;
    icon: LucideIcon;
    onSelect: () => void;
  }>;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" aria-label={props.label} className="tb-tool-card min-w-0">
          <Shapes className="size-6 shrink-0" strokeWidth={1.75} />
          <span className="w-full text-center text-[12px] font-medium leading-tight">
            {props.label}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="right" sideOffset={8} className="min-w-44">
        {props.items.map((item) => {
          const Icon = item.icon;
          return (
            <DropdownMenuItem key={item.id} onSelect={item.onSelect}>
              <Icon className="size-4" strokeWidth={1.75} />
              {item.label}
              <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
