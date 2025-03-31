export interface LanguageMetaItem {
  name: string
  icon: string
}

export const LANGUAGES_META: Record<string, LanguageMetaItem> = {
  en: {
    name: 'English',
    icon: 'flags/english1',
  },
  es: {
    name: 'Español',
    icon: 'flags/spain',
  },
  fr: {
    name: 'Français',
    icon: 'flags/france',
  },
  de: {
    name: 'Deutsch',
    icon: 'flags/germany',
  },
  it: {
    name: 'Italiano',
    icon: 'flags/italy',
  },
  ja: {
    name: '日本語',
    icon: 'flags/japan',
  },
  ro: {
    name: 'Română',
    icon: 'flags/romania',
  },
  ar: {
    name: 'العربية',
    icon: 'flags/arabic',
  },
}
