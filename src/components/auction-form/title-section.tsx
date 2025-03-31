import { useTranslation } from '@/app/i18n/client'
import useGlobalContext from '@/hooks/use-context'
import { useState } from 'react'
import { FormErrorMessage } from './form-error-message'

interface AuctionFormTitleSectionProps {
  rootRef: React.RefObject<HTMLDivElement>
  formIsValid: boolean
  formSubmitTries: number
  initialTitle?: string
  onChange: (title: string) => void
}

export const AuctionFormTitleSection = (props: AuctionFormTitleSectionProps) => {
  const { rootRef, formIsValid, initialTitle, formSubmitTries } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const [title, setTitle] = useState<string>(initialTitle ?? '')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  return (
    <div className="mt-40" ref={rootRef}>
      <div className="d-flex flex-row justify-content-between align-items-center mb-10">
        <label htmlFor="title-section-input" className="mb-0 create-auction-label">
          {t('create_auction.title')}
        </label>
      </div>
      <input
        name="title-section-input"
        className="create-auction-input create-auction-no-icon-input"
        type="text"
        value={title}
        maxLength={70}
        onBlur={() => {
          props.onChange(title)
        }}
        onChange={handleChange}
        placeholder={t('create_auction.title')}
      />
      <div className="d-flex justify-content-end mt-1">
        <span className="fw-light">{title.length}/70</span>
      </div>

      {!formIsValid && !title.length && !!formSubmitTries && (
        <div className="mt-10">
          <FormErrorMessage
            key={formSubmitTries}
            message={t('create_auction.title_required')}
            isError
          />
        </div>
      )}
    </div>
  )
}
