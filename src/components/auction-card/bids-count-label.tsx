import { useTranslation } from '@/app/i18n/client'
import useGlobalContext from '@/hooks/use-context'
import { memo } from 'react'

export const AuctionBidsCountLabel = memo(({ count }: { count: number }) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  return (
    <div className="auction-bids-count-root">
      <div className="flex items-center justify-center ">
        <div>
          {t(count === 1 ? 'generic.bids_count_singular' : 'generic.bids_count_plural', {
            no: count.toString(),
          })}
        </div>
      </div>
    </div>
  )
})

AuctionBidsCountLabel.displayName = 'AuctionBidsCountLabel'
