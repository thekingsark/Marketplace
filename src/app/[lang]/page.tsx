import { PageWrapper } from '@/components/page-wrapper'
import { Metadata } from 'next'
import { useTranslation } from '../i18n/index'
import { SEO, SESSION_COOKIE_NAME } from '@/constants'
import { RecommendationsSection } from '@/components/home-page/recommended-auctions'
import { AuctionsSection } from '@/components/home-page/auctions-section'
import { cookies } from 'next/headers'
import { CategoriesSection } from '@/components/home-page/categories'
import { headers } from 'next/headers'
import { AuctionsOnMapCard } from '@/components/home-page/auctions-on-map-card'
import { PromotedAuctionsSection } from '@/components/home-page/promoted-auctions'
import { LastSeenAuctionsSection } from '@/components/home-page/last-seen-auctions'
import { StartingSoonAuctionsSection } from '@/components/home-page/starting-soon-auctions'

const getAuctions = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auction/latest`, {
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

const getPromotedAuctions = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auction/filter/auctions`, {
      next: { revalidate: 100 },
      body: JSON.stringify({ promotedOnly: true, perPage: 6 }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }

    return response.json()
  } catch (error) {
    console.error(`Failed to fetch promoted auctions: ${error}`)
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

const getRecommendations = async () => {
  const loadedCookies = await cookies()
  const session = loadedCookies.get(SESSION_COOKIE_NAME)?.value || ''
  if (!session) {
    return []
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auction-similarities`, {
      method: 'POST',
      body: JSON.stringify({ page: 0, perPage: 8 }),
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        Authorization: session,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      return []
    }

    return response.json()
  } catch (error) {
    console.error(`Failed to fetch recommendations: ${error}`)
    return []
  }
}

const getStartingSoonAuctions = async () => {
  const loadedCookies = await cookies()
  const session = loadedCookies.get(SESSION_COOKIE_NAME)?.value || ''
  if (!session) {
    return []
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auction/filter/auctions`, {
      method: 'POST',
      body: JSON.stringify({ perPage: 6, started: false }),
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        Authorization: session,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      return []
    }

    return response.json()
  } catch (error) {
    console.error(`Failed to fetch recommendations: ${error}`)
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lang)

  const title = t('pageSEO.home_title')
  const description = t('pageSEO.home_description')

  return {
    title,
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

export default async function Home() {
  const [auctions, promotedAuctions, activeAuctionsCount, recommendations, startingSoon] = await Promise.all([
    getAuctions(),
    getPromotedAuctions(),
    countActiveAuctions(),
    getRecommendations(),
    getStartingSoonAuctions(),
  ])

  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = /mobile|iPhone|iPad|iPod|Android/i.test(userAgent)

  return (
    <>
      <PageWrapper>
        <CategoriesSection activeAuctionsCount={activeAuctionsCount.count} isMobile={isMobile} />
        <AuctionsSection auctions={auctions} activeAuctionsCount={activeAuctionsCount.count} />
        <RecommendationsSection recommendations={recommendations} />
        <AuctionsOnMapCard />
        <StartingSoonAuctionsSection auctions={startingSoon} />
        <PromotedAuctionsSection auctions={promotedAuctions} />
        <LastSeenAuctionsSection />
      </PageWrapper>
    </>
  )
}
