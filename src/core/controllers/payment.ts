import { PaymentRepository } from '../repositories/payment'

class PaymentsController {
  async createStripePaymentSession(productId: string, currencyId?: string) {
    if (!currencyId) {
      return null
    }

    return await PaymentRepository.createStripePaymentSession(productId, currencyId)
  }

  async createPaypalPaymentSession(productId: string, currencyId?: string) {
    if (!currencyId) {
      return null
    }

    return await PaymentRepository.createPaypalPaymentSession(productId, currencyId)
  }

  async capturePaypalPayment(orderId: string) {
    return await PaymentRepository.capturePaypalPayment(orderId)
  }
}

const paymentsController = new PaymentsController()
export { paymentsController as PaymentsController }
