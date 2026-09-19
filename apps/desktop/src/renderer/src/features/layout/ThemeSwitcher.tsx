import { Moon, Sun } from 'lucide-react';
import type { Appearance } from '@thermalbridge/shared';
import { useI18n } from '@/i18n/I18nProvider.js';
import { cn } from '@/lib/utils.js';

interface ThemeSwitcherProps {
  appearance: Appearance;
  onAppearance: (appearance: Appearance) => void;
}

export function ThemeSwitcher(props: ThemeSwitcherProps) {
  const { t } = useI18n();
  return (
    <div
      className="flex w-full items-center justify-center gap-0.5 rounded-lg border border-[color:var(--border-soft)] bg-[var(--surface-2)] p-0.5"
      role="group"
      aria-label={t('appearanceToggle')}
    >
      <button
        type="button"
        aria-pressed={props.appearance === 'light'}
        aria-label={t('appearanceLight')}
        title={t('appearanceLight')}
        className={cn(
          'flex size-7 items-center justify-center rounded-md hover-fade',
          props.appearance === 'light'
            ? 'bg-[var(--surface-0)] text-[color:var(--text-primary)] shadow-sm'
            : 'text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]',
        )}
        onClick={() => props.onAppearance('light')}
      >
        <Sun className="size-4" strokeWidth={1.75} />
      </button>
      <button
        type="button"
        aria-pressed={props.appearance === 'dark'}
        aria-label={t('appearanceDark')}
        title={t('appearanceDark')}
        className={cn(
          'flex size-7 items-center justify-center rounded-md hover-fade',
          props.appearance === 'dark'
            ? 'bg-[var(--surface-0)] text-[color:var(--text-primary)] shadow-sm'
            : 'text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]',
        )}
        onClick={() => props.onAppearance('dark')}
      >
        <Moon className="size-4" strokeWidth={1.75} />
      </button>
    </div>
  );
}
