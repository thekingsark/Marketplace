import { useTranslation } from '@/app/i18n/client'
import { CustomModal } from '@/components/common/custom-modal'
import { Icon } from '@/components/common/icon'
import { AppStore } from '@/core/store'
import useGlobalContext from '@/hooks/use-context'
import { useState } from 'react'
import { toast } from 'react-toastify'

export const CreateAuctionConfirmationModal = (props: {
  isOpened: boolean
  close: () => void
  handleSubmit: () => Promise<void>
}) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const [createInProgess, setCreateInProgress] = useState(false)
  const { isOpened, close } = props

  const handleSubmit = async () => {
    if (createInProgess) {
      return
    }

    if ((AppStore.accountData?.coins || -1) < globalContext.appSettings.auctionsCoinsCost) {
      toast.error(t('coins_for_auction_or_bid.not_enough_for_auction'))
      return
    }

    setCreateInProgress(true)
    await props.handleSubmit()
    setCreateInProgress(false)
    close()
  }

  const { freeAuctionsCount, auctionsCoinsCost } = globalContext.appSettings
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
      <h4 className="mb-20">{t('create_auction.create_auction')}</h4>
      <p className="m-0">
        {t('coins_for_auction_or_bid.reached_max_auctions', {
          no: freeAuctionsCount,
        })}
      </p>
      <p>
        {t('coins_for_auction_or_bid.reached_max_auctions_1', {
          no: auctionsCoinsCost,
        })}
      </p>
      <p>{t('coins_for_auction_or_bid.auction_get_back')}</p>
      <p className="m-0">
        {t('coins_for_auction_or_bid.you_have_coins_no', {
          no: AppStore.accountData?.coins ?? 0,
        })}
      </p>

      <div className="d-flex align-items-center justify-content-between mt-40">
        <button onClick={close} aria-label={t('generic.cancel')}>
          {t('generic.cancel')}
        </button>
        <button className="btn fill-btn" onClick={handleSubmit} aria-label={t('generic.done')}>
          {createInProgess ? (
            <div className="loader-wrapper">
              <Icon type="loading" size={40} />
            </div>
          ) : (
            <>
              <Icon type="generic/coin" />
              <span className="ml-5"> {t('create_auction.create_auction')}</span>
            </>
          )}
        </button>
      </div>
    </CustomModal>
  )
}
