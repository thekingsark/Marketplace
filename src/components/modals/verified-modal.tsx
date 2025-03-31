import { useTranslation } from '@/app/i18n/client'
import { CustomModal } from '@/components/common/custom-modal'
import { Icon } from '@/components/common/icon'
import useGlobalContext from '@/hooks/use-context'

export const UserVerifiedModal = (props: {
  isOpened: boolean
  close: () => void
}) => {
  const { isOpened, close } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  return (
    <CustomModal
      open={isOpened}
      onClose={close}
      styles={{
        modal: {
          maxWidth: '450px',
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
      <p>{t('verification.account_verification')}</p>
      <p>
        {t('verification.verified_info')}
      </p>

      <div className="mt-20 d-flex justify-content-between gap-3 mt-10">
        <button
          className={`btn w-100 fill-btn`}
          type="submit"
          onClick={close}
          aria-label={t('generic.ok')}
        >
          {t('generic.ok')}
        </button>
      </div>
    </CustomModal>
  )
}
