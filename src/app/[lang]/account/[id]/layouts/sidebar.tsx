import { Account } from '@/core/domain/account'
import { AccountTabsEnum } from '../root'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { AccountInfo } from '@/components/account/info'
import { AccountSpecificActions } from '@/components/account/specific-actions'
import { AccountDetailsTabs } from '../components/tabs'
import { AccountTabsContent } from '../components/tabs-content'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'
import { AccountMobileSidebarMenu } from '../components/mobile-sidebar-menu'

export const AccountProfileSidebarLayout = (props: {
  account: Account
  handleChangeTab: (tab: AccountTabsEnum) => void
  handleUnfollowDone: () => void
  handleFollowDone: () => void
}) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const { account, handleFollowDone, handleUnfollowDone } = props
  const searchParams = useSearchParams()

  const [sidebarMenuOpened, setSidebarMenuOpened] = useState(false)
  const [activeNav, setActiveNav] = useState<AccountTabsEnum>(
    (searchParams.get('tab') as AccountTabsEnum) ?? AccountTabsEnum.AUCTIONS
  )

  const handleChangeTab = (tab: AccountTabsEnum) => {
    setActiveNav(tab)
    props.handleChangeTab(tab)
  }

  const renderActiveTabTitle = () => {
    switch (activeNav) {
      case AccountTabsEnum.AUCTIONS:
        return (
          <h1 className="m-0">
            {t('home.auctions.auctions')} ({account.activeAuctionsCount ?? 0})
          </h1>
        )
      case AccountTabsEnum.REVIEWS:
        return (
          <h1 className="m-0">
            {t('profile.reviews.reviews')} ({account.reviews?.length ?? 0})
          </h1>
        )
      case AccountTabsEnum.FOLLOWERS:
        return (
          <h1 className="m-0">
            {t('profile.followers')} ({account.followersCount ?? 0})
          </h1>
        )
      case AccountTabsEnum.FOLLOWING:
        return (
          <h1 className="m-0">
            {t('profile.following')} ({account.followingCount ?? 0})
          </h1>
        )
    }
  }

  return (
    <div className="row mr-0 ml-0 mt-30 mt-sm-5 mb-100 w-100">
      <div className="col-lg-4 flex-column sidebar-account-tabs no-bs-gutter">
        <div className="w-100 sidebar-account-tabs-root">
          <div className="d-flex flex-column gap-4 p-16">
            <AccountInfo account={account} />
            <AccountSpecificActions
              allowMoreActions
              account={account}
              fullWidth={true}
              handleUnfollowDone={handleUnfollowDone}
              handleFollowDone={handleFollowDone}
              inverted
            />
          </div>
          <div className="sidebar-account-tabs-list">
            <AccountDetailsTabs
              sidebar
              account={account}
              activeNav={activeNav}
              handleChangeTab={handleChangeTab}
            />
          </div>
        </div>
      </div>
      <div className="d-block d-xl-none sidebar-mobile-account-profile">
        <div className="d-flex flex-column gap-4 p-16">
          <AccountInfo account={account} />
          <AccountSpecificActions
            allowMoreActions
            account={account}
            fullWidth={true}
            handleUnfollowDone={handleUnfollowDone}
            handleFollowDone={handleFollowDone}
            inverted
          />
        </div>
      </div>
      <div className="sidebar-account-content no-bs-gutter flex-column">
        <div className="mb-20 d-flex align-items-center justify-content-between">
          {renderActiveTabTitle()}
          <button
            className="border-btn d-block d-xl-none"
            onClick={() => {
              setSidebarMenuOpened(true)
            }}
          >
            {t('generic.change_tab')}
          </button>
        </div>
        <div className="w-100 sidebar-account-content-root">
          <AccountTabsContent account={account} activeNav={activeNav} />
        </div>
      </div>
      <AccountMobileSidebarMenu
        opened={sidebarMenuOpened}
        account={account}
        activeNav={activeNav}
        handleChangeTab={handleChangeTab}
        handleClose={() => setSidebarMenuOpened(false)}
      />
    </div>
  )
}
