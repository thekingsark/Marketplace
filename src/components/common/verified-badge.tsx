import { useState } from 'react'
import { UserVerifiedModal } from '../modals/verified-modal'
import { Icon, ValidIconSize } from './icon'

interface VerifiedBadgeProps {
  verified?: boolean
  size?: ValidIconSize
}
export const VerifiedBadge = (props: VerifiedBadgeProps) => {
  const { verified = false, size = 24 } = props

  const [modalInfoOpened, setModalInfoOpened] = useState(false)

  const openInfoModal = (ev: React.MouseEvent) => {
    ev.stopPropagation()
    ev.preventDefault()
    setModalInfoOpened(!modalInfoOpened)
  }

  const closeInfoModal = () => {
    setModalInfoOpened(false)
  }

  if (!verified) {
    return null
  }

  return (
    <div className="verified-badge" onClick={openInfoModal}>
      <Icon type="generic/verified" size={size} />
      <UserVerifiedModal isOpened={modalInfoOpened} close={closeInfoModal} />
    </div>
  )
}
