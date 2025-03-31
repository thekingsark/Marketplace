import { useTranslation } from '@/app/i18n/client'
import useGlobalContext from '@/hooks/use-context'
import { CustomModal } from '../../common/custom-modal'
import { Icon } from '../../common/icon'

export const WouldYouLikeToSeeHowTheAppWorksModal = (props: {
  isOpened: boolean
  close: () => void
  onSubmit: () => void
}) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)
  const { isOpened, close, onSubmit } = props

  return (
    <CustomModal
      open={isOpened}
      onClose={close}
      styles={{
        modal: {
          maxWidth: '550px',
          minHeight: '200px',
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
      <div className="d-flex align-items-center">
        <Icon type="intro/lighthouse" size={48} />
        <h4 className="ml-10 mt-10 mb-0">
          {t('intro.would_you_like_to_see')} {globalContext.appSettings.appName}{' '}
          {t('intro.would_you_like_to_see_2')}{' '}
        </h4>
      </div>

      <p className="mt-20 mb-0">{t('intro.a_guid_on_how_it_words')}</p>
      <div className="mt-40 d-flex align-items-center gap-2">
        <button className="btn btn-secondary d-flex flex-grow-1 no-btn" onClick={close}>
          {t('intro.not_now')}
        </button>
        <button className="btn fill-btn d-flex flex-grow-1 yes-btn" onClick={onSubmit}>
          {t('intro.see_intro')}
        </button>
      </div>

      <style jsx>{`
        .yes-btn,
        .no-btn {
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </CustomModal>
  )
}
