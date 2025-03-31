//@refresh

import React from 'react'
import { Metadata } from 'next'
import { PageWrapper } from '@/components/page-wrapper'
import { SEO } from '@/constants'
import { useTranslation } from '../../i18n/index'
import { AuctionForm } from '../../../components/auction-form'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lang)

  const title = t('pageSEO.create_auction_title')
  const description = t('pageSEO.create_auction_description')

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

const CreateAuction = async ({ params }: { params: Promise<{ id: string; lang: string }> }) => {
  const { lang } = await params
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lang)
  return (
    <PageWrapper>
      <div
        className="create-auction-root col-12 col-xl-6 col-lg-6 col-md-10 mb-50 mt-30 mt-sm-5 pl-20 pr-20"
        style={{ marginLeft: 'auto', marginRight: 'auto' }}
      >
        <h1>{t('create_auction.create_auction')}</h1>
        <AuctionForm />
      </div>
    </PageWrapper>
  )
}

export default CreateAuction
