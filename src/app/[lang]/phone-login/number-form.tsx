'use client'

import { useTranslation } from '@/app/i18n/client'
import useGlobalContext from '@/hooks/use-context'
import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import Link from 'next/link'
import { ErrorMessage } from '@/components/common/error-message'
import { Icon } from '@/components/common/icon'
import { resetPassSchema } from '../login/validation-schema'
import { PhoneInput } from 'react-international-phone'
import { PhoneNumberUtil } from 'google-libphonenumber'

import 'react-international-phone/style.css'
import { AuthController } from '@/core/controllers/auth'
import { toast } from 'react-toastify'

export const PhoneLoginForm = (props: { onSuccess: () => void }) => {
  const { onSuccess } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const [sendCodeInProgress, setCodeSendInProgress] = useState(false)
  const [isPhoneValid, setIsPhoneValid] = useState(false)
  const [captchaId, setCaptchaId] = useState(0)

  const checkIfPhoneValid = (phone: string) => {
    try {
      const phoneUtil = PhoneNumberUtil.getInstance()
      const parsedPhone = phoneUtil.parseAndKeepRawInput(phone)
      return phoneUtil.isValidNumber(parsedPhone)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      return false
    }
  }

  const { handleChange, values } = useFormik({
    initialValues: {
      phone: '',
    },
    validationSchema: resetPassSchema,
    onSubmit: (_values, { resetForm }) => {
      resetForm()
    },
  })

  useEffect(() => {
    setIsPhoneValid(checkIfPhoneValid(values.phone))
  }, [values.phone])

  const handleChangePhone = (phone: string) => {
    setIsPhoneValid(checkIfPhoneValid(phone))
    handleChange({ target: { name: 'phone', value: phone } })
  }

  const handleSubmitPhone = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    ev.stopPropagation()
    ev.nativeEvent.stopImmediatePropagation()

    if (sendCodeInProgress) {
      return
    }

    if (!isPhoneValid) {
      toast.error(t('phone_sign_in.phone_invalid'))
      return
    }

    setCodeSendInProgress(true)
    const result = await AuthController.loginWithPhoneNumber(
      values.phone,
      `recaptcha-container-${captchaId}`
    )

    setCodeSendInProgress(false)

    if (!result) {
      toast.error(t('phone_sign_in.could_not_sign_in'))
      setCaptchaId(captchaId + 1)
      return
    }

    onSuccess()
  }

  return (
    <>
      <form onSubmit={handleSubmitPhone} className="login-form" action="#">
        <div className="row">
          <div className="col-md-12">
            <div className="single-input-unit">
              <PhoneInput defaultCountry={'ro'} value={values.phone} onChange={handleChangePhone} />
            </div>
          </div>
        </div>
        <div id={`recaptcha-container-${captchaId}`}></div>
        {values.phone.length > 3 && !isPhoneValid && (
          <ErrorMessage error={t('phone_sign_in.phone_invalid')} />
        )}
        <p className="mt-10 mb-30">{t('phone_sign_in.you_will_receive')}</p>
        <div className="login-btn">
          <button
            type="submit"
            disabled={sendCodeInProgress}
            className={`${isPhoneValid ? 'fill-btn' : 'border-btn sign-up-btn'} w-100`}
          >
            {sendCodeInProgress ? (
              <div className="loader-wrapper">
                <Icon type="loading" color={'#fff'} size={40} />
              </div>
            ) : (
              t('phone_sign_in.send_code')
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
