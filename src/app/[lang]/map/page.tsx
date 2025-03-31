import { PageWrapper } from '@/components/page-wrapper'
import { AuctionsMapRoot } from './root'
import { SEO } from '@/constants'
import { Metadata } from 'next'
import { useTranslation } from '../../../i18n/index'
import { Suspense } from 'react'

const getAuctionMapClusters = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auction-map`, {
      next: { revalidate: 0 },
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }

    return response.json()
  } catch (error) {
    console.error(`Failed to fetch categories: ${error}`)
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lang)

  const title = t('pageSEO.auctions_map')
  const description = t('pageSEO.auctions_map_description')

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
          url: SEO.IMAGE_URL,
          width: 300,
          height: 300,
          alt: title,
        },
      ],
    },
  }
}

export default async function AuctionsMapPage() {
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY
  const mapClusters = await getAuctionMapClusters()
  return (
    <>
      <PageWrapper>
        <Suspense>
          <AuctionsMapRoot apiKey={googleMapsApiKey ?? ''} auctionsMapClusters={mapClusters} />
        </Suspense>
      </PageWrapper>
    </>
  )
}
