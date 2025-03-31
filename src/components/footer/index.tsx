'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'
import { ChangeLanguageButton } from './change-lang-button'
import ThemeChanger from './change-theme-button'
import { TUTORIAL_LINKS } from '@/constants'
import { DownloadAppButtons } from './download-app-buttons'
import { AppLogo } from '../common/app-logo'
import { HowItWorksModal } from '../intro/how-it-works'
import { ChangeCurrencyButton } from './change-currency-button'

export const Footer = () => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const [howItWorksModalOpened, setHowItWorksModalOpened] = useState(false)

  return (
    <footer className="footer-bg pl-10 pr-10">
      <section className="pt-100 pb-50">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="footer-widget mb-40">
                <div className=" mb-30">
                  <AppLogo />
                </div>
                <span>{t('footer.about_motto')}</span>
                <div className="mb-10 d-flex align-items-center gap-2 mt-10">
                  <ChangeLanguageButton />
                  <ThemeChanger />
                </div>
                <div>
                  <ChangeCurrencyButton />
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="footer-widget footer-second-col mb-40">
                <div className="footer-widget-title">
                  <h1> {t('footer.tutorial')} </h1>
                </div>
                <ul>
                  <li>
                    <span className="cursor-pointer" onClick={() => setHowItWorksModalOpened(true)}>
                      {t('intro.how_it_works')}
                    </span>
                  </li>
                  <li>
                    <Link target="_blank" href={TUTORIAL_LINKS.CREATE_AUCTION}>
                      {t('footer.create_auction')}
                    </Link>
                  </li>
                  <li>
                    <Link target="_blank" href={TUTORIAL_LINKS.CREATE_BID}>
                      {t('footer.create_bid')}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="footer-widget footer-third-col mb-40">
                <div className="footer-widget-title">
                  <h1>{t('footer.about')}</h1>
                </div>
                <ul>
                  <li>
                    <Link href={`/terms`}>{t('footer.privacy_policy')}</Link>
                  </li>
                  <li>
                    <Link href={`/terms`}>{t('footer.terms_of_service')}</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="footer-widget footer-fourth-col mb-40">
                <div className="footer-widget-title mb-20">
                  <h1>{t('footer.mobile_app')}</h1>
                  <span className="">{t('footer.enjoy_better_experience')}</span>
                </div>
                <DownloadAppButtons />
              </div>
            </div>
          </div>
        </div>
      </section>

      <HowItWorksModal
        isOpened={howItWorksModalOpened}
        skip={() => setHowItWorksModalOpened(false)}
        finish={() => setHowItWorksModalOpened(false)}
      />
    </footer>
  )
}
