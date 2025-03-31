'use client'
import { Account } from '@/core/domain/account'
import useGlobalContext from '@/hooks/use-context'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Auction } from '@/core/domain/auction'
import { Review } from '@/core/domain/review'
import { ProfileTabsLayout } from './layouts/tabs'
import { ProfileSidebarLayout } from './layouts/sidebar'

export enum ProfileTabsEnum {
  AUCTIONS = 'auctions',
  BIDS = 'bids',
  FAVOURITES = 'favourites',
  REVIEWS = 'reviews',
  CHAT = 'chat',
  FOLLOWERS = 'followers',
  FOLLOWING = 'following',
  SETTINGS = 'settings',
}

export const ProfileDetailsRoot = (props: {
  profileDetails: Record<string, unknown>
  auctions: Record<string, unknown>[]
  bids: Record<string, unknown>[]
  reviews: Record<string, unknown>[]
  isMobile: boolean
}) => {
  const globalContext = useGlobalContext()
  const [profile, setProfile] = useState<Account>(Account.fromJSON(props.profileDetails))

  const initialAuctions = props.auctions?.map((auction) => Auction.fromJSON(auction)) ?? []
  const initialBids = props.bids?.map((bid) => Auction.fromJSON(bid))
  const initialReviews = props.reviews?.map((review) => Review.fromJSON(review))

  const router = useRouter()
  const searchParams = useSearchParams()

  const [activeNav, setactiveNav] = useState<ProfileTabsEnum>(
    (searchParams.get('tab') as ProfileTabsEnum) ?? ProfileTabsEnum.AUCTIONS
  )

  const handleChangeTab = (tab: ProfileTabsEnum) => {
    setactiveNav(tab)
    router.push(`/profile?tab=${tab}`, { scroll: false })
  }

  const handleUnfollowDone = (accountId: string) => {
    setProfile((prev) => ({
      ...prev,
      followingCount: (prev.followingCount ?? 1) - 1,
      followingAccountsIds: prev.followingAccountsIds?.filter((id) => id !== accountId),
    }))
  }

  const handleFollowDone = (accountId: string) => {
    setProfile((prev) => ({
      ...prev,
      followingCount: (prev.followingCount ?? 0) + 1,
      followingAccountsIds: [...(prev.followingAccountsIds ?? []), accountId],
    }))
  }

  return (
    <div className="max-width" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
      {globalContext.appSettings.profilePageLayout === 'tabs' ? (
        <ProfileTabsLayout
          profile={profile}
          activeNav={activeNav}
          initialAuctions={initialAuctions}
          initialBids={initialBids}
          initialReviews={initialReviews}
          isMobile={props.isMobile}
          handleChangeTab={handleChangeTab}
          handleFollowDone={handleFollowDone}
          handleUnfollowDone={handleUnfollowDone}
        />
      ) : (
        <ProfileSidebarLayout
          profile={profile}
          activeNav={activeNav}
          initialAuctions={initialAuctions}
          initialBids={initialBids}
          initialReviews={initialReviews}
          isMobile={props.isMobile}
          handleChangeTab={handleChangeTab}
          handleFollowDone={handleFollowDone}
          handleUnfollowDone={handleUnfollowDone}
        />
      )}
    </div>
  )
}
