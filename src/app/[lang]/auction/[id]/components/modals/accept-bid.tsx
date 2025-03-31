import { useTranslation } from '@/app/i18n/client'
import { CustomModal } from '@/components/common/custom-modal'
import { Icon } from '@/components/common/icon'
import useGlobalContext from '@/hooks/use-context'
import { useState } from 'react'
import { toast } from 'react-toastify'

export const AcceptBidModal = (props: {
  isOpened: boolean
  close: () => void
  onSubmit: () => Promise<boolean>
}) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const { isOpened, close, onSubmit } = props
  const [acceptInProgress, setAcceptInProgress] = useState(false)

  const handleAccept = async () => {
    if (acceptInProgress) {
      return
    }

    setAcceptInProgress(true)
    const accepted = await onSubmit()
    if (!accepted) {
      toast.error(t('generic.something_went_wrong'))
    } else {
      toast.success(t('auction_details.bids.bid_accepted'))
    }
    setAcceptInProgress(false)

    if (accepted) {
      close()
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
      <h4>{t('auction_details.bids.sure_to_accept')}</h4>
      <p className="mt-10">{t('auction_details.bids.auction_will_be_closed')}</p>
      <p className="mt-0">{t('auction_details.bids.cannot_undo_or_see')}</p>

      <div className="d-flex justify-content-between gap-3">
        <button className="btn btn-secondary flex-grow-1" onClick={() => close()}>
          {t('generic.cancel')}
        </button>
        <button
          className="btn fill-btn flex-grow-1"
          disabled={acceptInProgress}
          onClick={handleAccept}
        >
          {acceptInProgress ? (
            <div className="loader-wrapper">
              <Icon type="loading" size={40} />
            </div>
          ) : (
            t('auction_details.bids.accept_bid')
          )}
        </button>
      </div>
    </CustomModal>
  )
}
