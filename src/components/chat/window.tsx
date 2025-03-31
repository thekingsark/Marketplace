'use client'
import React, { useEffect, useRef, useState } from 'react'
import { generateNameForAccount } from '@/utils'
import Image from 'next/image'
import { v4 as uuidV4 } from 'uuid'
import { ChatMessageItem } from './chat-message'
import { useTranslation } from '@/app/i18n/client'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useClickOutside } from '@/hooks/click-outside'
import { debounce } from 'lodash'
import { ChatGroup } from '@/core/domain/chat-group'
import { ChatMessage, ChatMessageStatus } from '@/core/domain/chat-message'
import { ChatController, DEFAULT_CHAT_MESSAGES_PER_PAGE } from '@/core/controllers/chat'
import useGlobalContext from '@/hooks/use-context'
import { AppStore } from '@/core/store'
import { Icon } from '../common/icon'
import { observer } from 'mobx-react-lite'
import { AccountStatusCircle } from '../common/account-status-circle'
import { AttachAssetsToMessageButton } from './attach-assets-button'
import { VerifiedBadge } from '../common/verified-badge'
import { ChatAuctionInfo } from './auction-info'
import { Filter } from 'bad-words'

const Picker = dynamic(() => import('./emoji-picker'), { ssr: false })

interface ChatWindowProps {
  rightOffset?: number
  chatGroup: ChatGroup
  containedWindow?: boolean
}

export const ChatWindow = observer((props: ChatWindowProps) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const { rightOffset, containedWindow = false } = props

  const [chatGroup, setChatGroup] = useState(props.chatGroup)

  useEffect(() => {
    setChatGroup(props.chatGroup)
  }, [props.chatGroup])

  const currentAccount = AppStore.accountData
  const [isSmallScreen, setIsSmallScreen] = useState(
    window.matchMedia('(max-width: 432px)').matches
  )

  const [message, setMessage] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)

  const messagesListContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const emojiRef = useRef<HTMLDivElement>(null)
  const openEmojiButtonRef = useRef<HTMLDivElement>(null)

  const messageTextareaRef = useRef<HTMLTextAreaElement>(null)
  const [olderMessagesLoading, setOlderMessagesLoading] = useState(false)
  const [fetchingInitialMessages, setFetchingInitialMessages] = useState(false)

  const fistScrollToBottomDoneRef = useRef(false)
  const olderMessagesJustLoadedRef = useRef(false)
  const currentPageRef = useRef(0)

  const fetchInitialMessagesAndListenForChanges = async () => {
    if (fetchingInitialMessages) {
      return
    }

    setFetchingInitialMessages(true)
    await ChatController.loadMessagesForGroup(props.chatGroup.id)
    setFetchingInitialMessages(false)
  }

  useEffect(() => {
    fetchInitialMessagesAndListenForChanges()
  }, [])

  useClickOutside(
    emojiRef,
    () => {
      if (showEmoji) {
        setShowEmoji(false)
      }
    },
    [showEmoji],
    [openEmojiButtonRef]
  )

  useEffect(() => {
    if (olderMessagesJustLoadedRef.current) {
      olderMessagesJustLoadedRef.current = false
      return
    }

    // Whenever the messages list is updated, we need to scroll to the bottom
    messagesEndRef.current?.scrollIntoView({
      behavior: fistScrollToBottomDoneRef.current ? 'smooth' : 'instant',
      block: 'nearest',
      inline: 'nearest',
    })
    fistScrollToBottomDoneRef.current = true
  }, [AppStore.chatMessages[props.chatGroup.id], AppStore.chatMessages[props.chatGroup.id]?.length])

  // This effect is responsible for making the textarea grow as the user types
  useEffect(() => {
    if (messageTextareaRef.current) {
      messageTextareaRef.current.addEventListener('input', function () {
        this.style.height = 'auto'
        this.style.height = this.scrollHeight + 'px'
      })
    }
  }, [messageTextareaRef])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 432px)')
    const handleChange = (event: MediaQueryListEvent) => {
      setIsSmallScreen(event.matches)
    }

    mq.addEventListener('change', handleChange)
    return () => {
      mq.removeEventListener('change', handleChange)
    }
  }, [])

  const accountInfoToDisplay =
    chatGroup.firstAccount?.id === currentAccount?.id
      ? chatGroup.secondAccount
      : chatGroup.firstAccount

  if (!accountInfoToDisplay) {
    return null
  }

  const handleCloseChat = () => {
    ChatController.closeChatGroup(props.chatGroup.id)
  }

  const markMessagesAsSeen = () => {
    const chatGroupMessages = AppStore.chatMessages[props.chatGroup.id]
    if (!chatGroupMessages || !chatGroupMessages.length) {
      return
    }
  }

  const markMessagesAsSeanDebounced = debounce(markMessagesAsSeen, 500)

  const handleAssetsPicked = async (files: File[]) => {
    if (!files?.length) {
      return
    }

    try {
      const chatMessage = new ChatMessage({
        message: '',
        chatGroupId: props.chatGroup.id,
        fromAccountId: AppStore.accountData!.id,
        status: ChatMessageStatus.pending,
        fileList: files as unknown as FileList,
        id: uuidV4(),
        type: 'assets',
        createdAt: new Date(),
      })

      setTimeout(() => {
        markMessagesAsSeanDebounced()
      }, 1000)

      await ChatController.sendMessage(chatMessage, files as unknown as FileList)

    } catch (error) {
      console.error('Could not send assets to chat:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!message) {
      return
    }

    const badWordsFilter = new Filter()

    const chatMessage = new ChatMessage({
      message: badWordsFilter.clean(message),
      chatGroupId: props.chatGroup.id,
      fromAccountId: AppStore.accountData!.id,
      status: ChatMessageStatus.pending,
      id: uuidV4(),
      type: 'text',
      createdAt: new Date(),
    })

    setMessage('')

    try {
      setTimeout(() => {
        markMessagesAsSeanDebounced()
      }, 1000)

      await ChatController.sendMessage(chatMessage)
    } catch (error) {
      console.error('Could not send message:', error)
    }
  }

  const loadOlderMessages = async () => {
    // If we have less messages than the current page * messages per page, we reached the end
    // and we don't need to fetch more
    const reachedEnd =
      AppStore.chatMessages[props.chatGroup.id].length < (currentPageRef.current + 1) * DEFAULT_CHAT_MESSAGES_PER_PAGE
    if (reachedEnd) {
      return
    }

    // As we are going to fetch older messages, the new messages will be added
    // in the list that we're using to display the messages. Every time this
    // list is updated, the scroll to bottom effect will be triggered, so we
    // need to disable it while we're fetching the older messages.
    // We are going to use a ref to control this.
    // Setting the ref value to "true" here, and the next time the component
    // tries to scroll to the bottom, it will not do it and just set this flag
    // back to "false"
    olderMessagesJustLoadedRef.current = true
    setOlderMessagesLoading(true)
    currentPageRef.current += 1
    await ChatController.loadMessagesForGroup(
      props.chatGroup.id,
      currentPageRef.current,
      DEFAULT_CHAT_MESSAGES_PER_PAGE,
      true
    )
    setOlderMessagesLoading(false)
  }

  const translateMessage = (messageId: string) => {
    return ChatController.translateMessage(messageId, currentLanguage)
  }

  const handleMessagesContainerScroll = () => {
    const container = messagesListContainerRef.current
    if (container && container.scrollTop < 700 && !olderMessagesLoading) {
      loadOlderMessages()
    }
  }

  return (
    <div
      className={`chat-window responsive-chat-window ${containedWindow ? 'contained-window' : ''}`}
      style={{ ...(containedWindow ? {} : { right: rightOffset }) }}
    >
      <div className="d-flex justify-content-between align-items-center account-info">
        <Link href={`/account/${accountInfoToDisplay.id}`}>
          <div className="d-flex align-items-center gap-2">
            <div className="picture-container position-relative">
              <Image
                src={accountInfoToDisplay.picture}
                alt="avatar"
                width={40}
                height={40}
                style={{ borderRadius: '50%' }}
              />
              <AccountStatusCircle accountId={accountInfoToDisplay.id} />
              <div className='verified-badge-container'><VerifiedBadge verified={accountInfoToDisplay.verified} /></div>
            </div>
            <p className="mb-0 account-name">
              {generateNameForAccount(accountInfoToDisplay)}
            </p>
          </div>
        </Link>
        {containedWindow ? null : (
          <button onClick={handleCloseChat} className="d-flex align-items-center">
            <Icon type="generic/close-filled" />
          </button>
        )}
      </div>

      {!!chatGroup.chatGroupAuctions?.length &&
        <div className="chat-window-auctions">
          {chatGroup.chatGroupAuctions?.map((auction) => {
            return <ChatAuctionInfo auction={auction} key={auction.id} />
          })}
        </div>
      }

      <div
        className="d-flex flex-grow-1 flex-column messages-container"
        ref={messagesListContainerRef}
        onScroll={handleMessagesContainerScroll}
      >
        {fetchingInitialMessages ? (
          <div className="d-flex align-items-center justify-content-center w-100 h-100">
            <Icon type={'loading'} size={28} />
          </div>
        ) : (
          <>
            {AppStore.chatMessages[props.chatGroup.id]?.map((message, index) => {
              return (
                <ChatMessageItem
                  key={message.id ?? index}
                  message={message}
                  currentAccount={currentAccount!}
                  senderAccount={
                    message.fromAccountId === chatGroup.firstAccountId
                      ? chatGroup.firstAccount!
                      : chatGroup.secondAccount!
                  }
                  translateContent={() => translateMessage(message.id)}
                />
              )
            })}
            <div ref={messagesEndRef} style={{ float: 'left', clear: 'both' }}></div>
          </>
        )}
      </div>
      {showEmoji && (
        <div className="emojis-root" ref={emojiRef}>
          <Picker
            onSelect={(emoji) => {
              setMessage(message + emoji.emoji)
            }}
          />
        </div>
      )}
      <div className="footer d-flex align-items-center gap-2">
        <>
          <div className="position-relative d-flex flex-grow-1">
            <textarea
              name="description"
              id="description"
              ref={messageTextareaRef}
              className="send-message-textarea"
              value={message}
              maxLength={2000}
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  e.stopPropagation()
                  handleSendMessage()
                  setMessage('')
                  if (messageTextareaRef.current) {
                    messageTextareaRef.current.style.height = 'auto'
                  }
                }
              }}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('chat.send_message')}
            />

            <div className='action-buttons d-flex flex-row gap-3'>

              <AttachAssetsToMessageButton onFilesPick={handleAssetsPicked} />
              <div
                ref={openEmojiButtonRef}
                onClick={() => setShowEmoji(!showEmoji)}
                className="d-flex align-items-center justify-content-center cursor-pointer"
              >

                <Icon type="chat/emoji" />
              </div>
            </div>
          </div>
          <button className="btn fill-btn send-message-btn" onClick={handleSendMessage}>
            <Icon type="chat/send-message" />
          </button>
        </>
      </div>

      <style jsx>{`
        .chat-window {
          height: 580px;
          width: ${isSmallScreen ? 'calc(100% - 32px)' : '400px'};
          position: fixed;
          bottom: 0;
          right: 16px;
          z-index: 100;
          background: var(--background_4);
          border-radius: 6px 6px 0 0;
          box-shadow: 10px 30px 20px rgba(37, 52, 103, 0.11);
          border: 1px solid var(--separator);
          display: flex;
          flex-direction: column;
        }
        .contained-window {
          position: absolute;
          height: 100%;
          width: 100%;
          box-shadow: none;
          border: none;
          right: 0;
        }
        .emojis-root {
          position: absolute;
          top: 16px;
          left: 16px;
        }
        .account-name {
          color: var(--font_1);
          font-weight: 600;
        }
        .account-info {
          padding: 16px;
          border-radius: 6px 6px 0 0;
          background: var(--background_2);
          border-bottom: 1px solid var(--separator);
        }
        .footer {
          padding: 16px;
          background: var(--background_2);
          border-top: 1px solid var(--separator);
        }
        .picture-container {
          height: 41px;
          width: 41px;
          border-radius: 50%;
          padding: 1px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--separator);
        }
        .send-message-textarea {
          width: 100%;
          height: auto;
          border: 1px solid var(--font_1);
          border-radius: 6px;
          background: var(--background_4);
          color: var(--font_1);
          font-size: 16px;
          padding: 8px 20px;
          padding-right: 80px;
          outline: none;
          resize: none;
          border: 1px solid var(--separator);
          box-shadow: none;
          min-height: 45px;
          max-height: 90px;
        }
        .action-buttons {
          position: absolute;
          right: 16px;
          bottom: 12px;
        }
        .send-message-btn {
          height: 45px;
          width: 45px;
          padding: 0;
          margin: 0;
          display: flex;
          transition: all 0s;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--separator);
        }
        .messages-container {
          overflow-y: auto;
        }
      `}</style>
    </div>
  )
})


export default ChatWindow