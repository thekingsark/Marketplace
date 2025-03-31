import { SEO } from '@/constants'
import { Metadata } from 'next'
import { useTranslation } from '../../../i18n/index'
import { PageWrapper } from '@/components/page-wrapper'
import { PromotedAuctionsRoot } from './root'

const getPromotedAuctions = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auction/filter/auctions`, {
      next: { revalidate: 0 },
      body: JSON.stringify({ promotedOnly: true, perPage: 16, activeOnly: true }),
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lang)

  const title = t('pageSEO.promoted_auctions_title')
  const description = t('pageSEO.promoted_auctions_description')

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

export default async function PromotedAuctionsPage() {
  const auctions = await getPromotedAuctions()

  return (
    <>
      <PageWrapper>
        <PromotedAuctionsRoot auctions={auctions} />
      </PageWrapper>
    </>
  )
}
