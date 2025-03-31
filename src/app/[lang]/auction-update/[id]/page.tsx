import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import DefaultAssetImage from '@/../public/assets/img/default-item.jpeg'
import { PageWrapper } from '@/components/page-wrapper'
import { useTranslation } from '@/app/i18n'
import { AuctionForm } from '@/components/auction-form'

const loadAuctionDetails = async (auctionId?: string) => {
  if (!auctionId) {
    return null
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/auction/details/${auctionId}`,
    {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-store, max-age=0',
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

const UpdateAuctionPage = async ({ params }: { params: Promise<{ id: string; lang: string }> }) => {
  const { id } = await params
  const { lang } = await params
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lang)
  const auctionDetails = await loadAuctionDetails(id)
  return (
    <PageWrapper>
      <div
        className="create-auction-root col-12 col-xl-6 col-lg-6 col-md-10 mb-50 mt-30 mt-sm-5 pl-20 pr-20"
        style={{ marginLeft: 'auto', marginRight: 'auto' }}
      >
        <h1>{t('auction_details.update.title')}</h1>
        <AuctionForm auction={auctionDetails} />
      </div>
    </PageWrapper>
  )
}

export default UpdateAuctionPage
