import { useTranslation } from '@/app/i18n/client'
import useGlobalContext from '@/hooks/use-context'
import { ShareModal } from './modal'
import { useState } from 'react'

export const ShareTextButton = (props: { url: string; title: string; fullWidth?: boolean }) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)
  const { fullWidth = false } = props

  const [modalOpened, setModalOpened] = useState(false)

  const toggleModal = () => {
    setModalOpened(!modalOpened)
  }

  return (
    <>
      <span className={`share-button ${fullWidth ? 'w-100' : ''}`} onClick={toggleModal}>
        {t('share.button')}
      </span>
      <ShareModal {...props} isOpened={modalOpened} close={toggleModal} />
      <style jsx>{`
        .share-button {
          color: var(--clr-blue);
          cursor: pointer;
        }
      `}</style>
    </>
  )
}
