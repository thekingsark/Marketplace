import { useTranslation } from '@/app/i18n/client'
import { Icon } from '@/components/common/icon'
import useGlobalContext from '@/hooks/use-context'

export const IntroFourthStep = () => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  return (
    <div className="d-flex flex-column align-items-center gap-4">
      <Icon type="intro/choose" size={100} />
      <div className="text-center">
        <span>{t('intro.chose_bid.if_you_pick')}</span>
        <span>{t('intro.chose_bid.to_chat')}</span>
        <span>{t('intro.chose_bid.to_arrange_settlement')}</span>
      </div>
    </div>
  )
}
