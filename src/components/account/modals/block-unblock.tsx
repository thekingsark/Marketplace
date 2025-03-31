import { useTranslation } from '@/app/i18n/client'
import { CustomModal } from '@/components/common/custom-modal'
import { Icon } from '@/components/common/icon'
import useGlobalContext from '@/hooks/use-context'
import { useState } from 'react'
import { toast } from 'react-toastify'

interface BlockOrUnblockAccountModalProps {
  isOpened: boolean
  isBlocked: boolean
  accountName: string
  onClose: () => void
  onSubmit: () => Promise<boolean>
}

export const BlockOrUnblockAccountModal = (props: BlockOrUnblockAccountModalProps) => {
  const { accountName, isOpened, isBlocked, onClose, onSubmit } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const [operationInProgress, setOperationInProgress] = useState(false)

  const handleBlockOrUnblock = async () => {
    if (operationInProgress) {
      return
    }

    setOperationInProgress(true)
    const result = await onSubmit()

    if (result) {
      const msg = isBlocked
        ? t('profile.block.was_unblocked', { name: accountName })
        : t('profile.block.was_blocked', { name: accountName })

      toast.success(msg)
      setOperationInProgress(false)
      onClose()
      return
    }

    toast.error(t('generic.something_went_wrong'))
    setOperationInProgress(false)
  }

  return (
    <CustomModal
      open={isOpened}
      onClose={onClose}
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
      <h4>{t(isBlocked ? 'profile.block.unblock' : 'profile.block.title')}</h4>
      <p className="mt-10">
        {t(isBlocked ? 'profile.block.are_you_sure_to_unblock' : 'profile.block.are_you_sure')}
      </p>
      {!isBlocked && <p className="mt-10">{t('profile.block.blocked_cannot_bid')}</p>}

      <div className="d-flex justify-content-between gap-3">
        <button
          className="btn btn-secondary flex-grow-1"
          onClick={onClose}
          aria-label={t('generic.cancel')}
        >
          {t('generic.cancel')}
        </button>
        <button
          className="btn fill-btn flex-grow-1"
          disabled={operationInProgress}
          onClick={handleBlockOrUnblock}
        >
          {operationInProgress ? (
            <Icon type="loading" size={40} />
          ) : (
            t(isBlocked == true ? 'profile.block.unblock_2' : 'profile.block.block')
          )}
        </button>
      </div>
    </CustomModal>
  )
}
