import { useEffect, useState, type ReactNode } from 'react';
import { Printer } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.js';
import { useI18n } from '@/i18n/I18nProvider.js';

interface WorkspaceRightPaneProps {
  hasInspector: boolean;
  inspector: ReactNode;
  print: ReactNode;
  printDisabled?: boolean;
  busy?: boolean;
  onPrint?: () => void;
}

export function WorkspaceRightPane(props: WorkspaceRightPaneProps) {
  const { t } = useI18n();
  const [tab, setTab] = useState('print');

  useEffect(() => {
    setTab(props.hasInspector ? 'inspector' : 'print');
  }, [props.hasInspector]);

  return (
    <aside className="flex w-[360px] shrink-0 flex-col overflow-hidden border-l border-[color:var(--border-soft)] bg-[var(--surface-0)]">
      <Tabs value={tab} onValueChange={setTab} className="flex h-full min-h-0 gap-0">
        <div className="relative flex h-[52px] shrink-0 items-stretch border-b border-[color:var(--border-soft)]">
          <TabsList variant="line" className="h-full w-full gap-0 overflow-visible bg-transparent p-0">
            <RightPaneTab value="inspector">{t('inspectorTab')}</RightPaneTab>
            <RightPaneTab value="print">{t('printTab')}</RightPaneTab>
          </TabsList>
        </div>
        <TabsContent value="inspector" className="min-h-0 flex-1 overflow-auto p-3.5">
          {props.hasInspector ? (
            props.inspector
          ) : (
            <p className="text-[12px] text-muted-foreground">{t('inspectorEmpty')}</p>
          )}
        </TabsContent>
        <TabsContent value="print" className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-hidden">{props.print}</div>
          {props.onPrint ? (
            <div className="shrink-0 border-t border-[color:var(--border-soft)] bg-surface-0 px-3.5 py-3">
              <button
                type="button"
                disabled={props.printDisabled}
                onClick={props.onPrint}
                className="tb-btn-print"
              >
                <Printer className="size-5" strokeWidth={1.75} />
                <span>{props.busy ? t('printing') : t('print')}</span>
              </button>
            </div>
          ) : null}
        </TabsContent>
      </Tabs>
    </aside>
  );
}

function RightPaneTab(props: { value: string; children: ReactNode }) {
  return (
    <TabsTrigger
      value={props.value}
      className="h-full flex-1 rounded-none px-4 text-[13px] font-semibold shadow-none after:hidden data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-transparent"
    >
      {props.children}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-4 -bottom-px h-[3px] rounded-t-full bg-primary opacity-0 [[data-state=active]_&]:opacity-100"
      />
    </TabsTrigger>
  );
}
