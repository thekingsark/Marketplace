'use client '

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'
import { toast } from 'react-toastify'
import { loginSchema } from './validation-schema'
import { Icon } from '@/components/common/icon'
import { ErrorMessage } from '@/components/common/error-message'
import { AuthController } from '@/core/controllers/auth'
import { useRouter } from 'next/navigation'

const LoginForm = () => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)
  const router = useRouter()

  const [loginWithPassInProgress, setLoginWithPassInProgress] = useState(false)
  const [loginWithGoogleInProgress, setLoginWithGoogleInProgress] = useState(false)
  const [loginWithFacebookInProgress, setLoginWithFacebookInProgress] = useState(false)

  const [passwordVisible, setPasswordVisible] = useState(false)

  const { handleChange, handleSubmit, handleBlur, errors, values, touched } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: (values, { resetForm }) => {
      loginWithEmailAndPassword()
      resetForm()
    },
  })

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        event.preventDefault()
        handleSubmit()
      }
    }
    document.addEventListener('keydown', listener)
    return () => {
      document.removeEventListener('keydown', listener)
    }
  })

  const loginWithEmailAndPassword = async () => {
    if (loginWithPassInProgress || loginWithGoogleInProgress || loginWithFacebookInProgress) {
      return
    }

    setLoginWithPassInProgress(true)
    const loggedIn = await AuthController.loginWithEmailAndPassword(values.email, values.password)
    setLoginWithPassInProgress(false)

    if (!loggedIn) {
      toast.error(t('auth.sign_in.cannot_email_login'))
    }
  }

  const loginWithGoogle = async () => {
    if (loginWithPassInProgress || loginWithGoogleInProgress || loginWithFacebookInProgress) {
      return
    }

    setLoginWithGoogleInProgress(true)
    const loggedIn = await AuthController.loginWithGoogle()
    setLoginWithGoogleInProgress(false)

    if (!loggedIn) {
      toast.error(t('auth.sign_in.cannot_google_login'))
    }
  }

  const goToPhoneLogin = () => {
    router.push('/auth/phone-login')
  }

  const loginWithFacebook = async () => {
    if (loginWithPassInProgress || loginWithGoogleInProgress || loginWithFacebookInProgress) {
      return
    }

    setLoginWithFacebookInProgress(true)
    const loggedIn = await AuthController.loginWithFacebook()
    setLoginWithFacebookInProgress(false)

    if (!loggedIn) {
      toast.error(t('auth.sign_in.cannot_facebook_login'))
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="login-form" action="#">
        <div className="row">
          <div className="col-md-12">
            <div className="single-input-unit">
              <label htmlFor="email">{t('auth.email')}</label>
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

          <div className="col-md-12">
            <div className="single-input-unit password-input">
              <label htmlFor="password">{t('auth.password')}</label>
              <input
                name="password"
                value={values.password}
                autoComplete="current-password"
                onChange={handleChange}
                onBlur={handleBlur}
                type={passwordVisible ? 'text' : 'password'}
                placeholder={t('auth.sign_in.enter_password')}
                id="password"
              />
              {touched.password && errors.password && <ErrorMessage error={errors.password} />}
              <button
                onClick={(ev) => {
                  ev.stopPropagation()
                  ev.preventDefault()
                  setPasswordVisible(!passwordVisible)
                }}
              >
                {passwordVisible ? (
                  <Icon type="auth/half-moon" size={24} color="var(--font_1)" />
                ) : (
                  <Icon type="auth/sun" size={24} color="var(--font_1)" />
                )}
              </button>
            </div>
          </div>

          <div className="col-md-12 forgot-password">
            <Link href={'/auth/forgot'}>
              <span> {t('auth.sign_in.forgot_password')}</span>
            </Link>
          </div>
        </div>

        <div className="login-btn">
          <button type="submit" disabled={loginWithPassInProgress} className="fill-btn w-100">
            {loginWithPassInProgress ? (
              <div className="loader-wrapper">
                <Icon type="loading" color={'#fff'} size={40} />
              </div>
            ) : (
              t('auth.sign_in.sign_in')
            )}
          </button>
        </div>
      </form>

      <div className="continue-with-social">
        <div className="col-md-12 continue-with-label">
          <div className="gradient-container col-md-4"></div>
          <span>{t('auth.sign_in.continue_with')}</span>
          <div className="gradient-container right-gradient-container col-md-4"></div>
        </div>
        <div className="social-btn col-lg-8 col-md-10 col-sm-12 col-12">
          <button onClick={() => loginWithGoogle()} disabled={loginWithGoogleInProgress}>
            {loginWithGoogleInProgress ? (
              <div className="loader-wrapper">
                <Icon type="loading" color={'#fff'} size={40} />
              </div>
            ) : (
              <Icon type="social/search" size={40} />
            )}
          </button>

          <button onClick={() => goToPhoneLogin()} >
            <Icon type="social/call" size={40} />
          </button>

          <button onClick={() => loginWithFacebook()} disabled={loginWithFacebookInProgress}>
            {loginWithFacebookInProgress ? (
              <div className="loader-wrapper">
                <Icon type="loading" color={'#fff'} size={40} />
              </div>
            ) : (
              <Icon type="social/facebook" size={40} />
            )}
          </button>
        </div>
      </div>

      <div className="login-btn">
        <div className="note">
          {t('auth.sign_in.not_a_member')}
          <Link className="text-btn" href="/auth/register">
            {t('auth.sign_in.register_now')}
          </Link>
        </div>
      </div>
    </>
  )
}

export default LoginForm
