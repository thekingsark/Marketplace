import useGlobalContext from '@/hooks/use-context'
import { SearchResult } from '.'
import { GlobalSearchAccountItem } from './account-item'
import { useTranslation } from '@/app/i18n/client'
import React, { useEffect } from 'react'
import { SearchHistoryItemType } from '@/core/domain/search-history-item'
import { AppStore } from '@/core/store'
import { SearchController } from '@/core/controllers/search'
import { YouNeedToLogin } from '../../common/you-need-to-login'
import { observer } from 'mobx-react-lite'
import { GlobalSearchAuctionItem } from './auction-items'

interface GlobalSearchResultProps {
  searchResult: SearchResult
  searchKey: string
}

export const GlobalSearchResult = observer((props: GlobalSearchResultProps) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const [searchResult, setSearchResult] = React.useState<SearchResult>(props.searchResult)

  useEffect(() => {
    setSearchResult(props.searchResult)
  }, [props.searchResult])

  const storeSearchHistoryItem = async (
    type: SearchHistoryItemType,
    searchKey: string,
    data?: string,
    entityId?: string
  ) => {
    if (!AppStore.accountData) {
      return
    }

    await SearchController.addSearchHistoryItem(type, searchKey, data, entityId)
  }

  return (
    <div className="result-root p-16 h-100">
      <div className="">
        <h4>{t('home.auctions.auctions')}</h4>
        {searchResult!.auctions.length === 0 && (
          <p className="secondary-color">{t('home.search.no_auction_that_match')}</p>
        )}
        {searchResult!.auctions.map((auction) => (
          <div key={auction.id}>
            <GlobalSearchAuctionItem
              auction={auction}
              onClick={() => {
                storeSearchHistoryItem(
                  SearchHistoryItemType.auction,
                  props.searchKey,
                  JSON.stringify(auction),
                  auction.id
                )
              }}
            />
          </div>
        ))}
      </div>

      <div className=" mt-20">
        <h4>{t('home.search.users')}</h4>
        {searchResult!.accounts.length === 0 &&
          (!AppStore.accountData?.id ? (
            <YouNeedToLogin message={t('anonymous.login_to_search_accounts')} />
          ) : (
            <p className="secondary-color">{t('home.search.no_users_that_match')}</p>
          ))}
        {searchResult!.accounts.map((account) => (
          <div key={account.id}>
            <GlobalSearchAccountItem
              account={account}
              onClick={() => {
                const { id, name, email, picture } = account
                storeSearchHistoryItem(
                  SearchHistoryItemType.account,
                  props.searchKey,
                  JSON.stringify({ id, name, email, picture }),
                  account.id
                )
              }}
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        .result-root {
          overflow-y: auto;
        }
      `}</style>
    </div>
  )
})
