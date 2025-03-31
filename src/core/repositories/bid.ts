import { LatLng } from '../domain/auction'
import { Bid } from '../domain/bid'
import { RequestMaker, RequestType } from '../services/request-maker'

class BidRepository {
  async delete(bidId: string): Promise<boolean> {
    try {
      await RequestMaker.makeRequest({
        method: RequestType.DELETE,
        path: `/bid/${bidId}`,
      })
      return true
    } catch (error) {
      console.error('Error removing bid:', error)
      return false
    }
  }

  async markBidsFromAuctionAsSeen(auctionId: string): Promise<boolean> {
    try {
      await RequestMaker.makeRequest({
        method: RequestType.PUT,
        path: `/bid/markBidsAsSeen/${auctionId}`,
      })
      return true
    } catch (error) {
      console.error('Error marking bids as seen:', error)
      return false
    }
  }

  async update(
    bidId: string,
    rejectionReason?: string,
    isRejected?: boolean,
    isAccepted?: boolean
  ): Promise<boolean> {
    if (isRejected === undefined && isAccepted === undefined) {
      throw new Error('You must provide either isRejected or isAccepted')
    }

    try {
      await RequestMaker.makeRequest({
        method: RequestType.PUT,
        path: `/bid/${bidId}`,
        payload: JSON.stringify({
          isAccepted,
          isRejected,
          rejectionReason,
        }),
        contentType: 'application/json',
      })
      return true
    } catch (error) {
      console.error('Could not update bid:', error)
      return false
    }
  }

  async create(auctionId: string, params: CreateBidParams): Promise<Bid | null> {
    const description = params.description?.replace(/\n{3,}/g, '\n') || ''

    try {
      const result = (await RequestMaker.makeRequest({
        method: RequestType.POST,
        path: `/bid/${auctionId}`,
        payload: JSON.stringify({
          latLng: JSON.stringify(params.latLng),
          location: params.location,
          description,
          price: params.price,
          initialCurrencyId: params.initialCurrencyId,
          usedExchangeRateId: params.usedExchangeRateId,
        }),
        contentType: 'application/json',
      })) as Record<string, unknown>
      return Bid.fromJSON(result)
    } catch (error) {
      if ((error as Error).message.includes('Not enough coins')) {
        throw error
      }
      console.error('Error creating bid:', error)
      return null
    }
  }
}

export class CreateBidParams {
  description?: string
  price: number
  latLng: LatLng
  location: string
  usedExchangeRateId?: string
  initialCurrencyId?: string

  constructor(
    description: string,
    price: number,
    latLng: LatLng,
    location: string,
    usedExchangeRateId?: string,
    initialCurrencyId?: string
  ) {
    this.description = description || ''
    this.price = price
    this.latLng = latLng
    this.location = location
    this.usedExchangeRateId = usedExchangeRateId
    this.initialCurrencyId = initialCurrencyId
  }
}

const BidRepositoryInstance = new BidRepository()
export { BidRepositoryInstance as BidRepository }
