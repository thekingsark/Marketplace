import { useTranslation } from '@/app/i18n/client'
import { Icon } from '@/components/common/icon'
import useGlobalContext from '@/hooks/use-context'

export const NoNotifications = () => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <div className="mt-20">
        <Icon type={'generic/notification'} size={80} />
      </div>
      <div className="mt-20 mb-20">
        <p className="mb-20 no-notifications-msg">
          {t('home.notifications.dont_have_notifications')}
        </p>
      </div>

      <style jsx>{`
        .no-notifications-msg {
          color: var(--font_1);
          text-align: center;
        }
      `}</style>
    </div>
  )
}
