'use client'
import { useTranslation } from '@/app/i18n/client'
import { Icon } from '@/components/common/icon'
import { Auction, AuctionProductCondition } from '@/core/domain/auction'
import useGlobalContext from '@/hooks/use-context'

export const AuctionDetailsConditionCard = (props: { auction: Auction; simple?: boolean }) => {
  const { auction, simple = false } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  return (
    <div className="gap-2">
      <div className="d-flex flex-column align-items-center">
        <div className="d-flex align-items-center gap-2">
          <Icon
            type={
              auction.condition === AuctionProductCondition.newProduct
                ? 'auction/auction-new'
                : 'auction/auction-used'
            }
            size={24}
          />
          <span>{`${auction.condition === AuctionProductCondition.newProduct ? t('create_auction.new') : t('create_auction.used')}`}</span>
        </div>
        {!simple && <span className="secondary-color">{t('create_auction.condition')}</span>}
      </div>
    </div>
  )
}
