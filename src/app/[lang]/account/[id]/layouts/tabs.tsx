import { AccountInfo } from '@/components/account/info'
import { AccountSpecificActions } from '@/components/account/specific-actions'
import { AccountDetailsTabs } from '../components/tabs'
import { AccountTabsEnum } from '../root'
import { Account } from '@/core/domain/account'
import { useScreenIsBig } from '@/hooks/use-screen-is-big'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { AccountTabsContent } from '../components/tabs-content'

export const AccountProfileTabsLayout = (props: {
  account: Account
  handleChangeTab: (tab: AccountTabsEnum) => void
  handleUnfollowDone: () => void
  handleFollowDone: () => void
}) => {
  const { account, handleFollowDone, handleUnfollowDone } = props
  const screenIsBig = useScreenIsBig()
  const searchParams = useSearchParams()

  const [activeNav, setActiveNav] = useState<AccountTabsEnum>(
    (searchParams.get('tab') as AccountTabsEnum) ?? AccountTabsEnum.AUCTIONS
  )

  const handleChangeTab = (tab: AccountTabsEnum) => {
    setActiveNav(tab)
    props.handleChangeTab(tab)
  }

  return (
    <div className="row mr-0 ml-0 mt-30 mt-sm-5 mb-100 w-100">
      <div className="account-details-header">
        <div className="account-details-header-top">
          <AccountInfo account={account} />
          <AccountSpecificActions
            allowMoreActions
            account={account}
            fullWidth={!screenIsBig}
            handleUnfollowDone={handleUnfollowDone}
            handleFollowDone={handleFollowDone}
            inverted
          />
        </div>
        <div className="mt-30 d-flex align-items-center justify-content-between">
          <AccountDetailsTabs
            account={account}
            activeNav={activeNav}
            handleChangeTab={handleChangeTab}
          />
        </div>
      </div>
      <div className="mb-30 mt-40 p-0">
        <AccountTabsContent account={account} activeNav={activeNav} />
      </div>
    </div>
  )
}
