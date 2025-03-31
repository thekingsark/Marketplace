'use client'
import React from 'react'
import { RegisterForm } from './form'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'
import { ThemeProvider } from 'next-themes'
import BlankHeader from '@/components/common/blank-header'
import { Footer } from '@/components/footer'

export const SignUpContent = () => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  return (
    <ThemeProvider defaultTheme="dark">
      <BlankHeader />
      <main className="max-width" style={{ paddingTop: 83 }}>
        <section className=" pt-sm-5 pb-50 pb-sm-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xxl-6 col-xl-7 col-lg-8 auth-card">
                <div className=" pos-rel mb-40 ">
                  <h1>{t('auth.sign_up.sign_up')}</h1>
                  <p className="mb-35">{t('auth.sign_up.lets_create_acc')}</p>
                  <RegisterForm />
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
