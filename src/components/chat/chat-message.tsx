import Image from 'next/image'
import Link from 'next/link'
import { EMOJI_PATTERN } from './utils'
import { generateNameForAccount } from '@/utils'
import { ChatMessage } from '@/core/domain/chat-message'
import { Account } from '@/core/domain/account'
import { dir } from 'i18next'
import useGlobalContext from '@/hooks/use-context'
import { LanguageDetectorService } from '@/core/services/lang-detector'
import { Icon } from '../common/icon'
import { useState } from 'react'
import { useTranslation } from '@/app/i18n/client'
import { AssetsMessage } from './asset-message'
import { ChatMessageStatusIcon } from './chat-message-status'
import { FormattedDate } from '../common/formatted-date'
import { ChatLocationMessage } from './location-message'

export const ChatMessageItem = (props: {
  message: ChatMessage
  currentAccount: Account
  senderAccount: Account
  translateContent: () => Promise<string | null>
}) => {
  const { message, currentAccount, senderAccount } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const direction = dir(currentLanguage)
  const { t } = useTranslation(currentLanguage)

  const [displayTranslatedContent, setDisplayTranslatedContent] = useState(false)
  const [translationInProgress, setTranslationInProgress] = useState(false)
  const [translatedMessage, setTranslatedMessage] = useState('')

  const messageLanguage = LanguageDetectorService.detectLanguage(message.message)
  const shouldEnableTranslation = messageLanguage && messageLanguage !== currentLanguage

  const wrapEmojis = (text: string) => {
    return text?.replace(EMOJI_PATTERN, (match) => `<span class="emoji">${match}</span>`)
  }

  const messageContent = displayTranslatedContent ? translatedMessage : message.message
  const newContent = wrapEmojis(messageContent)

  const translateContent = async () => {
    if (displayTranslatedContent) {
      setDisplayTranslatedContent(false)
      return
    }

    if (!displayTranslatedContent && translatedMessage?.length) {
      setDisplayTranslatedContent(true)
      return
    }

    if (translationInProgress) {
      return
    }

    setTranslationInProgress(true)
    try {
      const translationResult = await props.translateContent()
      if (!translationResult) {
        return
      }

      setTranslatedMessage(translationResult)
      setDisplayTranslatedContent(true)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
    } finally {
      setTranslationInProgress(false)
    }
  }

  const renderTranslateButton = () => {
    return (
      <>
        {shouldEnableTranslation && (
          <div className="d-flex ">
            {translationInProgress ? (
              <div className="loader-wrapper">
                <Icon type="loading" size={28} />
              </div>
            ) : (
              <span className="translation-text" onClick={translateContent}>
                {displayTranslatedContent ? t('generic.see_original') : t('generic.translate')}
              </span>
            )}
          </div>
        )}
      </>
    )
  }

  const renderMessageFromCurrentAccount = () => {
    return (
      <div className="d-flex align-items-start justify-content-end gap-2" style={{ padding: 16 }}>
        <div className="d-flex flex-column align-items-end">
          <div className="d-flex align-items-center gap-2">
            <span className="fw-light message-date-container">
              <FormattedDate date={message.createdAt} format="D MMM, H:mm" />
            </span>
            <ChatMessageStatusIcon message={message} />
          </div>
          <div
            className="message-container mt-0"
            style={{
              borderRadius: direction === 'rtl' ? '0 16px 16px 16px' : '16px 0 16px 16px',
              ...(message.type !== 'text' ? { padding: 8 } : {}),
            }}
          >
            {message.type === 'text' ? (
              <span
                className="message-text"
                dangerouslySetInnerHTML={{ __html: newContent }}
              ></span>
            ) : message.type === 'location' ? (
              <ChatLocationMessage message={message} />
            ) : (
              <AssetsMessage message={message} />
            )}
            {renderTranslateButton()}
          </div>
        </div>

        <div className="message-sender-picture-container">
          <Link href={`/account/${currentAccount.id}`}>
            <Image
              src={currentAccount.picture}
              height={40}
              width={40}
              alt="account picture"
              style={{ borderRadius: '50%' }}
            />
          </Link>
        </div>
      </div>
    )
  }

  if (senderAccount?.id === currentAccount?.id) {
    return renderMessageFromCurrentAccount()
  }

  return (
    <div className="d-flex align-items-start justify-content-start" style={{ padding: 16 }}>
      <div className="message-sender-picture-container">
        <Link href={`/account/${senderAccount.id}`}>
          <Image
            src={senderAccount.picture}
            height={40}
            width={40}
            alt="account picture"
            style={{ borderRadius: '50%' }}
          />
        </Link>
      </div>

      <div className="mr-10 d-flex flex-column align-items-start ml-10">
        <div className="d-flex align-items-center">
          <Link href={`/account/${senderAccount.id}`}>
            <span className="message-sender-name">{generateNameForAccount(senderAccount)}</span>
          </Link>
          <span className="fw-light message-date-container">
            <FormattedDate date={message.createdAt} format="D MMM, H:mm" />
          </span>
        </div>
        <div
          className="message-container mt-0"
          style={{
            borderRadius: direction === 'rtl' ? '16px 0 16px 16px' : '0 16px 16px 16px',
            ...(message.type !== 'text' ? { padding: 8 } : {}),
          }}
        >
          {message.type === 'text' ? (
            <span className="message-text" dangerouslySetInnerHTML={{ __html: newContent }}></span>
          ) : message.type === 'location' ? (
            <ChatLocationMessage message={message} />
          ) : (
            <AssetsMessage message={message} />
          )}
          {renderTranslateButton()}
        </div>
      </div>
    </div>
  )
}
