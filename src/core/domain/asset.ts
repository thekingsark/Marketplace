export class Asset {
  id: string
  path: string
  size: number

  createdAt: Date
  updatedAt: Date

  constructor(params: Record<string, unknown> = {}) {
    this.id = params.id as string
    this.path = params.path as string
    this.size = params.size as number
    this.createdAt = params.createdAt as Date
    this.updatedAt = params.updatedAt as Date
  }

  static fromJSON(data: Record<string, unknown> = {}) {
    return new Asset({
      id: data.id,
      path: data.path,
      size: data.size,
      createdAt: data.createdAt ? new Date(data.createdAt.toString()) : null,
      updatedAt: data.updatedAt ? new Date(data.updatedAt.toString()) : null,
    })
  }
}
