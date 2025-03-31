'use client'
import { useTranslation } from '@/app/i18n/client'
import useGlobalContext from '@/hooks/use-context'
import { CustomModal } from '../common/custom-modal'
import { Icon } from '../common/icon'
import { loadStripe } from '@stripe/stripe-js'
import { NoDataCard } from '../common/no-data-card'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { PaymentsController } from '@/core/controllers/payment'
import { toast } from 'react-toastify'
import { BuyCoinsCard } from './buy-coins-card'
import Image from 'next/image'

import PayPalImage from '@/../public/assets/img/payment/paypal.png'
import RazorPayWhiteImage from '@/../public/assets/img/payment/razorpay-white.png'
import RazorpayImage from '@/../public/assets/img/payment/razorpay.png'
import StripeImage from '@/../public/assets/img/payment/stripe.png'
import { useTheme } from 'next-themes'
import { PaymentProduct } from '@/core/domain/payment-product'
import { PriceText } from '../common/price-text'
import { useCurrentCurrency } from '@/hooks/current-currency'

interface BuyCoinsModalProps {
  isOpened: boolean
  close: (sessionUrl?: string) => void
}

export const BuyCoinsModal = observer((props: BuyCoinsModalProps) => {
  const { isOpened, close } = props
  const globalContext = useGlobalContext()
  const { currentLanguage, availablePayments, paymentProducts } = globalContext
  const { t } = useTranslation(currentLanguage)
  const { theme } = useTheme()

  const currentCurrency = useCurrentCurrency()

  const [paymentInProgress, setPaymentInProgress] = useState(false)

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<PaymentProduct | null>(null)

  const handleStripe = async () => {
    const checkoutSession = await PaymentsController.createStripePaymentSession(selectedProduct!.id, currentCurrency?.id)

    if (!checkoutSession || !checkoutSession.id) {
      toast.error(t('generic.something_went_wrong'))
      return
    }

    close(checkoutSession.url)
  }

  const handlePaypal = async () => {
    const checkoutSessionUrl = await PaymentsController.createPaypalPaymentSession(selectedProduct!.id, currentCurrency?.id)
    if (!checkoutSessionUrl) {
      toast.error(t('generic.something_went_wrong'))
      return
    }

    close(checkoutSessionUrl)
  }

  const handleRazorpay = async () => {

  }

  const handlePurchase = async () => {
    if (paymentInProgress || !selectedProduct || !selectedPaymentMethod) {
      return
    }

    try {
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string)
      if (!stripe) {
        return
      }

      setPaymentInProgress(true)

      if (selectedPaymentMethod === 'stripe') {
        await handleStripe()
        return
      }

      if (selectedPaymentMethod === 'paypal') {
        await handlePaypal()
        return
      }

      if (selectedPaymentMethod === 'razorpay') {
        await handleRazorpay()
      }
    } catch (error) {
      console.error(`Failed to create checkout session: ${error}`)
      toast.error(t('generic.something_went_wrong'))
    } finally {
      setPaymentInProgress(false)
    }
  }


  const paymentMethodWidth = availablePayments.length === 1 ? 'col-12' : availablePayments.length === 2 ? 'col-md-6' : 'col-md-4'

  return (
    <CustomModal
      open={isOpened}
      onClose={close}
      styles={{
        modal: {
          maxWidth: '750px',
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
      <h4 className="mb-10">{t('buy_coins.buy_coins')}</h4>

      <p className="mt-10 mb-0 fw-bold">{t('payment.step_1')}</p>

      {!paymentProducts?.length && (
        <NoDataCard
          title={t('payment.no_products_available')}
          background="var(--background_2)"
        />
      )}

      <div className="d-flex row pr-10 pl-10">
        {paymentProducts?.map((product, index) => {
          return (
            <div key={index} className={`col-12 col-md-4 p-1`}>
              <BuyCoinsCard
                title={
                  <div className="mb-10 d-flex align-items-center gap-2">
                    <Icon type="generic/coin" />
                    <span className="fw-bold">
                      {t('buy_coins.coins_no', { no: product.coinsNo })}
                    </span>
                  </div>
                }
                description={
                  <p className="m-0 d-flex align-items-center align-items-md-start gap-1 flex-row flex-md-column">
                    <span>{t('payment.purchase_this_package_for')}</span>
                    <span className="fw-bold">
                      <PriceText price={product.priceInUSD} useIntegerOnly />
                    </span>
                  </p>
                }
                selected={selectedProduct?.id === product.id}
                handleSelect={() => {
                  setSelectedProduct(product)
                }}
              />
            </div>
          )
        })}
      </div>

      <p className="mt-30 mb-0 fw-bold">{t('payment.step_2')}</p>
      <div className="d-flex row pr-10 pl-10">
        {availablePayments.includes('stripe') && (
          <div className={`col-12 ${paymentMethodWidth} p-1`}>
            <BuyCoinsCard
              title={
                <div className="d-flex flex-row flex-md-column justify-content-start justify-content-md-center align-items-center gap-2 w-100">
                  <Image src={StripeImage} alt="PayPal" width={120} height={40} />
                  <span className="fw-bold">Stripe</span>
                </div>
              }
              selected={selectedPaymentMethod === 'stripe'}
              handleSelect={() => {
                setSelectedPaymentMethod('stripe')
              }}
            />
          </div>
        )}
        {availablePayments.includes('paypal') && (
          <div className={`col-12 ${paymentMethodWidth} p-1`}>
            <BuyCoinsCard
              title={
                <div className="d-flex flex-row flex-md-column justify-content-start justify-content-md-center align-items-center gap-2 w-100">
                  <Image src={PayPalImage} alt="PayPal" width={150} height={40} />
                  <span className="fw-bold">PayPal</span>
                </div>
              }
              selected={selectedPaymentMethod === 'paypal'}
              handleSelect={() => {
                setSelectedPaymentMethod('paypal')
              }}
            />
          </div>
        )}
        {availablePayments.includes('razorpay') && (
          <div className={`col-12 ${paymentMethodWidth} p-1`}>
            <BuyCoinsCard
              title={
                <div className="d-flex flex-row flex-md-column justify-content-start justify-content-md-center align-items-center gap-2 w-100">
                  <Image
                    src={theme === 'dark' ? RazorPayWhiteImage : RazorpayImage}
                    alt="Razorpay"
                    width={130}
                    height={40}
                  />
                  <span className="fw-bold">Razorpay</span>
                </div>
              }
              selected={selectedPaymentMethod === 'razorpay'}
              handleSelect={() => {
                setSelectedPaymentMethod('razorpay')
              }}
            />
          </div>
        )}
      </div>

      <div className="d-flex mt-50 gap-2 justify-content-end">
        <button
          className={`${!selectedProduct || !selectedPaymentMethod ? 'border-btn' : 'fill-btn'}`}
          disabled={!selectedProduct || !selectedPaymentMethod}
          onClick={handlePurchase}
        >
          {paymentInProgress ? <Icon type="generic/loading" /> : 'Proceed to payment'}
        </button>
      </div>
    </CustomModal>
  )
})
