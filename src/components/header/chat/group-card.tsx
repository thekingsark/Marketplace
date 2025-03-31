import React from 'react'
import Image from 'next/image'
import { generateNameForAccount } from '@/utils'
import { ChatGroup } from '@/core/domain/chat-group'
import { ChatMessage } from '@/core/domain/chat-message'
import { AppStore } from '@/core/store'
import { observer } from 'mobx-react-lite'
import { AccountStatusCircle } from '@/components/common/account-status-circle'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'
import { FormattedDate } from '@/components/common/formatted-date'
import { VerifiedBadge } from '@/components/common/verified-badge'

interface ChatGroupCardProps {
  chatGroup: ChatGroup
  openChatGroup: () => void
}

export const ChatGroupCard = observer((props: ChatGroupCardProps) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)
  const { chatGroup, openChatGroup } = props

  const computeLastMessage = (messages: ChatMessage[]) => {
    return messages ? messages[messages.length - 1] : undefined
  }

  const lastMessage = computeLastMessage(AppStore.chatMessages[chatGroup.id])

  const unreadMessagesCount = chatGroup.unreadMessages
  const accountToDisplay =
    AppStore.accountData?.id === chatGroup.firstAccountId
      ? chatGroup.secondAccount
      : chatGroup.firstAccount

  if (!accountToDisplay) {
    return null
  }

  return (
    <div className="chat-group-root mb-10" onClick={openChatGroup}>
      <div className="chat-group-background"></div>
      <div className="d-flex align-items-center">
        <div className="image-container position-relative">
          <Image
            width={48}
            height={48}
            style={{ width: '48px', height: '48px', borderRadius: '50%' }}
            src={accountToDisplay!.picture}
            alt="account"
          />
          <AccountStatusCircle accountId={accountToDisplay.id} />
          <div className="verified-badge-container">
            <VerifiedBadge verified={accountToDisplay.verified} />
          </div>
        </div>
        <div className="ml-10 d-flex justify-content-between align-items-center w-100">
          <div className="d-flex flex-column">
            <span className="user-name m-0">{generateNameForAccount(accountToDisplay!)}</span>
            {lastMessage && (
              <span className="mt-1 message-content m-0 secondary-color">
                {lastMessage?.type === 'text'
                  ? lastMessage?.message
                  : lastMessage?.type === 'location'
                    ? t('location.location')
                    : t('chat.chat_images')}
              </span>
            )}
          </div>
          <div className="d-flex align-items-center">
            {lastMessage?.createdAt ? (
              <span className="message-date">
                <FormattedDate
                  format="D MMM, H:mm"
                  date={lastMessage?.createdAt ? lastMessage.createdAt : new Date()}
                />
              </span>
            ) : null}
            {!!unreadMessagesCount && (
              <span className="icon-count ml-10 mb-2">{unreadMessagesCount}</span>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .chat-group-root {
          padding: 8px;
          width: 100%;
          overflow: hidden;
          position: relative;
          background: var(--background_4);
          border-radius: 6px;
          cursor: pointer;
          border: 1px solid var(--separator);
        }
        .chat-active-text {
          font-size: 14px;
        }
        .image-container {
          width: 48px;
          height: 48px;
        }
        .user-name {
          color: var(--font_1);
          font-weight: 600;
        }
        .message-date {
          font-size: 14px;
          white-space: nowrap;
        }
        .message-content {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          word-break: break-word;
        }
        .chat-group-background {
          overflow: hidden;
          content: '';
          position: absolute;
          margin: auto;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 100%;
          background: url('${accountToDisplay!.picture}') no-repeat center center;
          background-size: cover;
          opacity: 0.03;
          z-index: 1;
          mix-blend-mode: dst-atop;
        }
        .icon-count {
          background: linear-gradient(to right, #f45c43, #dc4973, #ab4f8f);
          border-radius: 50%;
          width: 26px;
          height: 24px;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 2px;
          color: white;
        }
      `}</style>
    </div>
  )
})
