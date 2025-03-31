
import { SEO } from '@/constants'
import { Metadata } from 'next'
import { useTranslation } from '../../../i18n/index'
import { PageWrapper } from '@/components/page-wrapper'
import { StartingSoonAuctionsRoot } from './root'

const getStartingSoonAuctions = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auction/filter/auctions`, {
      next: { revalidate: 0 },
      body: JSON.stringify({ perPage: 16, started: false }),
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

  const title = t('pageSEO.starting_soon_title')
  const description = t('pageSEO.starting_soon_description')

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

export default async function StartingSoonAuctionsPage() {
  const auctions = await getStartingSoonAuctions()

  return (
    <>
      <PageWrapper>
        <StartingSoonAuctionsRoot auctions={auctions} />
      </PageWrapper>
    </>
  )
}
