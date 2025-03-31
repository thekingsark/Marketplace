import { useTranslation } from '@/app/i18n/client'
import { Account } from '@/core/domain/account'
import useGlobalContext from '@/hooks/use-context'
import { useState } from 'react'
import { Icon } from './icon'
import { ChatController } from '@/core/controllers/chat'
import { toast } from 'react-toastify'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/navigation'
import { AppStore } from '@/core/store'
import { Auction } from '@/core/domain/auction'

export const SendMessageToAccountButton = observer(
  (props: { account: Account; inverted?: boolean; auction?: Auction, fullWidth?: boolean }) => {
    const globalContext = useGlobalContext()
    const currentLanguage = globalContext.currentLanguage
    const { t } = useTranslation(currentLanguage)
    const { account, inverted = false, auction, fullWidth = false } = props

    const router = useRouter()
    const [createGroupInProgress, setCreateGroupInProgress] = useState(false)

    const handleSendMessage = async () => {
      if (!AppStore.accountData?.id) {
        router.push('/auth/login')
        return
      }

      setCreateGroupInProgress(true)
      const chatGroup = await ChatController.createOrLoadChatGroupWithAccount(account.id, auction)
      setCreateGroupInProgress(false)

      if (!chatGroup) {
        toast.error(t('profile.cannot_load_chat_group'))
        return false
      }

      ChatController.openChatGroup(chatGroup)
    }

    return (
      <button
        disabled={createGroupInProgress}
        className={`${inverted ? 'inverted-btn' : 'border-btn'} ${fullWidth ? 'w-100' : 'min-width-button'
          } `}
        onClick={handleSendMessage}
      >
        {createGroupInProgress ? (
          <div className="w-100 d-flex align-items-center justify-content-center">
            <Icon type="loading" />
          </div>
        ) : (
          <span>{t('profile.send_message')}</span>
        )}
      </button>
    )
  }
)
