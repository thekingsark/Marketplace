'use client'
import { Account } from '@/core/domain/account'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AppStore } from '@/core/store'
import useGlobalContext from '@/hooks/use-context'
import { AccountProfileTabsLayout } from './layouts/tabs'
import { AccountProfileSidebarLayout } from './layouts/sidebar'

export enum AccountTabsEnum {
  AUCTIONS = 'auctions',
  REVIEWS = 'reviews',
  FOLLOWERS = 'followers',
  FOLLOWING = 'following',
}

export const AccountDetailsRoot = (props: { accountDetails: Record<string, unknown> }) => {
  const globalContext = useGlobalContext()

  const [account, setAccount] = useState<Account>(Account.fromJSON(props.accountDetails))

  const router = useRouter()

  const handleChangeTab = (tab: AccountTabsEnum) => {
    router.push(`/account/${account.id}?tab=${tab}`, { scroll: false })
  }

  const handleUnfollowDone = () => {
    setAccount((prev) => ({
      ...prev,
      followersCount: (prev.followersCount ?? 1) - 1,
      followedByAccountsIds: prev.followedByAccountsIds?.filter(
        (id) => id !== AppStore.accountData?.id
      ),
    }))
  }

  const handleFollowDone = () => {
    setAccount((prev) => ({
      ...prev,
      followersCount: (prev.followersCount ?? 0) + 1,
      followedByAccountsIds: [
        ...(prev.followedByAccountsIds ?? []),
        AppStore.accountData?.id as string,
      ],
    }))
  }

  return (
    <div className="max-width" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
      {globalContext.appSettings.accountPageLayout === 'tabs' ? (
        <AccountProfileTabsLayout
          account={account}
          handleChangeTab={handleChangeTab}
          handleUnfollowDone={handleUnfollowDone}
          handleFollowDone={handleFollowDone}
        />
      ) : (
        <AccountProfileSidebarLayout
          account={account}
          handleChangeTab={handleChangeTab}
          handleUnfollowDone={handleUnfollowDone}
          handleFollowDone={handleFollowDone}
        />
      )}
    </div>
  )
}
