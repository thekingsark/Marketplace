import { Metadata } from 'next'
import { SEO, SESSION_COOKIE_NAME } from '@/constants'
import { cookies } from 'next/headers'
import { useTranslation } from '../../../i18n/index'
import { PageWrapper } from '@/components/page-wrapper'
import { RecommendationsRoot } from './root'

const getRecommendations = async () => {
  const loadedCookies = await cookies()
  const session = loadedCookies.get(SESSION_COOKIE_NAME)?.value || ''
  if (!session) {
    return []
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auction-similarities`, {
      method: 'POST',
      body: JSON.stringify({ page: 0, perPage: 16 }),
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
    console.error(`Could not load recommendations: ${error}`)
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

  const title = t('pageSEO.recommendations_title')
  const description = t('pageSEO.recommendations_description')

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

export default async function RecommendationsPage() {
  const recommendations = await getRecommendations()

  return (
    <>
      <PageWrapper>
        <RecommendationsRoot recommendations={recommendations} />
      </PageWrapper>
    </>
  )
}
