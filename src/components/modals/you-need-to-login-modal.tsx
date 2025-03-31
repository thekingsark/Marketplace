'use client'

import { useTranslation } from '@/app/i18n/client'
import useGlobalContext from '@/hooks/use-context'
import Link from 'next/link'
import { CustomModal } from '../common/custom-modal'
import { Icon } from '../common/icon'

export const YouNeedToLoginModal = (props: {
  title: string
  isOpened: boolean
  close: () => void
}) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const { isOpened, title, close } = props
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
          <Icon type="generic/login" size={64} />
        </div>
        <div className="text-center d-flex align-items-start flex-column">
          <p className="login-msg">{title}</p>
          <div className="d-flex justify-content-center align-items-center w-100">
            <Link href="/auth/login" className="w-100">
              <button className="btn fill-btn w-100" aria-label={t('auth.sign_in.sign_in')}>
                {t('auth.sign_in.sign_in')}
              </button>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>
        {`
          .login-msg {
            font-size: 16px;
            color: var(--font_1);
            margin-bottom: 10px;
          }
        `}
      </style>
    </CustomModal>
  )
}
