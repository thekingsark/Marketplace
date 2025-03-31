import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import DefaultAssetImage from '@/../public/assets/img/default-item.jpeg'
import { PageWrapper } from '@/components/page-wrapper'
import { AuctionDetailsRoot } from './root'
import { cookies } from 'next/headers'
import { SESSION_COOKIE_NAME } from '@/constants'

const loadAuctionDetails = async (auctionId?: string) => {
  if (!auctionId) {
    return null
  }

  const loadedCookies = await cookies()
  const session = loadedCookies.get(SESSION_COOKIE_NAME)?.value || null

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/auction/details/${auctionId}`,
    {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        ...(session ? { Authorization: session } : {}),
      },
      next: { revalidate: 0 },
    }
  )

  if (!response.ok) {
    notFound()
  }

  return response.json()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; lang: string }>
}): Promise<Metadata> {
  const { id } = await params
  const auction = await loadAuctionDetails(id)

  const title = auction.title
  const description = auction.description || auction.title

  const firstAsset = auction.assets?.[0]
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL

  const assetUrl = firstAsset ? `${serverUrl}/assets/${firstAsset.path}` : DefaultAssetImage.src

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: assetUrl,
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
          url: assetUrl,
          width: 300,
          height: 300,
          alt: title,
        },
      ],
    },
  }
}

const AuctionDetails = async ({ params }: { params: Promise<{ id: string; lang: string }> }) => {
  const { id } = await params
  const auctionDetails = await loadAuctionDetails(id)

  return (
    <PageWrapper>
      <AuctionDetailsRoot auction={auctionDetails} />
    </PageWrapper>
  )
}

export default AuctionDetails
