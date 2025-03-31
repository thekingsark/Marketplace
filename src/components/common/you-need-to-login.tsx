import { useTranslation } from '@/app/i18n/client'
import useGlobalContext from '@/hooks/use-context'
import Link from 'next/link'
import { Icon } from './icon'

export const YouNeedToLogin = (props: { message: string }) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  return (
    <div className="root d-flex flex-column justify-content-center align-items-center">
      <div className="text-center d-flex align-items-start flex-column">
        <div className="d-flex align-items-center justify-content-start">
          <div className="mr-20">
            <Icon type="generic/login" size={48} />
          </div>
          <p className="login-msg">{props.message}</p>
        </div>
        <div className="d-flex justify-content-center align-items-center w-100">
          <Link href="/auth/login" className="w-100 mt-10" aria-label={t('auth.sign_in.sign_in')}>
            <button className="btn border-btn w-100">{t('auth.sign_in.sign_in')}</button>
          </Link>
        </div>
      </div>

      <style jsx>
        {`
          .root {
            border-radius: 6px;
          }
          .login-msg {
            font-size: 16px;
            color: var(--font_1);
            margin-bottom: 10px;
            text-align: start;
          }
        `}
      </style>
    </div>
  )
}
