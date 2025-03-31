import { useTranslation } from '@/app/i18n/client'
import { Auction } from '@/core/domain/auction'
import useGlobalContext from '@/hooks/use-context'
import { Icon } from '../common/icon'
import { useState } from 'react'
import { VideoPlayerModal } from '../common/video-player-modal'

export const AuctionPlayVideoButton = (props: { auction: Auction }) => {
  const { auction } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const [modalOpened, setModalOpened] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    e.preventDefault()
    e.nativeEvent.stopImmediatePropagation()
    setModalOpened(true)
  }

  return (
    auction.youtubeLink && (
      <div className="mt-2" onClick={(e) => e.stopPropagation()}>
        <div
          className="play-video-auction-button"
          title={t('generic.see_video')}
          onClick={handleClick}
        >
          <Icon type="generic/play" size={28} color="var(--font_1)" />
        </div>
        <VideoPlayerModal videoUrl={auction.youtubeLink} isOpened={modalOpened} close={(e) => {
          e?.stopPropagation()
          e?.preventDefault()
          e?.nativeEvent?.stopImmediatePropagation()
          setModalOpened(false)
        }} />
      </div>
    )
  )
}
