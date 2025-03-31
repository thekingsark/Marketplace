import { useTranslation } from '@/app/i18n/client'
import { CustomModal } from '@/components/common/custom-modal'
import { Icon } from '@/components/common/icon'
import useGlobalContext from '@/hooks/use-context'
import { useState } from 'react'
import { toast } from 'react-toastify'

export const RejectBidModal = (props: {
  isOpened: boolean
  close: () => void
  onSubmit: (reason?: string) => Promise<boolean>
}) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const { isOpened, close, onSubmit } = props
  const [rejectInProgress, setRejectInProgress] = useState(false)
  const [reason, setReason] = useState('')

  const handleReject = async () => {
    if (rejectInProgress) {
      return
    }

    setRejectInProgress(true)
    const rejected = await onSubmit(reason)
    if (!rejected) {
      toast.error(t('generic.something_went_wrong'))
    } else {
      toast.success(t('auction_details.bids.bid_rejected'))
    }
    setRejectInProgress(false)

    if (rejected) {
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
      <h4>{t('auction_details.bids.sure_to_reject')}</h4>
      <p className="mt-10">{t('auction_details.bids.enter_rejection_reason')}</p>

      <div className="reject-reason-root mt-10">
        <textarea
          name="description"
          id="description"
          className="reason-textarea"
          value={reason}
          maxLength={200}
          onChange={(e) => setReason(e.target.value)}
          placeholder={t('auction_details.bids.enter_rejection_reason')}
        />
      </div>
      <p className="mt-0">{t('auction_details.bids.cannot_undo_or_see')}</p>

      <div className="d-flex justify-content-between gap-3">
        <button
          className="btn btn-secondary remove-auction-modal-button flex-grow-1"
          onClick={() => close()}
        >
          {t('generic.cancel')}
        </button>
        <button
          className="btn fill-btn remove-auction-modal-button flex-grow-1"
          disabled={rejectInProgress}
          onClick={handleReject}
        >
          {rejectInProgress ? (
            <div className="loader-wrapper">
              <Icon type="loading" size={40} />
            </div>
          ) : (
            t('auction_details.bids.reject_bid')
          )}
        </button>
      </div>

      <style jsx>{`
        .reason-textarea {
          height: 100px;
          width: 100%;
          border: 1px solid var(--separator);
          border-radius: 6px;
          background: var(--background_4);
          color: var(--clr-common-heading);
          font-size: 16px;
          padding: 15px 20px;
          outline: none;
          box-shadow: none;
          resize: none;
        }
      `}</style>
    </CustomModal>
  )
}
