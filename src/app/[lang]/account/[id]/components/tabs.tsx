import { useTranslation } from '@/app/i18n/client'
import { Account } from '@/core/domain/account'
import useGlobalContext from '@/hooks/use-context'
import { AccountTabsEnum } from '../root'
import { memo, useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/common/icon'

export const AccountDetailsTabs = memo(
  (props: {
    account: Account
    activeNav: AccountTabsEnum
    sidebar?: boolean
    handleChangeTab: (tab: AccountTabsEnum) => void
  }) => {
    const globalContext = useGlobalContext()
    const currentLanguage = globalContext.currentLanguage
    const { t } = useTranslation(currentLanguage)
    const { account, sidebar = false } = props

    const [activeNav, setActiveNav] = useState<AccountTabsEnum>(props.activeNav)
    const containerRef = useRef<HTMLDivElement>(null)
    const childrenRefs = useRef<Record<string, HTMLButtonElement>>({})

    const changeCurrentTab = (tab: AccountTabsEnum) => {
      setActiveNav(tab)
      props.handleChangeTab(tab)
    }

    useEffect(() => {
      if (activeNav && childrenRefs.current[activeNav]) {
        const container = containerRef.current
        const selectedChild = childrenRefs.current[activeNav]

        if (container && selectedChild) {
          const containerRect = container.getBoundingClientRect()
          const childRect = selectedChild.getBoundingClientRect()

          if (childRect.right > containerRect.right || childRect.left < containerRect.left) {
            selectedChild.scrollIntoView({
              behavior: 'instant',
              block: 'nearest',
              inline: 'nearest',
            })
          }
        }
      }
    }, [activeNav])

    return (
      <>
        <div className={`${sidebar ? 'profile-tabs-root' : ''} w-100`}>
          <nav className="w-100">
            <div
              className={`nav ${sidebar ? 'flex-column' : ''}`}
              role="tablist"
              ref={containerRef}
            >
              <button
                ref={(el) => {
                  if (el) {
                    childrenRefs.current[AccountTabsEnum.AUCTIONS] = el
                  }
                }}
                className={`nav-link ${
                  sidebar ? 'sidebar-account-details-nav-link' : 'account-details-nav-link'
                } ${AccountTabsEnum.AUCTIONS === activeNav ? 'active' : ''}`}
                id={AccountTabsEnum.AUCTIONS}
                data-bs-toggle="tab"
                data-bs-target={`#tab-${AccountTabsEnum.AUCTIONS}`}
                role="tab"
                aria-selected={AccountTabsEnum.AUCTIONS === activeNav}
                onClick={() => changeCurrentTab(AccountTabsEnum.AUCTIONS)}
              >
                <Icon type="header/auction" size={18} />
                <span>
                  {t('home.auctions.auctions')} ({account.activeAuctionsCount ?? 0})
                </span>
              </button>

              <button
                ref={(el) => {
                  if (el) {
                    childrenRefs.current[AccountTabsEnum.REVIEWS] = el
                  }
                }}
                className={`nav-link ${
                  sidebar ? 'sidebar-account-details-nav-link' : 'account-details-nav-link'
                } ${AccountTabsEnum.REVIEWS === activeNav ? 'active' : ''}`}
                id={AccountTabsEnum.REVIEWS}
                data-bs-toggle="tab"
                data-bs-target={`#tab-${AccountTabsEnum.REVIEWS}`}
                role="tab"
                aria-selected={AccountTabsEnum.REVIEWS === activeNav}
                onClick={() => changeCurrentTab(AccountTabsEnum.REVIEWS)}
              >
                <Icon type="generic/star" size={18} />
                <span>
                  {t('profile.reviews.reviews')} ({account.reviews?.length ?? 0})
                </span>
              </button>

              <button
                ref={(el) => {
                  if (el) {
                    childrenRefs.current[AccountTabsEnum.FOLLOWERS] = el
                  }
                }}
                className={`nav-link ${
                  sidebar ? 'sidebar-account-details-nav-link' : 'account-details-nav-link'
                } ${AccountTabsEnum.FOLLOWERS === activeNav ? 'active' : ''}`}
                id={AccountTabsEnum.FOLLOWERS}
                data-bs-toggle="tab"
                data-bs-target={`#tab-${AccountTabsEnum.FOLLOWERS}`}
                role="tab"
                aria-selected={AccountTabsEnum.FOLLOWERS === activeNav}
                onClick={() => changeCurrentTab(AccountTabsEnum.FOLLOWERS)}
              >
                <span>
                  {t('profile.followers')} ({account.followersCount ?? 0})
                </span>
              </button>

              <button
                ref={(el) => {
                  if (el) {
                    childrenRefs.current[AccountTabsEnum.FOLLOWING] = el
                  }
                }}
                className={`nav-link ${
                  sidebar ? 'sidebar-account-details-nav-link' : 'account-details-nav-link'
                } ${AccountTabsEnum.FOLLOWING === activeNav ? 'active' : ''}`}
                id={AccountTabsEnum.FOLLOWING}
                data-bs-toggle="tab"
                data-bs-target={`#tab-${AccountTabsEnum.FOLLOWING}`}
                role="tab"
                aria-selected={AccountTabsEnum.FOLLOWING === activeNav}
                onClick={() => changeCurrentTab(AccountTabsEnum.FOLLOWING)}
              >
                <span>
                  {t('profile.following')} ({account.followingCount ?? 0})
                </span>
              </button>
            </div>
          </nav>
        </div>
      </>
    )
  }
)

AccountDetailsTabs.displayName = 'ProfileTabs'
