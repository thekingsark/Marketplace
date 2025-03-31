import { Account } from '@/core/domain/account'
import { SearchHistoryItem } from '@/core/domain/search-history-item'
import { useMemo } from 'react'
import { GlobalSearchAccountItem } from './account-item'
import { Auction } from '@/core/domain/auction'
import { GlobalSearchAuctionItem } from './auction-items'

export const GlobalSearchHistoryItems = (props: { historyItems: SearchHistoryItem[] }) => {
  const { historyItems } = props

  return (
    <div className="root h-100">
      {historyItems.map((item, index) => (
        <div key={index} className="item">
          <GlobalSearchHistoryItem item={item} />
        </div>
      ))}

      <style jsx>{`
        .root {
          overflow-y: auto;
          scrollbar-width: thin;
          margin-top: 10px;
        }
      `}</style>
    </div>
  )
}

const GlobalSearchHistoryItem = (props: { item: SearchHistoryItem }) => {
  const { item } = props

  const content = useMemo(() => {
    switch (item.type) {
      case 'account':
        let account = null as null | Account
        try {
          account = Account.fromJSON(JSON.parse(item.data ?? ''))
        } catch (error) {
          console.error('Could not parse account:', error)
        }

        if (!account) {
          return null
        }
        return <GlobalSearchAccountItem account={account} />
      case 'auction':
        let auction = null as null | Auction
        try {
          const parsedData = JSON.parse(item.data ?? '')
          auction = Auction.fromJSON(parsedData)
        } catch (error) {
          console.error('Could not parse auction:', error)
        }

        if (!auction) {
          return null
        }

        return <GlobalSearchAuctionItem auction={auction} />
      case 'search':
        return null
    }
  }, [item])

  return content
}
