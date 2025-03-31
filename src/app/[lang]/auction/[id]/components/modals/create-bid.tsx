import { FormErrorMessage } from '@/components/auction-form/form-error-message'
import { LocationsSearchInput } from '@/components/auction-form/location/search-input'
import { useTranslation } from '@/app/i18n/client'
import { CustomModal } from '@/components/common/custom-modal'
import { Icon } from '@/components/common/icon'
import { LocationsController } from '@/core/controllers/locations'
import { Auction } from '@/core/domain/auction'
import { Bid } from '@/core/domain/bid'
import { GooglePlaceDetails, GooglePlacesPrediction } from '@/core/domain/location'
import useGlobalContext from '@/hooks/use-context'
import {
  calculateDistanceBetweenPoints,
  formatPrice,
  getPrettyLocationFromGooglePlaces,
} from '@/utils'
import React, { FormEvent, useEffect } from 'react'
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { observer } from 'mobx-react-lite'
import { CreateBidParams } from '@/core/repositories/bid'
import { AuctionMinSellPrice } from '../common/min-sell-price'
import { AppStore } from '@/core/store'
import { dir } from 'i18next'
import { useCurrentCurrency } from '@/hooks/current-currency'

interface CreateSellBidModalProps {
  auction: Auction
  isOpened: boolean
  close: () => void
  handleCreate: (bidData: CreateBidParams) => Promise<boolean>
  convertPrice: (price: number, fromCurrencyId?: string) => number
}

export const CreateBidModal = observer((props: CreateSellBidModalProps) => {
  const globalContext = useGlobalContext()
  const { currentLanguage, appCurrencies, appExchangeRate, appSettings } = globalContext
  const { t } = useTranslation(currentLanguage)
  const direction = dir(currentLanguage)

  const { auction, isOpened, close, convertPrice } = props
  const { freeBidsCount, bidsCoinsCost } = globalContext.appSettings
  const currentCurrency = useCurrentCurrency()

  const computeMinPrice = () => {
    let minPrice = 1
    if (auction.bids.length) {
      const bidWithHighestPrice = auction.bids.reduce((a, b) =>
        (convertPrice(a.price ?? 0, a.initialCurrencyId ?? appSettings.defaultCurrencyId) ?? 0) >
          (convertPrice(b.price ?? 0, b.initialCurrencyId ?? appSettings.defaultCurrencyId) ?? 0)
          ? a
          : b
      ) as Bid | undefined
      minPrice = convertPrice(
        (bidWithHighestPrice?.price ?? auction.startingPrice ?? 0) + 1,
        bidWithHighestPrice?.initialCurrencyId ?? appSettings.defaultCurrencyId
      )
    } else {
      minPrice = convertPrice(
        auction.startingPrice ?? 1,
        auction.initialCurrencyId ?? appSettings.defaultCurrencyId
      )
    }
    return minPrice
  }

  const [minPrice, setMinPrice] = useState(computeMinPrice())
  const [createInProgress, setCreateInProgress] = useState(false)
  const [price, setPrice] = useState(minPrice.toString())
  const [distanceTooLong, setDistanceTooLong] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<GooglePlaceDetails | null>(null)

  const [priceIsSmallerThanMin, setPriceIsSmallerThanMin] = useState(false)
  const [priceIsBiggerThanMax, setPriceIsBiggerThanMax] = useState(false)
  const [invalidNumber, setInvalidNumber] = useState(false)
  const [description, setDescription] = useState('')

  const [deviceLocationLoading, setDeviceLocationLoading] = useState(false)

  const locationSearchInputRef = useRef<HTMLDivElement>(null)
  const focusRef = useRef<HTMLFormElement>(null)

  const [formIsValid, setFormIsValid] = useState(true)
  const [formSubmitTries, setFormSubmitTries] = useState(0)
  const initializedRef = useRef(false)

  const maxAllowedPrice = convertPrice(
    globalContext.appSettings?.maxProductPrice ?? 1000000,
    appCurrencies.find((currency) => currency.code === 'USD')?.id
  )

  useEffect(() => {
    if (!props.isOpened) {
      return
    }

    const newMinPrice = computeMinPrice()
    setMinPrice(newMinPrice)
    setPrice(newMinPrice.toString())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isOpened])

  useEffect(() => {
    if (!selectedLocation) {
      setFormIsValid(false)
    }
  }, [selectedLocation])

  useEffect(() => {
    if (props.isOpened) {
      setTimeout(() => {
        focusRef.current?.focus()
      })
    }
  }, [props.isOpened])

  useEffect(() => {
    if (initializedRef.current) {
      return
    }

    getInitialLocation()
    initializedRef.current = true
  })

  const getInitialLocation = async () => {
    if (AppStore.accountData?.locationLatLng) {
      const { lat, lng } = AppStore.accountData?.locationLatLng ?? {}
      const location = await LocationsController.getPlaceDetailsFromLatLng(lat, lng)

      setSelectedLocation(location)
      return
    }
    getDeviceLocation()
  }

  const getDeviceLocation = async () => {
    if (deviceLocationLoading) {
      return
    }

    setDeviceLocationLoading(true)
    try {
      const location = await LocationsController.getLocationFromCurrentDevice()
      if (location) {
        setSelectedLocation(location)
      }
    } catch (error) {
      console.error(`Failed to get device location: ${error}`)
    } finally {
      setDeviceLocationLoading(false)
    }
  }

  const handleLocationPick = async (location: GooglePlacesPrediction | null) => {
    setDistanceTooLong(false)
    if (!location) {
      setSelectedLocation(null)
      return
    }
    const locationDetails = await LocationsController.getGooglePlaceDetails(location.reference)
    setSelectedLocation(locationDetails)
  }

  const formatNumber = (number: number) => {
    return formatPrice(number, currentLanguage, currentCurrency?.code ?? 'USD')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (
      freeBidsCount <= AppStore.accountStats.allBidsCount &&
      (AppStore.accountData?.coins ?? 0) < bidsCoinsCost
    ) {
      toast.error(t('coins_for_auction_or_bid.not_enough_for_bid'))
      return
    }

    setFormSubmitTries((prev) => prev + 1)

    if (createInProgress) {
      return
    }

    if (parseFloat(price) < minPrice) {
      setPriceIsSmallerThanMin(true)
      return
    }

    if (parseFloat(price) > maxAllowedPrice) {
      setPriceIsBiggerThanMax(true)
      return
    }

    if (isNaN(parseFloat(price))) {
      setInvalidNumber(true)
      return
    }

    const isValid = /^-?[\d]*(\.[\d]+)?$/g.test(price)
    if (!isValid) {
      setInvalidNumber(true)
      return
    }

    if (!selectedLocation) {
      locationSearchInputRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
      return
    }

    const auctionLocation = auction.location
    const currentLocation = selectedLocation?.geometry?.location
    const distance = calculateDistanceBetweenPoints(
      auctionLocation.lat,
      auctionLocation.lng,
      currentLocation.lat,
      currentLocation.lng
    )
    if (distance > globalContext.appSettings!.maxAllowedDistanceBetweenUsersInKM) {
      setDistanceTooLong(true)
      locationSearchInputRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
      return
    }

    setCreateInProgress(true)
    try {
      const { lat, lng } = selectedLocation?.geometry?.location || {}

      const bidCreated = await props.handleCreate({
        location: getPrettyLocationFromGooglePlaces(selectedLocation) as string,
        description,
        latLng: { lat, lng },
        price: parseFloat(price),
        usedExchangeRateId: appExchangeRate?.id,
        initialCurrencyId: currentCurrency?.id,
      })
      if (!bidCreated) {
        toast.error(t('auction_details.create_bid.error_creating'))
        return
      }

      toast.success(t('auction_details.create_bid.bid_created'))
      close()
    } catch (error) {
      console.error(`Could not create bid: ${error}`)
      toast.error(t('auction_details.create_bid.error_creating'))
    } finally {
      setCreateInProgress(false)
    }
  }

  return (
    <CustomModal
      open={isOpened}
      onClose={close}
      styles={{
        modal: {
          maxWidth: '700px',
          backgroundColor: 'var(--background_2)',
        },
        overlay: {
          background: 'rgba(0, 0, 0, 0.5)',
        },
      }}
      classNames={{
        modal: 'info-modal create-bid-modal',
      }}
      closeIcon={<Icon type="generic/close-filled" />}
      center
    >
      <h4>{t('auction_details.create_bid.title')} </h4>

      <div className="flex-1 h-100">
        <div className="mt-20">
          <AuctionMinSellPrice auction={auction} convertPrice={convertPrice} />
          <p className="mt-10 secondary-color d-none d-lg-block">
            {t('auction_details.create_bid.cannot_place_bid_lower')}
          </p>
        </div>

        <div className="single-input-unit mt-40">
          <label htmlFor="create-bid-price" className="mb-0 create-auction-label">
            {t('auction_details.create_bid.select_price')}
          </label>
          <div className="d-flex align-items-center justify-content-center mt-20">
            <div className="position-relative w-100">
              <input
                name="create-bid-price"
                value={price}
                min={minPrice}
                max={maxAllowedPrice}
                maxLength={4}
                onChange={(e) => {
                  if (priceIsSmallerThanMin) {
                    setPriceIsSmallerThanMin(false)
                  }
                  if (priceIsBiggerThanMax) {
                    setPriceIsBiggerThanMax(false)
                  }
                  if (invalidNumber) {
                    setInvalidNumber(false)
                  }
                  setPrice(e.target.value)
                }}
                style={{
                  margin: 0,
                  height: 60,
                  width: '100%',
                  background: 'var(--background_4)',
                }}
                type="number"
                pattern="\d*"
              />

              <div className="currency-suffix">
                <span>{currentCurrency?.symbol ?? 'USD'}</span>
              </div>
            </div>
          </div>

          {priceIsSmallerThanMin && (
            <div className="mt-10">
              <FormErrorMessage
                key={formSubmitTries}
                message={t('info.min_price_for_bid_is', {
                  no: formatNumber(minPrice),
                })}
                isError
              />
            </div>
          )}

          {priceIsBiggerThanMax && (
            <div className="mt-10">
              <FormErrorMessage
                key={formSubmitTries}
                message={t('info.max_price_for_bid_is', {
                  no: formatNumber(globalContext.appSettings?.maxProductPrice ?? 1000000),
                })}
                isError
              />
            </div>
          )}

          {invalidNumber && (
            <div className="mt-10">
              <FormErrorMessage
                key={formSubmitTries}
                message={t('info.price_must_be_number', {
                  min: formatNumber(minPrice),
                  max: formatNumber(globalContext.appSettings?.maxProductPrice ?? 1000000),
                })}
                isError
              />
            </div>
          )}
        </div>

        <form className="mt-20" onSubmit={handleSubmit} tabIndex={-1} ref={focusRef}>
          <div className="mt-40">
            <div className="d-flex flex-row justify-content-between align-items-center mb-10">
              <label className="mb-0 create-auction-label">{t('location.your_location')}</label>
            </div>

            <div ref={locationSearchInputRef}>
              <LocationsSearchInput
                selectedLocation={selectedLocation}
                onLocationPicked={handleLocationPick}
                searchInProgress={deviceLocationLoading}
                secondaryColor
              />
            </div>

            <div className="pos-rel mb-40 wow fadeInUp mt-10">
              {!formIsValid && !selectedLocation && !!formSubmitTries && (
                <div className="mt-10">
                  <FormErrorMessage
                    key={formSubmitTries}
                    message={t('create_auction.location_required')}
                    isError
                  />
                </div>
              )}

              {distanceTooLong && (
                <div className="mt-10">
                  <FormErrorMessage
                    key={formSubmitTries}
                    message={t('auction_details.long_distance.title')}
                    isError
                  />
                </div>
              )}
            </div>
          </div>

          <div className="single-input-unit mt-40">
            <label htmlFor="description" className="create-auction-label">
              {t('auction_details.create_bid.leave_a_message')}{' '}
              <span className="fw-light"> {t('generic.optional')}</span>
            </label>
            <textarea
              name="description"
              id="description"
              maxLength={1000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="custom-textarea"
              placeholder={t('auction_details.create_bid.message_description')}
            />
            <div className="d-flex justify-content-end">
              <span>{description.length}/1000</span>
            </div>
          </div>

          <div className="d-flex justify-content-between gap-3 mt-10">
            <button
              className={`btn d-flex align-items-center justify-content-center w-100 p-0 ${selectedLocation && !distanceTooLong ? 'fill-btn' : 'disabled-btn'
                }`}
              disabled={createInProgress}
              type="submit"
            >
              {createInProgress ? (
                <div className="loader-wrapper d-flex align-items-center justify-content-center">
                  <Icon type="loading" color={'#fff'} size={40} />
                </div>
              ) : (
                <>
                  <span>{t('auction_details.create_bid.title')}</span>
                  {freeBidsCount <= AppStore.accountStats.allBidsCount && (
                    <span className="ml-10 d-flex align-items-center">
                      (<Icon type="generic/coin" />
                      <span className="ml-5">
                        {t('buy_coins.coins_no', { no: bidsCoinsCost })})
                      </span>
                    </span>
                  )}
                </>
              )}
            </button>
          </div>
          {freeBidsCount <= AppStore.accountStats.allBidsCount && (
            <p className="mt-10">{t('coins_for_auction_or_bid.bid_get_back')}</p>
          )}
        </form>
      </div>
      <style jsx>{`
        .currency-suffix {
          position: absolute;
          top: 16px;
          ${direction === 'rtl' ? 'left: 42px;' : ' right: 42px;'}
        }
      `}</style>
    </CustomModal>
  )
})
