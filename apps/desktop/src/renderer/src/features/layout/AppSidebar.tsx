import { Pencil, FileText, Clock, Settings2, HelpCircle, type LucideIcon } from 'lucide-react';
import type { Appearance, Screen } from '@thermalbridge/shared';
import { ThemeSwitcher } from '@/features/layout/ThemeSwitcher.js';
import { useI18n } from '@/i18n/I18nProvider.js';
import type { MessageKey } from '@/i18n/messages.js';
import { cn } from '@/lib/utils.js';

const NAV_ITEMS: Array<{ id: Screen; labelKey: MessageKey; icon: LucideIcon }> = [
  { id: 'print', labelKey: 'navPrint', icon: Pencil },
  { id: 'library', labelKey: 'navLibrary', icon: FileText },
  { id: 'history', labelKey: 'navHistory', icon: Clock },
  { id: 'setup', labelKey: 'navPrinters', icon: Settings2 },
];

interface AppSidebarProps {
  screen: Screen;
  onScreen: (screen: Screen) => void;
  onHelp: () => void;
  appearance: Appearance;
  onAppearance: (appearance: Appearance) => void;
}

export function AppSidebar(props: AppSidebarProps) {
  const { t } = useI18n();
  return (
    <aside className="flex w-16 shrink-0 flex-col overflow-hidden border-r border-[color:var(--border-soft)] bg-[var(--surface-1)]">
      <nav className="flex min-h-0 flex-1 flex-col">
        {NAV_ITEMS.map((item) => {
          const active = props.screen === item.id;
          return (
            <NavButton
              key={item.id}
              icon={item.icon}
              label={t(item.labelKey)}
              active={active}
              onClick={() => props.onScreen(item.id)}
            />
          );
        })}
      </nav>
      <div className="flex shrink-0 flex-col items-stretch border-t border-[color:var(--border-soft)]">
        <NavButton icon={HelpCircle} label={t('navHelp')} onClick={props.onHelp} />
        <div className="px-1.5 pb-3">
          <ThemeSwitcher appearance={props.appearance} onAppearance={props.onAppearance} />
        </div>
      </div>
    </aside>
  );
}

function NavButton(props: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  const Icon = props.icon;
  const active = props.active === true;
  return (
    <button
      type="button"
      aria-label={props.label}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'relative flex h-[72px] w-16 shrink-0 flex-col items-center justify-center gap-2 px-1 text-[12px] font-medium leading-tight hover-fade',
        active
          ? 'bg-[color:var(--tb-accent-soft)] text-[color:var(--text-primary)]'
          : 'text-[color:var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[color:var(--text-primary)]',
      )}
      onClick={props.onClick}
    >
      {active ? (
        <span
          className="absolute top-3.5 bottom-3.5 left-0 w-[3px] rounded-r-[3px] bg-primary"
          aria-hidden
        />
      ) : null}
      <Icon className="size-6 shrink-0" strokeWidth={1.75} />
      <span className="w-full truncate text-center">{props.label}</span>
    </button>
  );
}
