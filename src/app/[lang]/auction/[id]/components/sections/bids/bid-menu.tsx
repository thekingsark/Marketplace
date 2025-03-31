import { useTranslation } from '@/app/i18n/client'
import useGlobalContext from '@/hooks/use-context'
import Link from 'next/link'
import React, { useState } from 'react'
import { Bid } from '@/core/domain/bid'
import { Auction } from '@/core/domain/auction'
import { ReportsController } from '@/core/controllers/reports'
import { AppStore } from '@/core/store'
import { observer } from 'mobx-react-lite'
import { RemoveBidModal } from '../../modals/remove-bid'
import { ReportAuctionModal } from '../../modals/report'

interface AuctionBidMenuProps {
  bid?: Bid
  auction?: Auction
  handleClose: () => void
  handleRemove: () => Promise<boolean>
}

export const AuctionBidMenu = observer((props: AuctionBidMenuProps) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const { bid, auction, handleClose } = props
  const [removeModalOpened, setRemoveModalOpened] = useState(false)
  const [reportModalOpened, setReportModalOpened] = useState(false)

  const currentAccount = AppStore.accountData
  const isOwnerOfBid = currentAccount?.id === bid?.bidder?.id

  const toggleReportModal = () => {
    handleClose()
    setReportModalOpened(!reportModalOpened)
  }

  const toggleRemoveModal = () => {
    handleClose()
    setRemoveModalOpened(!removeModalOpened)
  }

  const handleCreateReport = async (reportOption: string, details?: string) => {
    const { bid } = props
    if (!bid) {
      return false
    }

    try {
      return await ReportsController.create('bid', bid.id, reportOption, details)
    } catch (error) {
      console.error(`Error creating report: ${error}`)
      return false
    }
  }

  return (
    <div className="bid-details-menu-root">
      <ul>
        <Link href={isOwnerOfBid ? '/profile' : `/account/${bid?.bidder!.id}`}>
          <li className="bid-details-menu-root-menu-item">
            {t(
              isOwnerOfBid
                ? 'auction_details.bids.see_your_profile'
                : 'auction_details.bids.see_bidder'
            )}
          </li>
        </Link>
        {isOwnerOfBid && !bid?.isAccepted && !bid?.isRejected && auction?.isActive && (
          <li className="bid-details-menu-root-menu-item" onClick={toggleRemoveModal}>
            {t('auction_details.bids.remove')}
          </li>
        )}

        {!isOwnerOfBid && !!currentAccount && (
          <li className="bid-details-menu-root-menu-item" onClick={toggleReportModal}>
            {t('auction_details.bids.report')}
          </li>
        )}
      </ul>

      <RemoveBidModal
        isOpened={removeModalOpened}
        close={toggleRemoveModal}
        handleSubmit={props.handleRemove}
      />

      <ReportAuctionModal
        isBid
        isOpened={reportModalOpened}
        close={toggleReportModal}
        onConfirm={handleCreateReport}
      />
      <style jsx>{`
        .bid-details-menu-root {
          border-radius: 6px;
          padding: 8px 0;
          background: var(--background_1);
        }
        .bid-details-menu-root-menu-item {
          display: flex;
          align-items: center;
          height: 40px;
          padding: 8px 24px;
          cursor: pointer;
        }
        .bid-details-menu-root-menu-item:hover {
          background: var(--background_4);
        }
      `}</style>
    </div>
  )
})
