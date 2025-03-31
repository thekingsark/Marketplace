import { Metadata } from 'next'
import { PageWrapper } from '@/components/page-wrapper'
import { useTranslation } from '../../i18n/index'
import { SEO } from '@/constants'
import { AllAuctionsListRoot } from './root'
import { Suspense } from 'react'

const getAllLocations = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/location/all`, {
      next: { revalidate: 0 },
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }

    return response.json()
  } catch (error) {
    console.error(`Failed to fetch locations: ${error}`)
    return []
  }
}

const countActiveAuctions = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auction/filter/count`, {
      next: { revalidate: 0 },
      method: 'POST',
      body: JSON.stringify({ active: true }),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }

    return response.json()
  } catch (error) {
    console.error(`Failed to fetch categories: ${error}`)
    return 0
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

  const title = t('pageSEO.auctions_list_title')
  const description = t('pageSEO.auctions_list_description')

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

const AllAuctionsList = async () => {
  const [locations, activeAuctionsCount] = await Promise.all([
    getAllLocations(),
    countActiveAuctions(),
  ])
  return (
    <PageWrapper>
      <Suspense fallback={null}>
        <AllAuctionsListRoot
          locations={locations}
          activeAuctionsCount={activeAuctionsCount.count}
        />
      </Suspense>
    </PageWrapper>
  )
}

export default AllAuctionsList
