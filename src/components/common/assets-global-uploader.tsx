import { getDroppedFilesFromEvent } from '@/utils'
import { useEffect } from 'react'

export const AssetsGlobalUploader = (props: { onUpload: (files: File[]) => void }) => {
  const handleFileStart = (ev: DragEvent) => {
    if (ev.dataTransfer?.items?.[0]?.kind === 'file') {
      // this.observableGUIFlags.set(GUI_FLAGS.FILE_IS_DRAGGED, true)
      ev.preventDefault()
      ev.stopPropagation()
    }
  }

  const handleDragLeave = (ev: DragEvent) => {
    ev.preventDefault()
    ev.stopPropagation()
  }

  const handleDragEnter = (ev: DragEvent) => {
    ev.preventDefault()
    ev.stopPropagation()
  }

  const handleFileDrop = (ev: DragEvent) => {
    if (ev.dataTransfer?.items?.[0]?.kind === 'file') {
      ev.preventDefault()
      ev.stopPropagation()
      const files = getDroppedFilesFromEvent(
        ev as unknown as React.DragEvent<HTMLDivElement>
      ) as File[]

      props.onUpload(files)
    }
  }

  useEffect(() => {
    window.addEventListener('dragover', handleFileStart)
    window.addEventListener('dragleave', handleDragLeave)
    window.addEventListener('dragenter', handleDragEnter)
    window.addEventListener('drop', handleFileDrop)

    return () => {
      window.removeEventListener('dragover', handleFileStart)
      window.removeEventListener('dragleave', handleDragLeave)
      window.removeEventListener('dragenter', handleDragEnter)
      window.removeEventListener('drop', handleFileDrop)
    }
  }, [])

  return <></>
}
