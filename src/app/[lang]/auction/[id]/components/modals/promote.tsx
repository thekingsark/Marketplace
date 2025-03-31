import { useTranslation } from '@/app/i18n/client'
import { CustomModal } from '@/components/common/custom-modal'
import { Icon } from '@/components/common/icon'
import { AppStore } from '@/core/store'
import useGlobalContext from '@/hooks/use-context'
import { useState } from 'react'
import { toast } from 'react-toastify'

export const PromoteAuctionModal = (props: {
  isOpened: boolean
  handleSubmit: () => Promise<boolean>
  close: () => void
}) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const { isOpened, close } = props
  const [removeInProgress, setRemoveInProgress] = useState(false)

  const handleSubmit = async () => {
    if (removeInProgress) {
      return
    }

    const accountCoins = AppStore.accountData?.coins ?? 0
    const requiredCoins = globalContext.appSettings.promotionCoinsCost

    if (accountCoins < requiredCoins) {
      toast.error(t('promote_auction.don_t_have_enough_coins'))
      return false
    }

    setRemoveInProgress(true)
    const removed = await props.handleSubmit()
    setRemoveInProgress(false)

    if (removed) {
      toast.success(t('promote_auction.auction_promoted'))
      close()
    } else {
      toast.error(t('promote_auction.could_not_promote'))
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
      <p>{t('promote_auction.sure_you_want_to_promote')} </p>
      <span className="secondary-color">{t('promote_auction.promoted_will_show')}</span>
      <div className="mt-10">
        <span className="secondary-color">{t('promote_auction.can_be_pushed_down')}</span>
      </div>
      <div className="mt-10 align-items-center">
        <span className="secondary-color">
          {t('promote_auction.promotion_cost', {
            no: globalContext.appSettings.promotionCoinsCost,
          })}
        </span>
      </div>
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
            <div className="d-flex align-items-center gap-2">
              <Icon type="generic/coin" />
              <span>{t('promote_auction.promote_auction')}</span>
            </div>
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
