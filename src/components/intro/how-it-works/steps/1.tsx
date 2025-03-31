import { useTranslation } from '@/app/i18n/client'
import { Icon } from '@/components/common/icon'
import useGlobalContext from '@/hooks/use-context'

export const IntroFirstStep = () => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  return (
    <div className="d-flex flex-column align-items-center gap-4">
      <Icon type="intro/guide" size={100} />
      <div className="text-center">
        <span>{t('intro.on')}</span>
        <span>{globalContext.appSettings.appName}</span>
        <span>{t('intro.can_easily_trade')}</span>
      </div>
    </div>
  )
}
