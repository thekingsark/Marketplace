import { useTranslation } from '@/app/i18n/client'
import { CustomModal } from '@/components/common/custom-modal'
import { Icon } from '@/components/common/icon'
import useGlobalContext from '@/hooks/use-context'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-toastify'

export const RemoveAuctionModal = (props: {
  isOpened: boolean
  handleSubmit: () => Promise<boolean>
  close: () => void
}) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const router = useRouter()
  const { isOpened, close } = props
  const [removeInProgress, setRemoveInProgress] = useState(false)

  const handleSubmit = async () => {
    if (removeInProgress) {
      return
    }

    setRemoveInProgress(true)
    const removed = await props.handleSubmit()
    setRemoveInProgress(false)

    if (removed) {
      toast.success(t('auction_details.dialogs.auction_removed'))
      close()
      router.push('/')
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
      <p>{t('auction_details.dialogs.sure_to_remove_auction')} </p>
      <span className="secondary-color">
        {t('auction_details.dialogs.bidders_will_be_notified_after_remove')}
      </span>

      <div className="d-flex justify-content-between gap-3 mt-20">
        <button className="btn btn-secondary remove-bid-modal-button" onClick={() => close()}>
          {t('generic.cancel')}
        </button>
        <button
          className="btn fill-btn remove-bid-modal-button"
          disabled={removeInProgress}
          onClick={handleSubmit}
        >
          {removeInProgress ? (
            <div className="loader-wrapper d-flex align-items-center justify-content-center">
              <Icon type="loading" color={'#fff'} size={40} />
            </div>
          ) : (
            t('generic.yes')
          )}
        </button>
      </div>

      <style jsx>{`
        .remove-bid-modal-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </CustomModal>
  )
}
