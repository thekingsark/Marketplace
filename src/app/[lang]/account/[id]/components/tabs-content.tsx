import { AccountFollowersSection } from '@/components/account/lists/followers'
import { AccountFollowingSection } from '@/components/account/lists/following'
import { AccountReviewsSection } from '@/components/account/lists/reviews'
import { AccountTabsEnum } from '../root'
import { AccountAuctionsSection } from './auctions-list'
import { Account } from '@/core/domain/account'

export const AccountTabsContent = (props: { activeNav: AccountTabsEnum; account: Account }) => {
  const { account, activeNav } = props

  return (
    <>
      <div className="tab-content">
        <div
          className={`tab-pane fade ${AccountTabsEnum.AUCTIONS === activeNav ? 'active show' : ''}`}
          id={`tab-${AccountTabsEnum.AUCTIONS}`}
          role="tabpanel"
          aria-labelledby={AccountTabsEnum.AUCTIONS}
        >
          <AccountAuctionsSection account={account} />
        </div>
      </div>
      <div className="tab-content">
        <div
          className={`tab-pane fade ${AccountTabsEnum.REVIEWS === activeNav ? 'active show' : ''}`}
          id={`tab-${AccountTabsEnum.REVIEWS}`}
          role="tabpanel"
          aria-labelledby={AccountTabsEnum.REVIEWS}
        >
          <AccountReviewsSection account={account} />
        </div>
      </div>
      <div className="tab-content">
        <div
          className={`tab-pane fade ${
            AccountTabsEnum.FOLLOWERS === activeNav ? 'active show' : ''
          }`}
          id={`tab-${AccountTabsEnum.FOLLOWERS}`}
          role="tabpanel"
          aria-labelledby={AccountTabsEnum.FOLLOWERS}
        >
          <AccountFollowersSection account={account} key="followers" />
        </div>
      </div>
      <div className="tab-content">
        <div
          className={`tab-pane fade ${
            AccountTabsEnum.FOLLOWING === activeNav ? 'active show' : ''
          }`}
          id={`tab-${AccountTabsEnum.FOLLOWING}`}
          role="tabpanel"
          aria-labelledby={AccountTabsEnum.FOLLOWING}
        >
          <AccountFollowingSection account={account} />
        </div>
      </div>
    </>
  )
}
