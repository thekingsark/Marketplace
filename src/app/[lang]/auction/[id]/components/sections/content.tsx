'use client'
import { useTranslation } from '@/app/i18n/client'
import LoveButton from '@/components/common/love-button'
import useGlobalContext from '@/hooks/use-context'
import { observer } from 'mobx-react-lite'
import ShowMoreText from 'react-show-more-text'
import { Auction } from '@/core/domain/auction'
import { AppStore } from '@/core/store'
import { useEffect, useState } from 'react'
import { ShareTextButton } from '@/components/share/text-button'
import { Icon } from '@/components/common/icon'
import { FormattedDate } from '@/components/common/formatted-date'

export const AuctionDetailsContentSection = observer(
  (props: {
    auction: Auction
    shouldEnableTranslation: boolean
    openReport: () => void
    handleLoveTap: (isLiked: boolean) => boolean
    translateContent: () => Promise<{ title: string; description: string }>
  }) => {
    const { auction, shouldEnableTranslation, openReport } = props
    const globalContext = useGlobalContext()
    const currentLanguage = globalContext.currentLanguage
    const { t } = useTranslation(currentLanguage)

    const isInFavourites = AppStore.favouriteAuctions.some((item) => item.id === auction.id)

    const [isLiked, setIsLiked] = useState(isInFavourites)

    const [displayTranslatedContent, setDisplayTranslatedContent] = useState(false)
    const [translationInProgress, setTranslationInProgress] = useState(false)
    const [translatedTitle, setTranslatedTitle] = useState('')
    const [translatedDescription, setTranslatedDescription] = useState('')

    useEffect(() => {
      if (isInFavourites !== isLiked) {
        setIsLiked(isInFavourites)
      }
    }, [isInFavourites])

    const handleLoveTap = (isLiked: boolean) => {
      const canTapLove = props.handleLoveTap(isLiked)
      if (canTapLove) {
        setIsLiked(isLiked)
      }
    }

    const translateContent = async () => {
      if (displayTranslatedContent) {
        setDisplayTranslatedContent(false)
        return
      }

      if (!displayTranslatedContent && translatedTitle?.length) {
        setDisplayTranslatedContent(true)
        return
      }

      if (translationInProgress) {
        return
      }

      setTranslationInProgress(true)
      try {
        const translationResult = await props.translateContent()
        setTranslatedTitle(translationResult.title)
        setTranslatedDescription(translationResult.description)
        setDisplayTranslatedContent(true)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
      } finally {
        setTranslationInProgress(false)
      }
    }

    return (
      <div>
        <div className="d-flex align-items-center justify-content-between">
          <p className="auction-details-title">
            {displayTranslatedContent ? translatedTitle : (auction.title as string)}
          </p>
          <LoveButton liked={isLiked} onTap={handleLoveTap} transparentBackground />
        </div>
        <div className="mt-10">
          <span className="auction-details-section-title">{t('create_auction.description')}</span>
          {(auction.description as string)?.length ? (
            <span className="secondary-color auction-description-text">
              <ShowMoreText
                lines={3}
                more={t('generic.see_more')}
                less={t('generic.see_less')}
                anchorClass="blue-text"
                expanded={false}
              >
                {displayTranslatedContent ? translatedDescription : (auction.description as string)}
              </ShowMoreText>
            </span>
          ) : (
            <div>
              <span className="secondary-color">
                {t('auction_details.no_description_provided')}
              </span>
            </div>
          )}
        </div>

        {shouldEnableTranslation && (
          <div className="d-flex justify-content-start mt-10">
            {translationInProgress ? (
              <div className="loader-wrapper">
                <Icon type="loading" size={28} />
              </div>
            ) : (
              <span className="translation-text" onClick={translateContent}>
                {displayTranslatedContent ? t('generic.see_original') : t('generic.translate')}
              </span>
            )}
          </div>
        )}

        <div className="top-border mt-10 ">
          <div className="d-flex align-items-center justify-content-between p-1 mt-10">
            <ShareTextButton url={`/auction/${auction.id}`} title={t('share.check_auction')} />
            <div>
              {auction.promotedAt && (
                <div>
                  <span className="secondary-color">{t('promote_auction.promoted_at')}: </span>
                  <span> <FormattedDate date={auction.promotedAt} format='D MMM, H:mm' /> </span>
                </div>
              )}
            </div>
            <span className="auction-details-report-text" onClick={openReport}>
              {t('auction_details.app_bar.report_auction')}
            </span>
          </div>
        </div>
      </div>
    )
  }
)
