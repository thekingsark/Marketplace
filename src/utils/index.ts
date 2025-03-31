import { Account } from '@/core/domain/account'
import { GooglePlaceDetails } from '@/core/domain/location'
import { Review } from '@/core/domain/review'
import { Auction } from '@/core/domain/auction'

export const getAuctionClosingDate = (auction: Auction) => {
  if (auction.acceptedBidAt) {
    return new Date(auction.acceptedBidAt)
  }

  if (auction.expiresAt) {
    return auction.expiresAt
  }

  let dateToCheck = auction.createdAt
  if (typeof dateToCheck === 'string') {
    dateToCheck = new Date(dateToCheck)
  }

  try {
    dateToCheck.getTime()
  } catch (e) {
    console.error('Invalid date format', e)
    return null
  }

  const AUCTION_ACTIVE_TIME_IN_HOURS = 96
  const deadline = new Date(
    (dateToCheck?.getTime() ?? -AUCTION_ACTIVE_TIME_IN_HOURS) +
      AUCTION_ACTIVE_TIME_IN_HOURS * 60 * 60 * 1000
  )

  return deadline
}

export const checkIfAuctionIsClosed = (auction: Auction, activeTimeInHours = 96) => {
  let dateToCheck = auction.createdAt
  if (typeof dateToCheck === 'string') {
    dateToCheck = new Date(dateToCheck)
  }

  try {
    dateToCheck.getTime()
  } catch (e) {
    console.error('Invalid date format', e)
    return false
  }

  const AUCTION_ACTIVE_TIME_IN_HOURS = activeTimeInHours
  const deadline = new Date(
    (dateToCheck?.getTime() ?? -AUCTION_ACTIVE_TIME_IN_HOURS) +
      AUCTION_ACTIVE_TIME_IN_HOURS * 60 * 60 * 1000
  )
  const now = new Date()
  const durationDiff = Number(deadline) - Number(now)

  const bidAccepted = auction.acceptedBidId != null
  return !auction.isActive || durationDiff < 0 || bidAccepted
}

export const formatPrice = (amount: number, language: string, currency: string) => {
  return new Intl.NumberFormat(language, {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export const getPrettyLocationFromGooglePlaces = (googlePlace: GooglePlaceDetails) => {
  if (googlePlace.name) {
    return googlePlace.name
  }

  const name = googlePlace.address_components.find((component) => {
    return component.types.includes('locality') && component.types.includes('political')
  })?.long_name

  return name
}

export const calculateDistanceBetweenPoints = (
  startLatitude: number,
  startLongitude: number,
  endLatitude: number,
  endLongitude: number
) => {
  const earthRadius = 6371 // Radius of the earth in kilometers

  const toRadians = (value: number) => {
    return (value * Math.PI) / 180
  }

  const deltaLatitude = toRadians(endLatitude - startLatitude)
  const deltaLongitude = toRadians(endLongitude - startLongitude)

  const a =
    Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) +
    Math.cos(toRadians(startLatitude)) *
      Math.cos(toRadians(endLatitude)) *
      Math.sin(deltaLongitude / 2) *
      Math.sin(deltaLongitude / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return earthRadius * c
}

export const computeReviewsAverage = (reviews: Review[]) => {
  if (reviews.length === 0) {
    return 0.0
  }

  const sum = reviews.reduce((acc, review) => acc + review.stars, 0)
  return sum / reviews.length
}

export const generateNameForAccount = (acc: Account) => {
  if (acc == null) {
    return 'Unknown'
  }

  if (acc.name !== null && acc.name !== '') {
    // take only the first 50 characters from the name
    if (acc.name?.length > 50) {
      return acc.name.substring(0, 50)
    }
    return acc.name!
  }

  if (acc.email !== '') {
    const containsAt = acc.email?.indexOf('@')
    if (containsAt !== -1) {
      return acc.email?.substring(0, containsAt)
    }
    return acc.email
  }

  return 'Unknown'
}

export const debounce = (
  func: (...args: unknown[]) => unknown,
  wait: number,
  immediate: boolean
) => {
  let timeout: number | undefined

  return (...args: unknown[]) => {
    const later = () => {
      timeout = undefined
      if (!immediate) {
        func(...args)
      }
    }

    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = window.setTimeout(later, wait)

    if (callNow) {
      func(...args)
    }
  }
}

export const getRandomString = (length = 10) => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' // Letters only
  const charactersLength = characters.length

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}

export const getDroppedFilesFromEvent = (ev: React.DragEvent<HTMLDivElement>) => {
  // Use DataTransferItemList interface to access the file(s)
  if (ev.dataTransfer.items) {
    const files: Array<File | null> = []

    for (let i = 0; i < ev.dataTransfer.items.length; i += 1) {
      // If dropped items aren't files, reject them
      if (ev.dataTransfer.items[i].kind === 'file') {
        files.push(ev.dataTransfer.items[i].getAsFile())
      }
    }
    return files
  }

  // Use DataTransfer interface to access the file(s)
  return ev.dataTransfer.files
}
