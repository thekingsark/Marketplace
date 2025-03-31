'use client'
import React, { useEffect, useState } from 'react'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'
import { useClickOutside } from '@/hooks/click-outside'
import { ELEMENT_IDS } from '@/constants/ids'
import { AppStore } from '@/core/store'
import { IconButton } from '../common/icon-button'
import { YouNeedToLogin } from '../common/you-need-to-login'
import { observer } from 'mobx-react-lite'
import { ChatGroupsList } from './chat/list'

export const ChatButton = observer(() => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)
  const currentAccount = AppStore.accountData ?? undefined

  const [chatVisible, setChatVisible] = useState(false)

  const chatMenuRef = React.useRef<HTMLDivElement>(null)
  const buttonRef = React.useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 50, right: 0 })
  const [initialised, setInitialised] = useState(false)

  const unreadMessagesCount = Object.values(AppStore.chatGroups).reduce(
    (acc, val) => acc + (val.unreadMessages ?? 0),
    0
  )

  useEffect(() => {
    if (!initialised) {
      setInitialised(true)
    }
  }, [])

  useClickOutside(
    chatMenuRef,
    () => {
      if (chatVisible) {
        setChatVisible(false)
      }
    },
    [chatVisible],
    [buttonRef]
  )

  const handleShowChat = () => {
    const rect = buttonRef.current?.getBoundingClientRect()
    if (!rect) {
      return
    }
    const newPos = {
      top: 50,
      right: 0,
    }

    if (rect.bottom + 500 > window.innerHeight) {
      newPos.top -= rect.bottom + 500 - window.innerHeight
      newPos.top -= 45
    }

    const availableWidth = window.innerWidth - (window.innerWidth - (rect.width + rect.left))
    const windowWidthIsSmallerThanDetails = availableWidth < 500
    if (windowWidthIsSmallerThanDetails) {
      const rightSpace = window.innerWidth - rect.right
      const overflowAmount = 500 - rightSpace + (window.innerWidth < 412 ? -220 : -85)
      newPos.right -= overflowAmount ? overflowAmount : 0
    }

    setPosition(newPos)
    setChatVisible(!chatVisible)
  }

  return (
    <div className={`pos-rel ${chatVisible ? 'show-element' : ''}`}>
      <div ref={buttonRef}>
        <IconButton
          noMargin
          icon="header/chat"
          title={t('chat.chat')}
          aria-label={t('chat.chat')}
          onClick={handleShowChat}
          countInfo={unreadMessagesCount}
          id={ELEMENT_IDS.CHAT_HEADER_BTN}
        />
      </div>
      {initialised && (
        <div
          className="chat-group-details"
          ref={chatMenuRef}
          style={{
            maxWidth: !currentAccount ? '350px' : `${window.innerWidth - 30}px`,
          }}
        >
          {!currentAccount ? (
            <div className="p-16">
              <YouNeedToLogin message={t('anonymous.login_for_chat')} />{' '}
            </div>
          ) : (
            <ChatGroupsList close={() => setChatVisible(false)} />
          )}
          <div
            className="transparent-overlay overlay-open"
            onClick={() => {
              setChatVisible(!chatVisible)
            }}
          ></div>
        </div>
      )}
      <style jsx>{`
        .chat-group-details {
          background: var(--background_1);
          padding: 0;
          min-width: 200px;
          border-radius: 6px;
          position: absolute;
          right: ${position.right}px;
          top: 50px;
          z-index: 200;
          box-shadow: 10px 30px 20px rgba(37, 52, 103, 0.11);
          display: none;
          width: 500px;
          max-height: 600px;
          border: 1px solid var(--separator);
        }
        .show-element .chat-group-details {
          display: block;
        }
      `}</style>
    </div>
  )
})
