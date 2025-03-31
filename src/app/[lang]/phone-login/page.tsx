import React from 'react'
import { PhoneLoginContent } from './content'
import { Metadata } from 'next'
import { SEO } from '@/constants'
import { useTranslation } from '@/app/i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lang)

  const title = t('pageSEO.phone_login_title')
  const description = t('pageSEO.phone_login_description')

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: SEO.IMAGE_URL,
          width: 300,
          height: 300,
          alt: title,
        },
      ],
    },
    twitter: {
      title,
      description,
      images: [
        {
          url: SEO.TWITTER_IMAGE_URL,
          width: 300,
          height: 300,
          alt: title,
        },
      ],
    },
  }
}

const ForgotPasswordPage = () => {
  return <PhoneLoginContent />
}

export default ForgotPasswordPage
