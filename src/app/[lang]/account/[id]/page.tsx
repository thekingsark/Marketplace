import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageWrapper } from '@/components/page-wrapper'
import { useTranslation } from '../../../i18n/index'
import { AccountDetailsRoot } from './root'

const loadAccountDetails = async (accountId?: string) => {
  if (!accountId) {
    return null
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/account/details/${accountId}`,
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
  const { lang, id } = await params
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lang)
  const account = await loadAccountDetails(id)

  const title = account.name
  const description = t('pageSEO.account_details_description')

  const firstAsset = account.asset
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL

  const assetUrl = firstAsset ? `${serverUrl}/assets/${firstAsset.path}` : account.picture

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

const AccountDetails = async ({ params }: { params: Promise<{ id: string; lang: string }> }) => {
  const { id } = await params
  const accountDetails = await loadAccountDetails(id)

  return (
    <PageWrapper>
      <AccountDetailsRoot accountDetails={accountDetails}></AccountDetailsRoot>
    </PageWrapper>
  )
}

export default AccountDetails
