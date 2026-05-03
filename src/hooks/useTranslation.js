import { translations } from '../data/translations';
import { useStore } from '../store/useStore';

export function useTranslation() {
  const language = useStore((s) => s.language);
  const t = translations[language] || translations.en;
  return { t, language };
}
