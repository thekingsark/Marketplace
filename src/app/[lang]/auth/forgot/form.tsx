'use client'

import { useTranslation } from '@/app/i18n/client'
import useGlobalContext from '@/hooks/use-context'
import { useState } from 'react'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { ErrorMessage } from '@/components/common/error-message'
import { Icon } from '@/components/common/icon'
import { resetPassSchema } from '../login/validation-schema'

export const ResetPasswordForm = (props: {
  sendResetLink: (email: string) => Promise<boolean>
}) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const [resetInProgress, setResetInProgress] = useState(false)

  const resetPassword = async () => {
    if (resetInProgress) {
      return
    }

    setResetInProgress(true)
    const sent = await props.sendResetLink(values.email)
    setResetInProgress(false)

    if (!sent) {
      toast.error(t('auth.forgot_password.could_not_send_email'))
    } else {
      toast.success(t('auth.forgot_password.email_sent'))
    }
  }

  const { handleChange, handleSubmit, handleBlur, errors, values, touched } = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: resetPassSchema,
    onSubmit: (values, { resetForm }) => {
      resetPassword()
      resetForm()
    },
  })

  return (
    <>
      <form onSubmit={handleSubmit} className="login-form" action="#">
        <div className="row">
          <div className="col-md-12">
            <div className="single-input-unit">
              <input
                name="email"
                autoComplete="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                type="email"
                placeholder={t('auth.sign_in.enter_email')}
              />
              {touched.email && errors.email && <ErrorMessage error={errors.email} />}
            </div>
          </div>
        </div>

        <p>{t('auth.forgot_password.you_will_receive')}</p>

        <div className="login-btn">
          <button type="submit" disabled={resetInProgress} className="fill-btn w-100">
            {resetInProgress ? (
              <div className="loader-wrapper">
                <Icon type="loading" color={'#fff'} size={40} />
              </div>
            ) : (
              t('auth.forgot_password.reset')
            )}
          </button>
        </div>

        <div className="login-btn mt-20">
          <div className="note">
            <Link
              className="text-btn d-flex justify-content-center align-content-center"
              href="/auth/login"
            >
              {t('auth.sign_in.sign_in')}
            </Link>
          </div>
        </div>

        <style jsx>{`
          .loader-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}</style>
      </form>
    </>
  )
}
