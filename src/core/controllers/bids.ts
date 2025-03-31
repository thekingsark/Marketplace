import { GooglePlaceDetails } from '../domain/location'
import { BidRepository } from '../repositories/bid'
import { AppStore } from '../store'
import { runInAction } from 'mobx'
import { AccountController } from './account'

export interface CreateBidParams {
  latLng: { lat: number; lng: number }
  locationDetails?: GooglePlaceDetails
  location?: string
  initialCurrencyId?: string
  usedExchangeRateId?: string
  description?: string
  price?: number
}

class BidsController {
  async create(params: CreateBidParams, auctionId: string) {
    try {
      const bid = await BidRepository.create(auctionId, {
        location: params.location as string,
        price: params.price as number,
        latLng: params.latLng,
        description: params.description ?? '',
        initialCurrencyId: params.initialCurrencyId ?? '',
        usedExchangeRateId: params.usedExchangeRateId ?? '',
      })

      if (!bid) {
        return null
      }

      runInAction(() => {
        AppStore.accountStats.allBidsCount += 1
        AppStore.accountStats.acceptedBids += 1
      })

      try {
        await AccountController.saveLocationToAccount(
          params.latLng.lat,
          params.latLng.lng,
          params.location ?? ''
        )
      } catch (error) {
        console.error(`Could not save location to account: ${error}`)
      }

      return bid
    } catch (error) {
      if ((error as Error).message.includes('Not enough coins')) {
        throw error
      }

      throw new Error(`Could not create bid: ${error}`)
    }
  }

  async markBidsFromAuctionAsSeen(auctionId: string) {
    return await BidRepository.markBidsFromAuctionAsSeen(auctionId)
  }

  async update(params: {
    bidId: string
    rejectionReason?: string
    isRejected?: boolean
    isAccepted?: boolean
  }) {
    const { isAccepted, isRejected, rejectionReason, bidId } = params
    if (isRejected == null && isAccepted == null) {
      throw new Error('You must provide either isRejected or isAccepted')
    }

    try {
      await BidRepository.update(bidId, rejectionReason, isRejected, isAccepted)
      if (isAccepted) {
        runInAction(() => {
          AppStore.accountStats.activeAuctions -= 1
        })
      }

      return true
    } catch (error) {
      console.error(`Could not update bid: ${error}`)
      return false
    }
  }

  async delete(bidId: string) {
    try {
      await BidRepository.delete(bidId)

      runInAction(() => {
        AppStore.accountStats.allBidsCount -= 1
        if (AppStore.accountStats.allBidsCount < 0) {
          AppStore.accountStats.allBidsCount = 0
        }
      })
    } catch (error) {
      throw new Error(`Could not delete bid: ${error}`)
    }
  }
}

const bidsController = new BidsController()
export { bidsController as BidsController }
