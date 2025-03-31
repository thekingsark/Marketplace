import { useTranslation } from '@/app/i18n/client'
import { Icon } from '@/components/common/icon'
import { VideoPlayerModal } from '@/components/common/video-player-modal'
import { Auction } from '@/core/domain/auction'
import useGlobalContext from '@/hooks/use-context'
import { useState } from 'react'

export const AuctionDetailsPlayVideoButton = (props: { auction: Auction }) => {
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
      <div onClick={(e) => e.stopPropagation()}>
        <div
          className="d-flex align-items-center justify-content-center gap-2 cursor-pointer"
          title={t('generic.see_video')}
          onClick={handleClick}
        >
          <span>{t('generic.see_video')}</span>
          <Icon type="generic/play" size={20} color="var(--font_1)" />
        </div>
        <VideoPlayerModal videoUrl={auction.youtubeLink} isOpened={modalOpened} close={(e?: React.MouseEvent) => {
          e?.stopPropagation()
          e?.preventDefault()
          e?.nativeEvent?.stopImmediatePropagation()
          setModalOpened(false)
        }} />
      </div>
    )
  )
}
