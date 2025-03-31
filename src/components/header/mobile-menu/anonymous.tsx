import { useTranslation } from '@/app/i18n/client'
import { AppLogo } from '@/components/common/app-logo'
import { Icon } from '@/components/common/icon'
import useGlobalContext from '@/hooks/use-context'
import Link from 'next/link'

export const AnonymousMobileMenu = (props: { handleClose: () => void }) => {
  const { handleClose } = props

  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  return (
    <>
      <div className="side-info-content">
        <div className="mb-40">
          <div className="row align-items-center">
            <div className="col-9">
              <AppLogo />
            </div>
            <div className="col-3 text-end">
              <button className="side-info-close" aria-label="close" onClick={handleClose}>
                <Icon type="generic/close-filled" />
              </button>
            </div>
          </div>
        </div>
        <div className="mb-10 mobile-menu-item d-flex flex-column align-items-start">
          <div className="d-flex align-items-center gap-2">
            <Icon type="header/chat" />
            <span>{t('chat.chat')}</span>
          </div>
          <span className="mt-10 secondary-text-color">{t('anonymous.login_for_chat')}</span>
        </div>

        <div className="mb-10 mobile-menu-item d-flex flex-column align-items-start">
          <div className="d-flex align-items-center gap-2">
            <Icon type="header/heart" />
            <span>{t('bottom_nav.favourites')}</span>
          </div>
          <span className="mt-10 secondary-text-color">{t('anonymous.login_for_favourites')}</span>
        </div>
        <Link href="/auth/login">
          <button className="fill-btn w-100" aria-label={t('auth.sign_in.sign_in')}>
            {t('auth.sign_in.sign_in')}
          </button>
        </Link>
      </div>
    </>
  )
}
