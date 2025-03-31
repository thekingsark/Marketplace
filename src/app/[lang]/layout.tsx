import { ToastContainer } from 'react-toastify'
import { useTranslation } from '../i18n/index'
import { dir } from 'i18next'
import { CookieConsent } from '@/components/common/cookie-consent'
import { RootApp } from './root'
import { Nunito_Sans, Abril_Fatface } from 'next/font/google'

import 'react-toastify/dist/ReactToastify.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-loading-skeleton/dist/skeleton.css'
import '@smastrom/react-rating/style.css'

import '../css/globals.css'
import '../css/spacing.css'
import '../css/icon.css'
import '../scss/index.scss'

import 'react-responsive-modal/styles.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

import { Metadata } from 'next'
import AppProvider from '@/app/app-provider'
import { fallbackLng, languages } from '../i18n/settings'
import BootstrapClient from '@/components/common/bootstrap-client'
import { getCategories, getSettings, getCurrencies, getPaymentProducts, getExchangeRates, getAvailablePayments } from './common-fetch'
import { AppIntro } from '@/components/intro'
import { ChatRoot } from '@/components/chat'
import { NotificationsSW } from '@/components/notifications-sw'

const YOUR_DOMAIN_URL = 'https://YOUR_DOMAIN_URL'
export const metadata: Metadata = {
  alternates: {
    canonical: 'YOUR_IMAGE_URL',
    languages: languages.reduce((acc: Record<string, string>, lang) => {
      acc[lang] = `${YOUR_DOMAIN_URL}/${lang}/`
      return acc
    }, {}),
  },
}

export async function generateStaticParams() {
  return languages.map((locale) => ({
    lang: locale,
  }))
}

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
})

const abrilFatface = Abril_Fatface({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-abril-fatface',
})

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string | undefined }
}) {
  let { lang } = await params
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lang)

  const [settings, categories, currencies, exchangeRates, paymentProducts, availablePayments] = await Promise.all([
    getSettings(),
    getCategories(),
    getCurrencies(),
    getExchangeRates(),
    getPaymentProducts(),
    getAvailablePayments()
  ])

  if (languages.indexOf(lang ?? '') === -1) {
    lang = fallbackLng
  }

  return (
    <>
      <html
        lang={lang}
        dir={dir(lang)}
        suppressHydrationWarning={true}
        style={{ overflowX: 'hidden' }}
      >
        <head>
          <meta name="description" content={t('description')} />
          <meta property="og:description" content={t('description')} />

          <link rel="shortcut icon" href="/assets/img/favicon.ico" />
          {languages.map((locale) => (
            <link
              key={locale}
              rel="alternate"
              hrefLang={locale}
              href={`${YOUR_DOMAIN_URL}/${locale}/`}
            />
          ))}
          <meta property="og:url" content={YOUR_DOMAIN_URL} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, viewport-fit=cover"
          />
          <meta name="keywords" content="auctions, bids and more" />
        </head>

        <body
          className={`body-bg  ${abrilFatface.variable} ${nunitoSans.className}`}
          suppressHydrationWarning={true}
          style={{ overflowX: 'hidden', overflow: 'unset' }}
        >
          <AppProvider
            lang={lang as string}
            settings={settings}
            categories={categories}
            currencies={currencies}
            exchangeRate={exchangeRates}
            paymentProducts={paymentProducts}
            availablePayments={availablePayments?.payments}
          >
            <RootApp> {children}</RootApp>
            <AppIntro />
            <ChatRoot />
          </AppProvider>
          <ToastContainer
            position="bottom-right"
            theme="dark"
            style={{ fontSize: 14, fontFamily: '$nunitoSans' }}
          />
          <CookieConsent lang={lang as string} />
          <BootstrapClient />
          <NotificationsSW vapidPublicKey={process.env.VAPID_PUBLIC_KEY as string} />
        </body>
      </html>
    </>
  )
}
