import { useTranslation } from '@/app/i18n/client'
import { AuctionHistoryEvent } from '@/core/domain/auction'
import useGlobalContext from '@/hooks/use-context'
import dayjs from 'dayjs'
import React from 'react'

export const AuctionHistoryEventCard = (props: { event: AuctionHistoryEvent }) => {
  const { event } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const renderEventTitle = () => {
    switch (event.type) {
      case 'ADD_TO_FAVORITES':
        return t('auction_history.add_to_fav', { name: event.details.accountName })
      case 'REMOVE_FROM_FAVORITES':
        return t('auction_history.remove_from_fav', { name: event.details.accountName })
      case 'UPDATE_AUCTION':
        return t('auction_history.update')
      case 'VIEW_AUCTION':
        return t('auction_history.view', { name: event.details.accountName })
      case 'PROMOTE_AUCTION':
        return t('auction_history.promote')
      case 'COINS_REFUNDED':
        return t('auction_history.coins_refunded')
      case 'PLACE_BID':
        return t('auction_history.bid_placed', { name: event.details.accountName })
      case 'ACCEPT_BID':
        return t('auction_history.you_accepted_bid')
      case 'REJECT_BID':
        return t('auction_history.you_rejected_bid')
      default:
        return ''
    }
  }

  return (
    <div className="history-event-root">
      <div className="date-wrapper rounded py-2 px-3 d-flex flex-column align-items-center">
        <span className="small">{dayjs(event.createdAt).format('MMM')}</span>
        <span className="h5 fw-bold">{dayjs(event.createdAt).format('DD')}</span>
      </div>
      <div className="ms-3 flex-grow-1">
        <p className="fw-semibold mb-1">{renderEventTitle()}</p>
        <p className="secondary-color m-0">{dayjs(event.createdAt).format('D MMM, h:mm A')}</p>
      </div>

      <style jsx>{`
        .history-event-root {
          background-color: var(--background_3);
          border-radius: 6px;
          padding: 16px;
          display: flex;
          align-items: center;
        }
        .date-wrapper {
          background: var(--call_to_action);
          color: #f7f3f2;
        }
      `}</style>
    </div>
  )
}
