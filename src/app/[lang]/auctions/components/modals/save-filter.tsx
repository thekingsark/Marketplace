import { useTranslation } from '@/app/i18n/client'
import { CustomModal } from '@/components/common/custom-modal'
import { Icon } from '@/components/common/icon'
import useGlobalContext from '@/hooks/use-context'
import { useState } from 'react'
import { toast } from 'react-toastify'

export const SaveFilterModal = (props: {
  isOpened: boolean
  close: () => void
  onSubmit: (title: string) => Promise<boolean>
}) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)
  const { isOpened, close } = props

  const [title, setTitle] = useState('')
  const [saveInProgress, setSaveInProgress] = useState(false)

  const handleSave = async () => {
    if (saveInProgress || !title.length) {
      return
    }

    setSaveInProgress(true)
    const saved = await props.onSubmit(title)
    setSaveInProgress(false)

    if (saved) {
      setTitle('')
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
      <h4>{t('home.filter.save_filter_title')} </h4>

      <div className="single-input-unit mt-40">
        <label htmlFor="save-filter-name" className="mb-0 create-auction-label">
          {t('home.filter.save_filter_name')}
        </label>
        <div className="d-flex align-items-center justify-content-center mt-20">
          <div className="position-relative w-100">
            <input
              name="save-filter-name"
              value={title}
              maxLength={50}
              placeholder={t('home.filter.save_filter_name')}
              onChange={(e) => {
                setTitle(e.target.value)
              }}
              style={{
                margin: 0,
                height: 60,
                width: '100%',
                background: 'var(--background_4)',
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-20 d-flex justify-content-between gap-3 mt-10">
        <button
          className={`btn w-100 ${title.length ? 'fill-btn' : 'disabled-btn'}`}
          disabled={saveInProgress}
          type="submit"
          onClick={handleSave}
        >
          {saveInProgress ? (
            <div className="loader-wrapper d-flex align-items-center justify-content-center">
              <Icon type="loading" color={'#fff'} size={40} />
            </div>
          ) : (
            t('generic.save')
          )}
        </button>
      </div>
    </CustomModal>
  )
}
