'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { hasCookie, setCookie } from 'cookies-next'
import { useTranslation } from '@/app/i18n/client'

export const CookieConsent = ({ lang }: { lang: string }) => {
  const { t } = useTranslation(lang)
  const [showConsent, setShowConsent] = useState(true)

  useEffect(() => {
    const hasCookieSet = hasCookie('localConsent')
    setShowConsent(hasCookieSet)
  }, [])

  const acceptCookie = () => {
    setShowConsent(true)
    setCookie('localConsent', 'true', {})
  }

  if (showConsent) {
    return null
  }

  return (
    <div
      className="cookies-root d-flex align-items-center justify-content-between"
      style={{
        position: 'fixed',
        zIndex: 99999,
        bottom: 0,
        left: 0,
        right: 0,
        background: 'black',
      }}
    >
      <div className="flex items-center">
        <span className="cookie-msg">{t('cookie.message')}</span>
        <div className="mr-[14px]">
          <Link href={`/${lang}/terms`}>
            <span className="cookie-link">{t('cookie.readMore')}</span>
          </Link>
        </div>
      </div>
      <button
        className="btn btn-primary"
        onClick={() => acceptCookie()}
        aria-label={t('cookie.accept')}
      >
        <span className="white-text-body dark:dark-text-body">{t('cookie.accept')}</span>
      </button>

      <style jsx>{`
        .cookies-root {
          padding: 8px 16px;
          position: fixed;
          z-index: 99999;
          bottom: 0;
          left: 0;
          right: 0;
          background: black;
        }
        .cookie-msg {
          color: white;
          font-size: 14px;
        }
        .cookie-link {
          color: white;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
        }
      `}</style>
    </div>
  )
}
