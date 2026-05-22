import { TranslateTargetLanguage } from '../dto/process-text.dto'

export const TRANSLATE_LANGUAGE_LABELS: Record<
  TranslateTargetLanguage,
  string
> = {
  zh: '中文',
  en: '英文',
  ja: '日文',
  ko: '韩文',
  fr: '法文',
  de: '德文',
  es: '西班牙文',
}

export function getTranslateLanguageLabel(
  code: TranslateTargetLanguage,
): string {
  return TRANSLATE_LANGUAGE_LABELS[code] ?? code
}
