'use client'
import React from 'react'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'
import { ResetPasswordForm } from './form'
import { ThemeProvider } from 'next-themes'
import { AuthController } from '@/core/controllers/auth'
import { Footer } from '@/components/footer'
import BlankHeader from '@/components/common/blank-header'

export const ForgotPasswordContent = () => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const sendResetLink = async (email: string) => {
    return AuthController.sendPasswordResetEmail(email)
  }

  return (
    <ThemeProvider defaultTheme="dark">
      <BlankHeader />
      <main className="max-width" style={{ paddingTop: 83 }}>
        <section className="pt-50 pt-sm-5 pb-50 pb-sm-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xxl-6 col-xl-7 col-lg-8 auth-card">
                <div className=" pos-rel mb-40 ">
                  <h4> {t('auth.forgot_password.title')}</h4>
                  <p className="mb-35">{t('auth.forgot_password.enter_email')}</p>
                  <ResetPasswordForm sendResetLink={sendResetLink} />
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
