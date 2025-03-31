import useGlobalContext from '@/hooks/use-context'
import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { GlobalSearchHistoryItems } from './history-items'
import { Account } from '@/core/domain/account'
import { SearchHistoryItem } from '@/core/domain/search-history-item'
import { GlobalSearchResult } from './search-result'
import { Icon } from '../../common/icon'
import { YouNeedToLogin } from '../../common/you-need-to-login'
import { AppStore } from '@/core/store'
import { Auction } from '@/core/domain/auction'

export const GlobalSearchInputMenu = (props: {
  searchKey?: string
  historyItems: SearchHistoryItem[]
  searchResult: {
    accounts: Account[]
    auctions: Auction[]
  } | null
}) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)
  const { searchResult } = props

  const currentAccount = AppStore.accountData ?? undefined
  const [historyItems, setHistoryItems] = useState(props.historyItems)

  useEffect(() => {
    setHistoryItems(props.historyItems)
  }, [props.historyItems])

  const historyItemsComp = useMemo(() => {
    return <GlobalSearchHistoryItems historyItems={historyItems} />
  }, [historyItems])

  if (searchResult) {
    return <GlobalSearchResult searchResult={searchResult} searchKey={props.searchKey ?? ''} />
  }

  return (
    <div className="search-menu">
      <h4>{t('home.search.recent_searches')}</h4>

      {AppStore.loadingStates.searchHistoryItems ? (
        <div className="loader-wrapper">
          <Icon type="loading" color={'#fff'} size={40} />
        </div>
      ) : historyItems.length ? (
        historyItemsComp
      ) : (
        <div className="d-flex flex-column align-items-center justify-content-between ">
          {!currentAccount ? (
            <div>
              <YouNeedToLogin message={t('anonymous.login_for_search_history')} />
            </div>
          ) : (
            <>
              <Icon type="logo" size={76} />
              <span className="mt-20 p-16">{t('home.search.search')}</span>
            </>
          )}
        </div>
      )}
      <style jsx>{`
        .search-menu {
          padding: 16px;
          z-index: 99999;
          background: var(--background_1);
        }
        .loader-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 120px;
        }
      `}</style>
    </div>
  )
}

export default GlobalSearchInputMenu
