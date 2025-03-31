import * as React from 'react'

export interface FilePickerButtonProps {
  accept?: string
  multiple?: boolean
  disabled?: boolean
  ref?: React.Ref<HTMLButtonElement>
  hidden?: boolean
  onFilesPick: (files: File[]) => unknown
  children: React.ReactNode
}

export const FilePickerButton = (props: FilePickerButtonProps) => {
  const { onFilesPick, accept, multiple, children, disabled, hidden } = props

  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleButtonClick = React.useCallback(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.click()
    }
  }, [inputRef])

  const handleInputChange = React.useCallback(() => {
    if (!inputRef.current || disabled) {
      return
    }

    onFilesPick(inputRef.current.files as unknown as File[])
  }, [inputRef, disabled, onFilesPick])

  return (
    <>
      <input
        onChange={handleInputChange}
        onClick={(event) => {
          const element = event.currentTarget as HTMLInputElement
          element.value = ''
        }}
        ref={inputRef}
        type="file"
        accept={accept}
        disabled={disabled}
        multiple={multiple}
        className="file-input"
      />

      {!hidden && (
        <div className="assets-upload mt-20" onClick={handleButtonClick}>
          <div className="assets-upload-inner">
            <p className="mb-0">{children}</p>
          </div>
        </div>
      )}
    </>
  )
}
