import React from 'react'
import { NotFoundPage } from '@/components/common/404'
import { Metadata } from 'next'
import { useTranslation } from '../../i18n/index'
import { SEO } from '@/constants'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lang)

  const title = t('pageSEO.not_found_title')
  const description = t('pageSEO.not_found_description')

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

const GlobalErrorPage = () => {
  return (
    <>
      <main>
        <NotFoundPage />
      </main>
    </>
  )
}

export default GlobalErrorPage

