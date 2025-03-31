import { useTranslation } from '@/app/i18n/client'
import { CustomModal } from '@/components/common/custom-modal'
import { Icon } from '@/components/common/icon'
import useGlobalContext from '@/hooks/use-context'
import { useState } from 'react'
import { toast } from 'react-toastify'

export const DeleteFilterModal = (props: {
  isOpened: boolean
  close: () => void
  onSubmit: () => Promise<boolean>
}) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)
  const { isOpened, close } = props

  const [deleteInProgress, setDeleteInProgress] = useState(false)

  const handleDelete = async () => {
    if (deleteInProgress) {
      return
    }

    setDeleteInProgress(true)
    const deleted = await props.onSubmit()
    setDeleteInProgress(false)

    if (deleted) {
      close()
    } else {
      toast.error(t('generic.something_went_wrong'))
    }
  }

  return (
    <CustomModal
      open={isOpened}
      onClose={close}
      styles={{
        modal: {
          maxWidth: '550px',
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
      <p>{t('home.filter.sure_you_want_to_remove')}</p>

      <div className="mt-20 d-flex justify-content-between gap-3 mt-10">
        <button
          className={`btn w-100 fill-btn`}
          disabled={deleteInProgress}
          type="submit"
          onClick={handleDelete}
        >
          {deleteInProgress ? (
            <div className="loader-wrapper d-flex align-items-center justify-content-center">
              <Icon type="loading" color={'#fff'} size={40} />
            </div>
          ) : (
            t('generic.remove')
          )}
        </button>
      </div>
    </CustomModal>
  )
}
