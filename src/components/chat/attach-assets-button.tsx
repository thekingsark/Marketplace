import { useRef, useCallback } from "react"
import { Icon } from "../common/icon"
import { toast } from "react-toastify"
import useGlobalContext from "@/hooks/use-context"
import { useTranslation } from "@/app/i18n/client"

export const AttachAssetsToMessageButton = (props: {
  onFilesPick: (files: File[]) => unknown
  maxFilesCount?: number
}) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const { onFilesPick, maxFilesCount = 5 } = props
  const inputRef = useRef<HTMLInputElement>(null)

  const handleButtonClick = useCallback(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.click()
    }
  }, [inputRef])

  const handleInputChange = useCallback(() => {
    if (!inputRef.current) {
      return
    }

    const files = inputRef.current.files
    if (!files) {
      return
    }

    if (files?.length > maxFilesCount) {
      toast.error(t('assets.max_allowed', { no: maxFilesCount }))
      return
    }

    onFilesPick(files as unknown as File[])
  }, [inputRef, onFilesPick])

  return <>
    <input
      onChange={handleInputChange}
      onClick={(event) => {
        const element = event.currentTarget as HTMLInputElement
        element.value = ''
      }}
      ref={inputRef}
      type="file"
      accept="image/jpeg, image/png, image/webp, image/tiff, image/heic, image/heif"
      multiple={true}
      className="file-input"
    />

    <div
      onClick={handleButtonClick}
      className="d-flex align-items-center justify-content-center cursor-pointer"
    >
      <Icon type="chat/attach" />
    </div>
  </>
}