import type { LabelSize } from '@thermalbridge/printer-profiles';
import { Bluetooth, ChevronDown, FileText, LayoutTemplate, Printer } from 'lucide-react';
import { LabelSizeSelect } from '@/features/preview/LabelSizeSelect.js';
import type { LinkState } from '@/features/printers/connection-status.js';
import { useI18n } from '@/i18n/I18nProvider.js';
import type { SourceDocument } from '@/state/types.js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select.js';
import appIcon from '@/assets/app-icon.png';

interface AppChromeProps {
  source: SourceDocument | null;
  widthMm: number;
  heightMm: number;
  dpi: number;
  printerId: string;
  printerName: string | null;
  printerModel: string | null;
  printers: readonly { id: string; name: string }[];
  linkState: LinkState;
  onOpenFile: () => void;
  onLabelSize: (size: { widthMm: number; heightMm: number }) => void;
  onSelectPrinter: (id: string) => void;
  onConnectPrinter: () => void;
  onSaveTemplate: () => void;
  labelSizes?: readonly LabelSize[];
}

export function AppChrome(props: AppChromeProps) {
  const { t } = useI18n();
  const connected = props.linkState === 'connected';

  return (
    <header className="flex h-[72px] w-full shrink-0 items-center gap-3 overflow-hidden border-b border-[color:var(--border-soft)] bg-[var(--surface-0)] px-4">
      <div className="flex h-12 w-[224px] shrink-0 items-center gap-3">
        <img src={appIcon} alt="" className="size-10 shrink-0 rounded-[10px]" />
        <div className="min-w-0 leading-none">
          <p className="truncate text-[18px] font-semibold leading-6 tracking-tight text-foreground">
            {t('appTitle')}
          </p>
          <p className="truncate text-[11px] leading-[15px] text-muted-foreground">
            {t('appTagline')}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={props.onOpenFile}
        className="tb-chrome-control min-w-0 flex-[1.1] text-left text-[14px] font-medium leading-5"
      >
        <FileText className="size-[18px] shrink-0 text-muted-foreground" strokeWidth={1.75} />
        <span className="min-w-0 flex-1 truncate">{props.source?.name ?? t('addFile')}</span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
      </button>

      <div className="min-w-0 flex-[1.4]">
        <LabelSizeSelect
          variant="chrome"
          widthMm={props.widthMm}
          heightMm={props.heightMm}
          dpi={props.dpi}
          onChange={props.onLabelSize}
          className="w-full min-w-0"
          {...(props.labelSizes !== undefined ? { sizes: props.labelSizes } : {})}
        />
      </div>

      <button
        type="button"
        onClick={props.onSaveTemplate}
        className="tb-chrome-control min-w-0 flex-1 text-[14px] font-medium leading-5"
      >
        <LayoutTemplate className="size-[18px] shrink-0 text-muted-foreground" strokeWidth={1.75} />
        <span className="min-w-0 truncate">{t('templatesSave')}</span>
      </button>

      <div className="min-w-0 flex-[1.5]">
        <Select
          value={props.printerId || '__none__'}
          onValueChange={(value) => {
            if (value !== '__none__') {
              props.onSelectPrinter(value);
            }
          }}
        >
          <SelectTrigger className="tb-chrome-control h-11 w-full min-w-0 border-border bg-[var(--surface-2)] px-3.5 shadow-none">
            <span className="flex min-w-0 flex-1 items-center gap-2">
              <Printer className="size-[18px] shrink-0 text-muted-foreground" strokeWidth={1.75} />
              <span className="min-w-0 flex-1 text-left leading-none">
                <span className="block truncate text-[14px] font-medium">
                  {props.printerName ?? t('selectPrinter')}
                </span>
                {props.printerModel ? (
                  <span className="mt-0.5 block truncate font-mono text-[11px] text-muted-foreground">
                    {props.printerModel}
                  </span>
                ) : null}
              </span>
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">{t('selectPrinter')}</SelectItem>
            {props.printers.map((printer) => (
              <SelectItem key={printer.id} value={printer.id}>
                {printer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <button
        type="button"
        onClick={props.onConnectPrinter}
        className="tb-btn-bluetooth w-[180px] max-w-[180px] shrink-0 text-[13px] font-semibold"
      >
        <Bluetooth className="size-[18px] shrink-0" strokeWidth={1.75} />
        <span className="truncate">
          {connected ? t('bluetoothConnectedFull') : t('connectBluetooth')}
        </span>
      </button>

      <div className="flex h-11 w-[100px] shrink-0 items-center justify-end">
        {connected ? (
          <span className="tb-status-pill">
            <span className="size-2 shrink-0 rounded-full bg-[var(--success)]" aria-hidden />
            {t('bluetoothConnected')}
          </span>
        ) : (
          <span className="truncate text-[12px] text-muted-foreground">{props.printerName ?? '—'}</span>
        )}
      </div>
    </header>
  );
}
