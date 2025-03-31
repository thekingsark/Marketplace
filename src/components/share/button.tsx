import { useTranslation } from '@/app/i18n/client'
import useGlobalContext from '@/hooks/use-context'
import { ShareModal } from './modal'
import { useState } from 'react'
import { Icon } from '../common/icon'

export const ShareButton = (props: { url: string; title: string; fullWidth?: boolean }) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)
  const { fullWidth = false } = props

  const [modalOpened, setModalOpened] = useState(false)

  const toggleModal = () => {
    setModalOpened(!modalOpened)
  }

  return (
    <button className={`border-btn ${fullWidth ? 'w-100' : ''}`} onClick={toggleModal}>
      <div className='d-flex align-items-center justify-content-center gap-2'>
        <Icon type="generic/share" size={16} />
        <span>
          {t('share.button')}
        </span>
      </div>
      <ShareModal {...props} isOpened={modalOpened} close={toggleModal} />
    </button>
  )
}
