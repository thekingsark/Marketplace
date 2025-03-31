'use client'

import { useTranslation } from '@/app/i18n/client'
import useGlobalContext from '@/hooks/use-context'
import { useState } from 'react'
import Link from 'next/link'
import { Icon } from '@/components/common/icon'
import OtpInput from 'react-otp-input';

import { AuthController } from '@/core/controllers/auth'
import { toast } from 'react-toastify'

export const OtpCheckForm = () => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const [verifyInProgress, setVerifyInProgress] = useState(false)
  const [otp, setOtp] = useState('')

  const handleSubmitOtp = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    ev.stopPropagation()
    ev.nativeEvent.stopImmediatePropagation()

    if (verifyInProgress) {
      return
    }

    if (otp.length !== 6) {
      return
    }

    setVerifyInProgress(true)
    const result = await AuthController.submitPhoneNumberOtp(otp)
    setVerifyInProgress(false)

    if (!result) {
      toast.error(t('phone_sign_in.otp_invalid'))
      return
    }

    window.location.href = '/'
  }

  return (
    <>
      <form onSubmit={handleSubmitOtp} className="login-form" action="#">
        <div className="row">
          <div className="col-md-12">
            <div className="single-input-unit">
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                containerStyle={{ justifyContent: 'space-between' }}
                renderSeparator={<span>{' '}</span>}
                renderInput={(props) => <input {...props} style={{ width: 60, textAlign: 'center', borderBottom: '10px solid var(--background_3)' }} />}
              />
            </div>
          </div>
        </div>

        <div className="login-btn">
          <button
            type="submit"
            disabled={verifyInProgress}
            className={`${otp.length === 6 ? 'fill-btn' : 'border-btn sign-up-btn'} w-100`}
          >
            {verifyInProgress ? (
              <div className="loader-wrapper">
                <Icon type="loading" color={'#fff'} size={40} />
              </div>
            ) : (
              t('phone_sign_in.verify_otp')
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
