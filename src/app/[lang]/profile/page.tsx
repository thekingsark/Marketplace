import { PageWrapper } from '@/components/page-wrapper'
import { SESSION_COOKIE_NAME } from '@/constants'
import { cookies, headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next'
import { useTranslation } from '../../i18n/index'
import { ProfileDetailsRoot } from './root'

const loadAccountDetails = async () => {
  const loadedCookies = await cookies()
  const session = loadedCookies.get(SESSION_COOKIE_NAME)?.value || ''
  if (!session) {
    notFound()
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/account`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        Authorization: session,
      },
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      notFound()
    }

    return response.json()
  } catch (error) {
    if ((error as Error).message.includes('Token expired')) {
      redirect(`/refresh-auth-token?redirect=profile`)
    }
  }
}

const loadAccountAuctions = async () => {
  const loadedCookies = await cookies()
  const session = loadedCookies.get(SESSION_COOKIE_NAME)?.value || ''
  if (!session) {
    notFound()
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auction/all/account/all`, {
      method: 'POST',
      body: JSON.stringify({ perPage: 12 }),
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        Authorization: session,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      notFound()
    }

    return response.json()
  } catch (error) {
    if ((error as Error).message.includes('Token expired')) {
      redirect(`/refresh-auth-token?redirect=profile`)
    }
  }
}

const loadAccountBids = async () => {
  const loadedCookies = await cookies()
  const session = loadedCookies.get(SESSION_COOKIE_NAME)?.value || ''
  if (!session) {
    notFound()
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auction/byBid/all`, {
      method: 'POST',
      body: JSON.stringify({ perPage: 12 }),
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        Authorization: session,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      notFound()
    }

    return response.json()
  } catch (error) {
    if ((error as Error).message.includes('Token expired')) {
      redirect(`/refresh-auth-token?redirect=profile`)
    }
  }
}

const loadAccountReviews = async () => {
  const loadedCookies = await cookies()
  const session = loadedCookies.get(SESSION_COOKIE_NAME)?.value || ''
  if (!session) {
    notFound()
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/review/0/10`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        Authorization: session,
      },
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      notFound()
    }

    return response.json()
  } catch (error) {
    if ((error as Error).message.includes('Token expired')) {
      redirect(`/refresh-auth-token?redirect=profile`)
    }
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
  const account = await loadAccountDetails()

  const title = account?.name || 'Profile Page'
  const description = t('pageSEO.account_details_description')

  const firstAsset = account?.asset
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL

  const assetUrl = firstAsset ? `${serverUrl}/assets/${firstAsset.path}` : account?.picture

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

const ProfilePage = async () => {
  const [currentAccount, auctions, bids, reviews] = await Promise.all([
    loadAccountDetails(),
    loadAccountAuctions(),
    loadAccountBids(),
    loadAccountReviews(),
  ])

  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = /mobile|iPhone|iPad|iPod|Android/i.test(userAgent)

  return (
    <PageWrapper>
      <ProfileDetailsRoot
        profileDetails={currentAccount}
        auctions={auctions}
        bids={bids}
        reviews={reviews}
        isMobile={isMobile}
      />
    </PageWrapper>
  )
}

export default ProfilePage
