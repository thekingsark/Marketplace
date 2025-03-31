'use client'
import { useFormik } from 'formik'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'
import { toast } from 'react-toastify'
import { AuthController } from '@/core/controllers/auth'
import { loginSchema } from '../login/validation-schema'
import { ErrorMessage } from '@/components/common/error-message'
import { Icon } from '@/components/common/icon'
import { useRouter } from 'next/navigation'

export const RegisterForm = () => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const router = useRouter()

  const [passwordVisible, setPasswordVisible] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [signupInProgress, setSignupInProgress] = useState(false)

  const [loginWithGoogleInProgress, setLoginWithGoogleInProgress] = useState(false)
  const [loginWithFacebookInProgress, setLoginWithFacebookInProgress] = useState(false)

  const acceptTermsRef = useRef<HTMLInputElement>(null)

  const { handleChange, handleSubmit, handleBlur, errors, values, touched } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { resetForm }) => {
      if (signupInProgress) {
        return
      }

      if (!acceptedTerms) {
        toast.error(t('info.need_to_accept_terms'))

        acceptTermsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
        return
      }

      setSignupInProgress(true)
      const result = await AuthController.signUp(values.email, values.password, acceptedTerms)
      setSignupInProgress(false)

      if (result === 'auth/email-already-in-use') {
        toast.error(t('info.credentials_exist'))
        return
      }

      if (!result) {
        toast.error(t('auth.sign_up.cannot_sign_up'))
        return
      }

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

  const goToPhoneLogin = () => {
    router.push('/auth/phone-login')
  }

  const loginWithGoogle = async () => {
    if (loginWithGoogleInProgress || loginWithFacebookInProgress) {
      return
    }

    setLoginWithGoogleInProgress(true)
    const loggedIn = await AuthController.loginWithGoogle()
    setLoginWithGoogleInProgress(false)

    if (!loggedIn) {
      toast.error(t('auth.sign_in.cannot_google_login'))
    }
  }

  const loginWithFacebook = async () => {
    if (loginWithGoogleInProgress || loginWithFacebookInProgress) {
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
              <label htmlFor="email"> {t('auth.email')}</label>
              <input
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                type="email"
                placeholder={t('auth.sign_up.email_placeholder')}
              />
              {touched.email && !!errors.email && <ErrorMessage error={errors.email} />}
            </div>
          </div>
          <div className="col-md-12">
            <div className="single-input-unit password-input">
              <label htmlFor="password">{t('auth.password')}</label>
              <input
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                type={passwordVisible ? 'text' : 'password'}
                placeholder={t('auth.sign_up.password_placeholder')}
                id="password"
              />
              {touched.password && !!errors.password && <ErrorMessage error={errors.password} />}
              <button
                onClick={(ev) => {
                  ev.stopPropagation()
                  ev.preventDefault()
                  setPasswordVisible(!passwordVisible)
                }}
                aria-label={t('See/Hide password')}
              >
                {passwordVisible ? (
                  <Icon type="auth/half-moon" size={24} color="white" />
                ) : (
                  <Icon type="auth/sun" size={24} color="white" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <div className="register-checkboxes d-flex align-items-center gap-2" onClick={() => setAcceptedTerms(!acceptedTerms)}>
            <input
              ref={acceptTermsRef}
              type="checkbox"
              checked={acceptedTerms}
              onChange={() => setAcceptedTerms(!acceptedTerms)}
            />
            <span className="oc-check-label">
              {t('auth.terms.accept')}
              <Link className="register-link" href={'/terms'}>
                {t('auth.terms.terms_of_service')}
              </Link>
              {t('auth.terms.processing')}
              <Link className="register-link" href={'/terms'}>
                {t('auth.terms.privacy')}
              </Link>
            </span>
          </div>
        </div>

        <div className="login-btn w-100 mt-30">
          <button
            className={`w-100 ${acceptedTerms ? 'fill-btn' : 'border-btn sign-up-btn'}`}
            type="submit"
            disabled={signupInProgress}
          >
            {signupInProgress ? (
              <div className="d-flex align-items-center justify-content-center">
                <Icon type={'loading'} />
              </div>
            ) : (
              t('auth.sign_up.sign_up')
            )}
          </button>

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

          <div className="note w-100 justify-content-center align-items-center d-flex">
            {t('auth.sign_up.already_member')}
            <Link className="text-btn" href="/auth/login">
              {t('auth.sign_up.sign_in')}
            </Link>
          </div>
        </div>
      </form>
    </>
  )
}
