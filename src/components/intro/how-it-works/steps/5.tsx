import { useTranslation } from '@/app/i18n/client'
import { Icon } from '@/components/common/icon'
import useGlobalContext from '@/hooks/use-context'

export const IntroFifthStep = () => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  return (
    <div className="d-flex flex-column align-items-center gap-4">
      <Icon type="intro/rate" size={100} />
      <div className="text-center">
        <span>{t('intro.review.after_the_auction')}</span>
        <span>{t('intro.review.leave_a_review')}</span>
        <span>{t('intro.review.for_the_winner')}</span>
      </div>
      <p className="text-center">{t('intro.review.help_other_users')}</p>
    </div>
  )
}
