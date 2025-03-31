'use client'
import { useTranslation } from '@/app/i18n/client'
import { Auction } from '@/core/domain/auction'
import useGlobalContext from '@/hooks/use-context'
import { Icon } from '../common/icon'
import { Countdown } from '../common/countdown'
import { FormattedDate } from '../common/formatted-date'

export const AuctionCardStatus = (props: { auction: Auction; large?: boolean, includeStartingDate?: boolean }) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const { auction, large, includeStartingDate = true } = props

  let dateToCheck = auction.createdAt
  if (typeof dateToCheck === 'string') {
    dateToCheck = new Date(dateToCheck)
  }

  try {
    dateToCheck.getTime()
  } catch (e) {
    console.error('Invalid date format', e)
    return null
  }

  const AUCTION_ACTIVE_TIME_IN_HOURS = globalContext.appSettings?.auctionActiveTimeInHours ?? 96
  const deadline = auction.expiresAt ?? new Date(
    (dateToCheck?.getTime() ?? -AUCTION_ACTIVE_TIME_IN_HOURS) +
    AUCTION_ACTIVE_TIME_IN_HOURS * 60 * 60 * 1000
  )
  const now = new Date()
  const durationDiff = Number(deadline) - Number(now)

  const bidAccepted = auction.acceptedBidId != null
  const isClosed = !auction.isActive || durationDiff < 0 || bidAccepted
  const startingSoon = !!auction.startAt && !auction.startedAt

  if (startingSoon) {
    return (
      <div className='d-flex align-items-center justify-content-between'>
        <p className="m-0">
          {t('starting_soon_auctions.starting_soon')}
        </p>
        {includeStartingDate &&
          <p className='m-0'>
            <FormattedDate date={auction.startAt!} format='D MMM' />
          </p>}
      </div>
    )
  }

  if (bidAccepted) {
    return (
      <p className="auction-card-status d-flex align-items-center m-0">
        {t('auction_details.accepted_bid')}
        <style jsx>{`
          .auction-card-status {
            color: var(--success);
            white-space: nowrap;
            font-size: 18px;
          }
        `}</style>
      </p>
    )
  }

  if (isClosed) {
    return (
      <p className="auction-card-status m-0">
        {t('auction_details.closed')}
        <style jsx>{`
          .auction-card-status {
            color: var(--call_to_action);
            white-space: nowrap;
            font-size: 18px;
          }
        `}</style>
      </p>
    )
  }

  return (
    <div className="countdown-wrapper gap-2">
      <div className="hourglass-wrapper">
        <Icon type="generic/hourglass" size={large ? 24 : 18} />
      </div>
      <Countdown deadlineDate={deadline} large={large} />
    </div>
  )
}
