import { useEffect } from 'react'
import Modal, { ModalProps } from 'react-responsive-modal'

export const CustomModal = (props: ModalProps) => {
  useEffect(() => {
    if (props.open) {
      setTimeout(() => {
        const htmlElement = document.getElementsByTagName('html')
        if (htmlElement?.length) {
          htmlElement[0].style.overflow = 'hidden'
        }
      }, 0)
    }

    return () => {
      const htmlElement = document.getElementsByTagName('html')
      if (htmlElement?.length) {
        htmlElement[0].style.overflow = 'unset'
      }
    }
  }, [props.open])

  return <Modal {...props} />
}
