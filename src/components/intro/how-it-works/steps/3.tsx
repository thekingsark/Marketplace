import { useTranslation } from '@/app/i18n/client'
import { Icon } from '@/components/common/icon'
import useGlobalContext from '@/hooks/use-context'

export const IntroThirdStep = () => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  return (
    <div className="d-flex flex-column align-items-center gap-4">
      <Icon type="intro/wait" size={100} />
      <div className="text-center">
        <span>{t('intro.wait_for_bid.can_wait')}</span>
      </div>
    </div>
  )
}
