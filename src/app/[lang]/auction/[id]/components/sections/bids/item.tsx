import { useTranslation } from '@/app/i18n/client'
import { ChatController } from '@/core/controllers/chat'
import { Auction } from '@/core/domain/auction'
import { Bid } from '@/core/domain/bid'
import useGlobalContext from '@/hooks/use-context'
import React from 'react'
import { toast } from 'react-toastify'
import { AuctionDetailsBidItemContent } from './item-content'
import { Icon } from '@/components/common/icon'
import { AppStore } from '@/core/store'
import { RejectBidModal } from '../../modals/reject-bid'
import { AcceptBidModal } from '../../modals/accept-bid'

interface AuctionDetailBidItemProps {
  bid: Bid
  auction: Auction
  handleRemoveBid: () => Promise<boolean>
  handleRejectBid: (reason?: string) => Promise<boolean>
  handleAcceptBid: () => Promise<boolean>
}

export const AuctionDetailBidItem = (props: AuctionDetailBidItemProps) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const [rejectModalOpened, setRejectModalOpened] = React.useState(false)
  const [acceptModalOpened, setAcceptModalOpened] = React.useState(false)
  const [openChatInProgress, setOpenChatInProgress] = React.useState(false)

  const { bid, auction } = props

  const openChatGroup = async () => {
    const { bid, auction } = props
    const isAuctionOwner = auction?.auctioneer?.id === AppStore.accountData?.id
    const isBidOwner = bid.bidder?.id === AppStore.accountData?.id
    if (!isAuctionOwner && !isBidOwner) {
      return false
    }

    const otherAccount = isAuctionOwner ? bid.bidder?.id : auction?.auctioneer?.id
    if (!otherAccount) {
      return false
    }

    return ChatController.openChatGroupWithAccount(otherAccount)
  }

  const handleOpenChat = async () => {
    if (openChatInProgress) {
      return
    }

    setOpenChatInProgress(true)
    const result = await openChatGroup()
    setOpenChatInProgress(false)

    if (!result) {
      toast.error(t('generic.something_went_wrong'))
      return
    }
  }

  const handleAccept = async () => {
    try {
      const { auction } = props
      const bid = auction?.bids?.find((bid) => bid.id === props.bid.id)
      if (!bid?.bidder?.id) {
        return false
      }

      return await props.handleAcceptBid()
    } catch (error) {
      console.error('Failed to accept bid:', error)
      return false
    }
  }

  return (
    <div
      className="bid-root"
      style={{
        marginTop: bid.isAccepted || bid.isRejected ? '12px' : '',
        border: `1px solid ${bid.isAccepted ? 'var(--separator)' : 'transparent'}`,
        background: bid.isAccepted ? 'var(--background_4)' : '',
      }}
    >
      {auction?.acceptedBidId === bid.id && (
        <div className="pl-10 pr-10 mt-10 accepted-bid-label">
          {t('auction_details.accepted_bid')}
        </div>
      )}

      <AuctionDetailsBidItemContent
        {...props}
        auction={auction}
        handleRemove={props.handleRemoveBid}
      />

      {(bid.isRejected || (auction.acceptedBidId && auction.acceptedBidId !== bid.id)) && (
        <div className="bid-item-rejection-reason">{bid.rejectionReason}</div>
      )}

      {auction?.auctioneer?.id === AppStore.accountData?.id &&
        !bid.isRejected &&
        !bid.isAccepted &&
        !auction?.acceptedBidId && (
          <div className="d-flex align-items-center justify-content-center gap-2 p-2 w-100 mt-10 mb-10">
            <button
              className="border-btn flex-grow-1 bid-item-reject-bid-btn"
              onClick={() => setRejectModalOpened(true)}
            >
              <span className="ml-10">{t('auction_details.bids.reject_bid')}</span>
            </button>
            <button
              className="fill-btn flex-grow-1 bid-item-accept-bid-btn"
              onClick={() => setAcceptModalOpened(true)}
            >
              <span className="ml-10">{t('auction_details.bids.accept_bid')}</span>
            </button>
          </div>
        )}

      {auction?.acceptedBidId === bid.id &&
        (auction?.auctioneer?.id === AppStore.accountData?.id ||
          bid.bidder?.id === AppStore.accountData?.id) && (
          <div className="d-flex align-items-center justify-content-center ml-20 mr-20 mt-20 mb-20">
            <button className="border-btn send-message-btn w-100" onClick={handleOpenChat}>
              {openChatInProgress ? (
                <Icon type="loading" />
              ) : (
                <span className="ml-10">{t('chat.send_message')}</span>
              )}
            </button>
          </div>
        )}
      <RejectBidModal
        isOpened={rejectModalOpened}
        close={() => setRejectModalOpened(false)}
        onSubmit={props.handleRejectBid}
      />
      <AcceptBidModal
        isOpened={acceptModalOpened}
        close={() => setAcceptModalOpened(false)}
        onSubmit={handleAccept}
      />
    </div>
  )
}
