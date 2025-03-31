export class PaymentProduct {
  id: string
  coinsNo: string
  priceInUSD: number

  constructor(params: Record<string, unknown> = {}) {
    this.id = params.id as string
    this.coinsNo = params.coinsNo as string
    this.priceInUSD = params.priceInUSD as number
  }

  static fromJSON(json: Record<string, unknown>): PaymentProduct {
    return new PaymentProduct({
      id: json.id,
      coinsNo: json.coinsNo,
      priceInUSD: json.priceInUSD,
    })
  }
}
