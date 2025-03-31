'use client'
import { useTranslation } from '@/app/i18n/client'
import useGlobalContext from '@/hooks/use-context'
import { CustomModal } from '../common/custom-modal'
import { Icon } from '../common/icon'
import { useEffect, useState } from 'react'
import {
  FacebookShareButton,
  FacebookMessengerShareButton,
  TelegramShareButton,
  TelegramIcon,
  TwitterShareButton,
  XIcon,
  FacebookMessengerIcon,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
  RedditShareButton,
  RedditIcon,
} from 'react-share'

export const ShareModal = (props: {
  url: string
  title: string
  isOpened: boolean
  close: () => void
}) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)
  const { title, isOpened, close } = props

  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(`${window.location.origin}${props.url}`)
  }, [props.url])

  return (
    <CustomModal
      open={isOpened}
      onClose={close}
      styles={{
        modal: {
          maxWidth: '550px',
          backgroundColor: 'var(--background_2)',
        },
        overlay: {
          background: 'rgba(0, 0, 0, 0.5)',
        },
      }}
      classNames={{
        modal: 'info-modal',
      }}
      closeIcon={<Icon type="generic/close-filled" />}
      center
    >
      <h4>{t('share.button')}</h4>

      <div className="share-items-root">
        <div className="share-item">
          <FacebookShareButton
            url={url}
            className="w-100 d-flex align-items-center justify-content-start gap-2"
          >
            <FacebookIcon size={32} round />
            <span className="entity-name">{t('share.share_on', { name: 'Facebook' })}</span>
          </FacebookShareButton>
        </div>

        {!!process.env.NEXT_PUBLIC_FACEBOOK_APP_ID?.length && (
          <div className="share-item">
            <FacebookMessengerShareButton
              url={url}
              className="w-100 d-flex align-items-center justify-content-start gap-2"
              appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID ?? ''}
            >
              <FacebookMessengerIcon size={32} round />
              <span className="entity-name">
                {t('share.share_on', { name: 'Messenger' })}{' '}
              </span>
            </FacebookMessengerShareButton>
          </div>
        )}

        <div className="share-item">
          <TwitterShareButton
            url={url}
            className="w-100 d-flex align-items-center justify-content-start gap-2"
            title={title}
          >
            <XIcon size={32} round />
            <span className="entity-name">{t('share.share_on', { name: 'X' })}</span>
          </TwitterShareButton>
        </div>

        <div className="share-item">
          <TelegramShareButton
            url={url}
            className="w-100 d-flex align-items-center justify-content-start gap-2"
            title={title}
          >
            <TelegramIcon size={32} round />
            <span className="entity-name">{t('share.share_on', { name: 'Telegram' })}</span>
          </TelegramShareButton>
        </div>

        <div className="share-item">
          <WhatsappShareButton
            url={url}
            className="w-100 d-flex align-items-center justify-content-start gap-2"
            title={title}
            separator=":: "
          >
            <WhatsappIcon size={32} round />
            <span className="entity-name">{t('share.share_on', { name: 'Whatsapp' })} </span>
          </WhatsappShareButton>
        </div>

        <div className="share-item">
          <LinkedinShareButton
            url={url}
            title={title}
            className="w-100 d-flex align-items-center justify-content-start gap-2"
          >
            <LinkedinIcon size={32} round />
            <span className="entity-name">{t('share.share_on', { name: 'LinkedIn' })} </span>
          </LinkedinShareButton>
        </div>

        <div className="share-item">
          <RedditShareButton
            url={url}
            className="w-100 d-flex align-items-center justify-content-start gap-2"
            title={title}
            windowWidth={660}
            windowHeight={460}
          >
            <RedditIcon size={32} round />
            <span className="entity-name">{t('share.share_on', { name: 'Reddit' })} </span>
          </RedditShareButton>
        </div>
      </div>
    </CustomModal>
  )
}
