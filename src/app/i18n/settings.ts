export const fallbackLng = 'en'
export const languages = [fallbackLng, 'de', 'es', 'fr', 'it', 'ja', 'ro', 'ar']
export const defaultNS = 'translation'

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  }
}
