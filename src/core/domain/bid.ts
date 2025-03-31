import { makeAutoObservable } from 'mobx'
import { Account } from './account'
import { LatLng } from './auction'

export class Bid {
  id: string
  bidder?: Account
  location?: LatLng
  locationPretty?: string
  description?: string
  isRejected?: boolean
  rejectionReason?: string
  isAccepted?: boolean
  initialCurrencyId?: string
  price?: number

  createdAt?: Date
  updatedAt?: Date

  constructor(params: Record<string, unknown> = {}) {
    this.id = params.id as string
    this.bidder = params.bidder as Account
    this.location = params.location as LatLng
    this.locationPretty = params.locationPretty as string
    this.description = params.description as string
    this.isRejected = params.isRejected as boolean
    this.rejectionReason = params.rejectionReason as string
    this.isAccepted = params.isAccepted as boolean
    this.price = params.price as number
    this.initialCurrencyId = params.initialCurrencyId as string
    this.createdAt = params.createdAt as Date
    this.updatedAt = params.updatedAt as Date

    makeAutoObservable(this)
  }

  static fromJSON(data: Record<string, unknown>) {
    const locationLat = data.locationLat as number
    const locationLong = data.locationLong as number
    const locationLatLng =
      locationLat != null && locationLong != null
        ? new LatLng({ lat: locationLat, lng: locationLong })
        : null

    const bidder = data.bidder ? Account.fromJSON(data.bidder as Record<string, unknown>) : null

    return new Bid({
      id: data.id,
      bidder,
      location: locationLatLng,
      locationPretty: data.locationPretty ?? '',
      description: data.description,
      isRejected: data.isRejected,
      rejectionReason: data.rejectionReason,
      isAccepted: data.isAccepted,
      price: data.price ? parseFloat(data.price.toString()) : 0,
      initialCurrencyId: data.initialCurrencyId,
      createdAt: data.createdAt ? new Date(data.createdAt.toString()) : null,
      updatedAt: data.updatedAt ? new Date(data.updatedAt.toString()) : null,
    })
  }
}
