import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'
import { fallbackLng, getOptions, languages } from './settings'

const initI18next = async (lng: string | undefined, ns: string | undefined) => {
  if (languages.indexOf(lng ?? '') === -1) {
    lng = fallbackLng
  }

  const i18nInstance = createInstance()
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(async (language: unknown) => {
        return import(`./locales/${language}.json`)
      })
    )
    .init(getOptions(lng, ns))
  return i18nInstance
}

export async function useTranslation(
  lng?: string | readonly string[] | null | undefined,
  ns?: string | string[] | undefined,
  options = {}
) {
  lng = typeof lng === 'string' ? lng : Array.isArray(lng) ? lng[0] : 'en'
  if (languages.indexOf((lng as string) ?? '') === -1) {
    lng = fallbackLng
  }

  const i18nextInstance = await initI18next(lng as string, ns as string)

  return {
    t: i18nextInstance.getFixedT(
      lng as string,
      Array.isArray(ns) ? ns[0] : ns,
      (options as { keyPrefix?: string }).keyPrefix // Add type annotation to include keyPrefix property
    ),
    i18n: i18nextInstance,
  }
}
