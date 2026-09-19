import { Switch } from '@/components/ui/switch.js';
import { useI18n } from '@/i18n/I18nProvider.js';
import { cn } from '@/lib/utils.js';

interface PreviewViewTogglesProps {
  showRuler: boolean;
  showGrid: boolean;
  onToggleRuler: () => void;
  onToggleGrid: () => void;
  className?: string;
}

export function PreviewViewToggles(props: PreviewViewTogglesProps) {
  const { t } = useI18n();

  return (
    <div
      className={cn(
        'flex h-10 items-center gap-3 rounded-xl border border-border bg-[var(--surface-1)] px-3 shadow-dock',
        props.className,
      )}
    >
      <label className="flex items-center gap-1.5 text-[12px] text-foreground">
        <Switch
          size="sm"
          checked={props.showRuler}
          onCheckedChange={props.onToggleRuler}
          aria-label={t('previewRuler')}
        />
        {t('previewRuler')}
      </label>
      <label className="flex items-center gap-1.5 text-[12px] text-foreground">
        <Switch
          size="sm"
          checked={props.showGrid}
          onCheckedChange={props.onToggleGrid}
          aria-label={t('editorGrid')}
        />
        {t('editorGrid')}
      </label>
    </div>
  );
}
