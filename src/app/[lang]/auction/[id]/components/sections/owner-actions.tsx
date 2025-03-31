import { useTranslation } from '@/app/i18n/client'
import { Icon } from '@/components/common/icon'
import useGlobalContext from '@/hooks/use-context'
import { Auction } from '@/core/domain/auction'
import { AuctionDetailsMoreActions } from '../mobile/owner-actions'
import { observer } from 'mobx-react-lite'

export const AuctionDetailsOwnerActions = observer(
  (props: { auction: Auction; handlePromote: () => void; handleRemove: () => void }) => {
    const { auction, handlePromote, handleRemove } = props
    const globalContext = useGlobalContext()
    const currentLanguage = globalContext.currentLanguage
    const { t } = useTranslation(currentLanguage)

    const now = new Date()
    const auctionIsClosed = (auction.expiresAt ?? now) < new Date()
    const startingSoon = !!auction.startAt && !auction.startedAt

    return (
      <div className="d-flex align-items-center justify-content-between">
        <div className="align-items-center justify-content-end d-none d-lg-flex gap-3">
          {!auctionIsClosed && !startingSoon && (
            <button className="border-btn d-flex align-items-center gap-2" onClick={handlePromote}>
              <Icon type="generic/coin" />
              <span>{t('promote_auction.promote_auction')}</span>
            </button>
          )}
          <div className="pos-rel">
            <AuctionDetailsMoreActions auction={auction} handleRemove={handleRemove} />
          </div>
        </div>
      </div>
    )
  }
)
