import { useTranslation } from '@/app/i18n/client'
import useGlobalContext from '@/hooks/use-context'
import { useState } from 'react'

interface AuctionFormYoutubeSectionProps {
  initialLink?: string
  onChange: (link: string) => void
}

export const AuctionFormYoutubeSection = (props: AuctionFormYoutubeSectionProps) => {
  const { initialLink } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const [youtubeLink, setYoutubeLink] = useState<string>(initialLink ?? '')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYoutubeLink(e.target.value)
  }

  return (
    <div className="mt-10">
      <div className="d-flex flex-row justify-content-between align-items-center mb-10">
        <label htmlFor="title-section-input" className="mb-0 create-auction-label">
          {t('create_auction.youtube_link')}
          <span className="fw-light"> {t('generic.optional')}</span>

        </label>
      </div>
      <input
        name="title-section-input"
        className="create-auction-input create-auction-no-icon-input"
        type="text"
        value={youtubeLink}
        maxLength={70}
        onBlur={() => {
          props.onChange(youtubeLink)
        }}
        onChange={handleChange}
        placeholder={t('create_auction.enter_youtube_link')}
      />
    </div>
  )
}
