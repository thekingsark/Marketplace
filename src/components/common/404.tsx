'use client'
import React from 'react'
import Link from 'next/link'
import errorLogo from '../../../public/assets/img/404.png'
import Image from 'next/image'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'

export const NotFoundPage = () => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  return (
    <>
      <section className="error-404-area pt-130 pb-90">
        <div className="container">
          <div className="row justify-content-center wow ">
            <div className="col-lg-8">
              <div className="error-404-wrapper pos-rel mb-40">
                <div className=" error-404-inner">
                  <div className="error-404-content text-center">
                    <div className="error-404-img mb-30">
                      <Image
                        width={500}
                        height={500}
                        style={{ width: 'auto', height: 'auto' }}
                        src={errorLogo}
                        alt="error-img"
                      />
                    </div>
                    <h4>{t('404.oops')}</h4>
                    <p className="mb-30">{t('404.page_not_found')}</p>
                    <div className="error-404-btn">
                      <Link className="fill-btn" href="/">
                        {t('404.back_to_home')}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
