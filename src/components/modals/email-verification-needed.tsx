'use client'

import { useTranslation } from '@/app/i18n/client'
import { CustomModal } from '@/components/common/custom-modal'
import { Icon } from '@/components/common/icon'
import { AuthService } from '@/core/services/auth'
import useGlobalContext from '@/hooks/use-context'
import { useState } from 'react'
import { toast } from 'react-toastify'

export const EmailVerificationNeeded = (props: {
  isOpened: boolean
  close: () => void
  onValidated: () => void
}) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const appSettings = globalContext.appSettings
  const { t } = useTranslation(currentLanguage)

  const { isOpened, close } = props

  const [sendLinkInProgress, setSendLinkInProgress] = useState(false)
  const [verifyInProgress, setVerifyInProgress] = useState(false)

  const handleSendLink = async () => {
    if (sendLinkInProgress) {
      return
    }

    setSendLinkInProgress(true)

    try {
      const sent = await AuthService.resendEmailVerification()
      if (sent) {
        toast.success(t('verify_email.link_sent'))
      } else {
        toast.error(t('verify_email.could_not_send_link'))
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      toast.error(t('verify_email.could_not_send_link'))
    } finally {
      setSendLinkInProgress(false)
    }
  }

  const handleVerify = async () => {
    if (verifyInProgress) {
      return
    }

    setVerifyInProgress(true)

    try {
      await AuthService.reloadAuthUser()
      const isVerified = await AuthService.userHasEmailVerified(appSettings)
      if (isVerified) {
        toast.success(t('verify_email.email_verified'))
        close()
        props.onValidated()
      } else {
        toast.error(t('verify_email.your_email_is_not_verified'))
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error(t('verify_email.your_email_is_not_verified'))
    } finally {
      setVerifyInProgress(false)
    }
  }

  return (
    <CustomModal
      open={isOpened}
      onClose={close}
      styles={{
        modal: {
          maxWidth: '380px',
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
      <div className="root mt-20 d-flex flex-column justify-content-center align-items-center">
        <div className="mr-20">
          <Icon type="generic/email" size={64} />
        </div>
        <div className="text-center d-flex align-items-center flex-column">
          <p className="title">{t('verify_email.title')}</p>
          <p className="mt-20">{t('verify_email.we_sent_email')}</p>
          <p>{t('verify_email.didn_t_receive_email')}</p>

          <span className="blue-text cursor-pointer send-link-btn" onClick={handleSendLink}>
            {sendLinkInProgress ? <Icon type="generic/loading" /> : t('verify_email.send_again')}
          </span>
          <div className="d-flex justify-content-center align-items-center w-100 mt-30 gap-2">
            <button
              className="btn border-btn w-100"
              aria-label={t('generic.cancel')}
              onClick={close}
            >
              {t('generic.cancel')}
            </button>
            <button
              disabled={verifyInProgress || sendLinkInProgress}
              className="btn fill-btn w-100"
              aria-label={t('verify_email.verified')}
              onClick={handleVerify}
            >
              {verifyInProgress ? <Icon type="generic/loading" /> : t('verify_email.verified')}
            </button>
          </div>
        </div>
      </div>

      <style jsx>
        {`
          .title {
            font-size: 24px;
            font-weight: 600;
            text-align: center;
            color: var(--font_1);
            margin-bottom: 10px;
          }
          .send-link-btn {
            height: 35px;
          }
        `}
      </style>
    </CustomModal>
  )
}
