import { useTranslation } from '@/app/i18n/client'
import { CustomModal } from '@/components/common/custom-modal'
import { Icon } from '@/components/common/icon'
import useGlobalContext from '@/hooks/use-context'
import { useState } from 'react'
import { toast } from 'react-toastify'

export const AuctionAddCustomPriceModal = (props: {
  isOpened: boolean
  close: () => void
  handleSubmit: (price: number) => void
}) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const [value, setValue] = useState<string>('')
  const { isOpened, close } = props

  const handleSubmit = () => {
    if (!value) {
      toast.error(t('create_auction.price_cannot_be_empty'))
      return
    }

    try {
      const price = parseFloat(value)
      if (price < 1 || price > (globalContext.appSettings?.maxProductPrice || 10000000)) {
        toast.error(
          t('create_auction.starting_price_condition', {
            maxPrice: globalContext.appSettings?.maxProductPrice || 10000000,
          })
        )
        return
      }

      props.handleSubmit(price)
    } catch (error) {
      console.error(`Failed to parse price: ${error}`)
      toast.error(t('create_auction.invalid_starting_price'))
      return
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
      <h4>{t('create_auction.starting_price')}</h4>
      <div className="mt-40">
        <input
          className="custom-price-input"
          type="number"
          min={1}
          max={5000}
          name="custom_book_title"
          value={value}
          required
          onChange={(e) => setValue(e.target.value)}
          placeholder={t('create_auction.add_starting_price')}
        />
      </div>

      <div className="d-flex align-items-center justify-content-between mt-40">
        <button onClick={close} aria-label={t('generic.cancel')}>
          {t('generic.cancel')}
        </button>
        <button className="btn fill-btn" onClick={handleSubmit} aria-label={t('generic.done')}>
          {t('generic.done')}
        </button>
      </div>

      <style jsx>{`
        .custom-price-input {
          border: 1px solid var(--separator);
          border-radius: 6px;
          height: 60px;
          background: var(--background_4);
          color: var(--font_1);
          font-size: 16px;
          padding: 8px 16px;
          outline: none;
          box-shadow: none;
          width: 100%;
          margin: 0 !important;
        }
      `}</style>
    </CustomModal>
  )
}
