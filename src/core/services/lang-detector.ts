import { languages } from '@/app/i18n/settings'
import { eld } from 'eld'

class LanguageDetectorService {
  private detectionCache: Record<string, string> = {}

  constructor() {
    eld.dynamicLangSubset(languages)
  }

  detectLanguage(text: string) {
    if (this.detectionCache[text]) {
      return this.detectionCache[text]
    }

    const result = eld.detect(text)
    this.detectionCache[text] = result.language
    return this.detectionCache[text]
  }
}

const langDetectorService = new LanguageDetectorService()
export { langDetectorService as LanguageDetectorService }
