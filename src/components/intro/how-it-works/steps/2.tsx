import { useTranslation } from '@/app/i18n/client'
import useGlobalContext from '@/hooks/use-context'

export const IntroSecondStep = () => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  return (
    <div className="h-100 d-flex flex-column align-items-center justify-content-center gap-4">
      <div className="text-center">
        <span>{t('intro.create_auction.simply')}</span>
        <span>{t('intro.create_auction.create_an_auction')}</span>
        <span>{t('intro.create_auction.using_the_books')}</span>
        <span>{t('intro.create_auction.other_users')}</span>
        <span>{t('intro.create_auction.for_them')}</span>
      </div>
    </div>
  )
}
