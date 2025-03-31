import { RequestMaker, RequestType } from '../services/request-maker'

class PaymentRepository {
  private basePath = '/payment'

  public async createStripePaymentSession(productId: string, currencyId: string) {
    try {
      const response = (await RequestMaker.makeRequest({
        path: `${this.basePath}/stripe-session`,
        method: RequestType.POST,
        payload: JSON.stringify({ productId, currencyId }),
      })) as {
        id: string
        url: string
      }
      return response
    } catch (error) {
      console.error('Error creating payment intent:', error)
      return null
    }
  }

  public async capturePaypalPayment(orderId: string) {
    try {
      await RequestMaker.makeRequest({
        path: `${this.basePath}/paypal-capture`,
        method: RequestType.POST,
        payload: JSON.stringify({ orderId }),
      })
      return true
    } catch (error) {
      console.error('Error capturing paypal payment:', error)
      return false
    }
  }

  public async createPaypalPaymentSession(productId: string, currencyId: string) {
    try {
      const response = (await RequestMaker.makeRequest({
        path: `${this.basePath}/paypal-session`,
        method: RequestType.POST,
        payload: JSON.stringify({ productId, currencyId }),
      })) as string
      return response
    } catch (error) {
      console.error('Error creating paypal payment session:', error)
      return null
    }
  }
}

const paymentRepository = new PaymentRepository()
export { paymentRepository as PaymentRepository }
