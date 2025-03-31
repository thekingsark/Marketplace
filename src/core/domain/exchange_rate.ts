export class ExchangeRate {
  id: string
  baseCurrencyId: string
  rates: Record<string, number>

  constructor(params: { id: string; baseCurrencyId: string; rates: Record<string, number> }) {
    this.id = params.id
    this.baseCurrencyId = params.baseCurrencyId
    this.rates = params.rates
  }

  static fromJSON(data: Record<string, unknown> = {}): ExchangeRate {
    return new ExchangeRate({
      id: data.id as string,
      baseCurrencyId: data.baseCurrencyId as string,
      rates: data.rates as Record<string, number>,
    })
  }
}
