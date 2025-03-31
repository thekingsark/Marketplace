import { Icon } from '@/components/common/icon'
import { useState } from 'react'

export const FormErrorMessage = (props: { message: string; isError?: boolean }) => {
  const [isVisible, setIsVisible] = useState(true)
  const { message, isError } = props

  if (!isVisible) {
    return null
  }

  return (
    <div
      className={`${
        isError ? 'alert alert-danger' : ''
      } d-flex align-items-center justify-content-between w-100`}
    >
      <span> {message}</span>
      <div
        className="close-icon-wrapper d-flex align-items-center"
        onClick={() => setIsVisible(false)}
      >
        <Icon type="generic/close-filled" />
      </div>
    </div>
  )
}
