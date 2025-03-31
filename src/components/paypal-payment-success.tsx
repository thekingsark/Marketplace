'use client'

import { useTranslation } from '@/app/i18n/client'
import { PaymentsController } from '@/core/controllers/payment'
import useGlobalContext from '@/hooks/use-context'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Icon } from './common/icon'

export const PaypalPaymentSuccess = () => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const searchParams = useSearchParams()
  const orderID = searchParams.get('token')

  useEffect(() => {
    const capturePaypalPayment = async () => {
      if (!orderID) {
        setIsLoading(false)
        setIsError(true)
        return
      }

      try {
        const success = await PaymentsController.capturePaypalPayment(orderID!)
        if (!success) {
          setIsError(true)
        }
      } catch (error) {
        console.info('Error capturing paypal payment:', error)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    capturePaypalPayment()
  }, [])

  return (
    <div className="container d-flex justify-content-center" style={{ padding: '100px 0' }}>
      <div className="row d-flex justify-content-center" style={{ maxWidth: 450 }}>
        <div className="col-12 d-flex flex-column align-items-center justify-content-center gap-4">
          {isLoading ? (
            <div className="d-flex align-items-center gap-4 flex-column">
              <h1 className="text-center">{t('payment.please_wait')}</h1>
              <Icon type="generic/loading" />
            </div>
          ) : isError ? (
            <>
              <h1>{t('generic.error')}</h1>
              <p className="text-center">{t('generic.could_not_capture_payment')}</p>
            </>
          ) : (
            <>
              <h1>{t('payment.success')}</h1>
              <p className="text-center">{t('payment.success_description')}</p>
              <Link className="fill-btn" href="/profile">
                {t('payment.open_profile')}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
