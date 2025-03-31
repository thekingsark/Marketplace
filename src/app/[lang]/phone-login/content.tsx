'use client'
import React, { useState } from 'react'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'
import { PhoneLoginForm } from './number-form'
import { ThemeProvider } from 'next-themes'
import { Footer } from '@/components/footer'
import BlankHeader from '@/components/common/blank-header'
import { OtpCheckForm } from './otp-form'

export const PhoneLoginContent = () => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const [codeSent, setCodeSent] = useState(false)

  return (
    <ThemeProvider defaultTheme="dark">
      <BlankHeader />
      <main className="max-width" style={{ paddingTop: 83 }}>
        <section className="pt-50 pt-sm-5 pb-50 pb-sm-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xxl-6 col-xl-7 col-lg-8 auth-card">
                <div className=" pos-rel mb-40 ">
                  <h4> {t(codeSent ? 'phone_sign_in.verify_otp' : 'phone_sign_in.title')}</h4>
                  <p className="mb-35">{t(codeSent ? 'phone_sign_in.we_sent_code' : 'phone_sign_in.description')}</p>
                  {codeSent ? <OtpCheckForm /> : <PhoneLoginForm onSuccess={() => setCodeSent(true)} />}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </ThemeProvider>
  )
}
