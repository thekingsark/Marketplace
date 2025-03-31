import { useTranslation } from '@/app/i18n/client'
import { Icon } from '@/components/common/icon'
import { AuctionProductCondition } from '@/core/domain/auction'
import useGlobalContext from '@/hooks/use-context'
import { useState } from 'react'
import { FormErrorMessage } from '../form-error-message'

interface AuctionFormConditionSectionProps {
  rootRef: React.RefObject<HTMLDivElement>
  formIsValid: boolean
  formSubmitTries: number
  initialCondition?: AuctionProductCondition
  onSelect: (condition: AuctionProductCondition) => void
}

export const AuctionFormConditionSection = (props: AuctionFormConditionSectionProps) => {
  const { rootRef, formIsValid, formSubmitTries, initialCondition } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)
  const [selectedCondition, setSelectedCondition] = useState<AuctionProductCondition | null>(
    initialCondition ?? null
  )

  const handleSelect = (condition: AuctionProductCondition) => {
    setSelectedCondition(condition)
    props.onSelect(condition)
  }

  return (
    <div className="mt-20" ref={rootRef}>
      <div className="d-flex flex-row justify-content-between align-items-center mb-10">
        <label className="mb-0 create-auction-label">{t('create_auction.condition')}</label>
      </div>

      <div className="d-flex align-items-center justify-content-center gap-2">
        <div
          className={`auction-condition-item ${
            selectedCondition === AuctionProductCondition.newProduct
              ? 'selected-condition-item'
              : ''
          }`}
          onClick={() => handleSelect(AuctionProductCondition.newProduct)}
        >
          <Icon type="auction/auction-new" size={40} />
          <span>{t('create_auction.new')}</span>
        </div>

        <div
          className={`auction-condition-item ${
            selectedCondition === AuctionProductCondition.used ? 'selected-condition-item' : ''
          }`}
          onClick={() => handleSelect(AuctionProductCondition.used)}
        >
          <Icon type="auction/auction-used" size={40} />
          <span>{t('create_auction.used')}</span>
        </div>
      </div>

      {!formIsValid && selectedCondition == null && !!formSubmitTries && (
        <div className="mt-10">
          <FormErrorMessage key={formSubmitTries} message={t('info.condition_required')} isError />
        </div>
      )}
    </div>
  )
}
