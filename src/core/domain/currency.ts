export class Currency {
  id: string
  code: string
  symbol: string
  name: Record<string, string>

  constructor(params: { id: string; code: string; symbol: string; name: Record<string, string> }) {
    this.id = params.id
    this.code = params.code
    this.symbol = params.symbol
    this.name = params.name
  }

  static fromJSON(data: Record<string, unknown> = {}): Currency {
    return new Currency({
      id: data.id as string,
      code: data.code as string,
      symbol: data.symbol as string,
      name: data.name as Record<string, string>,
    })
  }
}
