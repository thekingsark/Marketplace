import React from 'react'
import ReactPlayer from 'react-player/lazy'
import { CustomModal } from './custom-modal'
import { Icon } from './icon'

interface VideoPlayerModalProps {
  isOpened: boolean
  videoUrl: string
  close: (e?: React.MouseEvent) => void
}

export const VideoPlayerModal = (props: VideoPlayerModalProps) => {
  const { isOpened, videoUrl, close } = props
  return (
    <CustomModal
      onOverlayClick={(ev) => {
        ev.stopPropagation()
        close()
      }}
      open={isOpened}
      onClose={close}
      closeOnEsc={true}
      closeOnOverlayClick={false}
      styles={{
        modal: {
          height: '90vh',
          width: '90%',
          maxWidth: '90%',
          backgroundColor: 'var(--background_2)',
        },
        overlay: {
          background: 'rgba(0, 0, 0, 0.5)',
        },
      }}
      classNames={{
        modal: 'info-modal',
      }}
      closeIcon={<Icon type="generic/close-filled" />}
      center
    >
      <div
        className="d-flex align-items-center justify-content-center h-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="d-flex  align-items-center justify-content-center position-relative w-100"
          style={{ aspectRatio: '16/9', maxHeight: '85vh', backgroundColor: 'var(--background_2)' }}
        >
          <ReactPlayer
            url={videoUrl}
            controls
            width="100%"
            height="100%"
          />
        </div>
      </div>
    </CustomModal>
  )
}
