import { useTranslation } from '@/app/i18n/client'
import { Icon } from '@/components/common/icon'
import useGlobalContext from '@/hooks/use-context'

export const NoConversation = () => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <div className="mt-20">
        <Icon type="generic/chat-color" size={100} />
      </div>
      <div className="mt-20 mb-20">
        <p className="mb-0 no-chats-msg">{t('chat.no_conversations_available')}</p>
      </div>
      <style jsx>{`
        .no-chats-msg {
          color: var(--font_1);
          text-align: center;
        }
      `}</style>
    </div>
  )
}
