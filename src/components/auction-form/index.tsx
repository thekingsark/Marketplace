'use client'
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'
import { toast } from 'react-toastify'
import { AuctionFormPriceSection } from './price'
import { useRouter } from 'next/navigation'
import { GooglePlaceDetails } from '@/core/domain/location'
import { Icon } from '@/components/common/icon'
import { AuctionFormLocationSection } from './location'
import { CreateAuctionAssetsSection } from './assets'
import { AuctionFormCategorySection } from './category'
import { AuctionFormConditionSection } from './condition'
import { Auction, AuctionProductCondition, LatLng } from '@/core/domain/auction'
import { AuctionFormTitleSection } from './title-section'
import { AuctionsController } from '@/core/controllers/auctions'
import { getPrettyLocationFromGooglePlaces } from '@/utils'
import { observer } from 'mobx-react-lite'
import { Asset } from '@/core/domain/asset'
import { LocationsController } from '@/core/controllers/locations'
import { AppStore } from '@/core/store'
import { CreateAuctionConfirmationModal } from './modals/create-auction-confirmation'
import { AuctionCustomStartEndDateSection } from './start-end-date'
import { AuctionFormYoutubeSection } from './youtube-section'
import { useCurrentCurrency } from '@/hooks/current-currency'

export const AuctionForm = observer((props: { auction?: Record<string, unknown> }) => {
  const initialAuction = props.auction ? Auction.fromJSON(props.auction) : null
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)
  const { freeAuctionsCount, auctionsCoinsCost } = globalContext.appSettings

  const allCategories = globalContext.appCategories
  const router = useRouter()

  const [title, setTitle] = useState(initialAuction?.title ?? '')
  const [youtubeLink, setYoutubeLink] = useState(initialAuction?.youtubeLink ?? '')
  const [selectedPrice, setSelectedPrice] = useState<number | null>(
    initialAuction?.startingPrice ?? null
  )
  const [isCustomPrice, setIsCustomPrice] = useState(
    initialAuction?.hasCustomStartingPrice ?? false
  )
  const [mainCategoryId, setMainCategoryId] = useState<string | null>(
    initialAuction?.mainCategoryId ?? null
  )
  const [subCategoryId, setSubCategoryId] = useState<string | null>(
    initialAuction?.subCategoryId ?? null
  )
  const [condition, setCondition] = useState<AuctionProductCondition | null>(
    initialAuction?.condition ?? null
  )

  const [uploadedAssets, setUploadedAssets] = useState<(File | Asset)[]>(
    initialAuction?.assets ?? []
  )
  const [description, setDescription] = useState<string>(initialAuction?.description ?? '')
  const [selectedLocation, setSelectedLocation] = useState<GooglePlaceDetails | null>(null)

  const [submitInProgress, setSubmitInProgress] = useState(false)

  const [formIsValid, setFormIsValid] = useState(true)
  const [formSubmitTries, setFormSubmitTries] = useState(0)

  const [createConfirmationModalOpen, setCreateConfirmationModalOpen] = useState(false)
  const currentCurrency = useCurrentCurrency()

  const [dateMetadata, setDateMetadata] = useState<{
    useCustomDate: boolean
    startDate: Date | null
    endDate: Date | null
  }>({
    startDate: initialAuction?.startAt ?? null,
    endDate: initialAuction?.expiresAt ?? null,
    useCustomDate: !!initialAuction?.startAt,
  })

  const titleRef = useRef<HTMLDivElement>(null)
  const locationSearchInputRef = useRef<HTMLDivElement>(null)
  const categoryButtonRef = useRef<HTMLDivElement>(null)
  const conditionRef = useRef<HTMLDivElement>(null)
  const priceRef = useRef<HTMLDivElement>(null)

  const locationLoading = useRef(false)

  useEffect(() => {
    if (!selectedLocation) {
      setFormIsValid(false)
      return
    }

    setFormIsValid(true)
  }, [selectedLocation])

  useEffect(() => {
    if (!initialAuction || !!selectedLocation || locationLoading.current) {
      return
    }

    const computeLocation = async () => {
      locationLoading.current = true

      const computedLocation = await getExistingAuctionLocation(initialAuction.location)
      if (computedLocation) {
        setSelectedLocation(computedLocation)
      }
      locationLoading.current = false
    }

    computeLocation()
  }, [initialAuction, selectedLocation])

  const handleSelectCategory = (mainCategoryId: string | null, subCategoryId: string | null) => {
    setMainCategoryId(mainCategoryId)
    setSubCategoryId(subCategoryId)
  }

  const getExistingAuctionLocation = async (location: LatLng) => {
    const placeDetails = await LocationsController.getPlaceDetailsFromLatLng(
      location.lat,
      location.lng
    )

    if (!placeDetails) {
      return null
    }

    return placeDetails
  }

  const handleAssetsPicked = (files: (Asset | File)[]) => {
    setUploadedAssets([...files])
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    if (submitInProgress) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    setFormSubmitTries(formSubmitTries + 1)
    if (submitInProgress) {
      return
    }

    if (!title?.trim().length) {
      titleRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
      return
    }

    if (!mainCategoryId || !subCategoryId) {
      categoryButtonRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
      return
    }

    if (!selectedLocation) {
      locationSearchInputRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
      return
    }

    if (condition === null) {
      conditionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
      return
    }

    if (freeAuctionsCount <= AppStore.accountStats.allAuctionsCount && !props.auction?.id) {
      setCreateConfirmationModalOpen(true)
      return
    }

    handleCreateOrUpdate()
  }

  const handleCreateOrUpdate = async () => {
    setSubmitInProgress(true)

    const { lat, lng } = selectedLocation!.geometry?.location

    const assetsToKeep = uploadedAssets
      .filter((el) => !!(el as Asset)?.id)
      .map((el) => (el as Asset).id)

    const uniqueAssetsToKeep = Array.from(new Set(assetsToKeep))
    const assetsToActuallyUpload = uploadedAssets.filter((el) => !(el as Asset)?.id) as File[]

    const createOrUpdateParams = {
      assets: assetsToActuallyUpload as File[],
      latLng: { lat, lng },
      startingPrice: selectedPrice ?? undefined,
      hasCustomStartingPrice: isCustomPrice,
      youtubeLink,
      initialCurrencyId: currentCurrency?.id,
      location: getPrettyLocationFromGooglePlaces(selectedLocation!),
      description,
      title,
      mainCategoryId: mainCategoryId!,
      subCategoryId: subCategoryId!,
      condition: condition!,
      startAt: dateMetadata.useCustomDate ? dateMetadata.startDate ?? undefined : undefined,
      expiresAt: dateMetadata.useCustomDate ? dateMetadata.endDate ?? undefined : undefined,
    }

    const createdOrUpdatedAuction = initialAuction
      ? await AuctionsController.update(initialAuction.id, {
        ...createOrUpdateParams,
        assetsToKeep: uniqueAssetsToKeep,
      })
      : await AuctionsController.create(createOrUpdateParams)

    if (!createdOrUpdatedAuction) {
      toast.error(t('create_auction.repository.could_not_create'))
      setSubmitInProgress(false)
      return
    }

    if (initialAuction?.id) {
      toast.success(t('auction_details.update.update_successful'))
    }

    setSubmitInProgress(false)
    if (initialAuction) {
      router.push(`/auction/${initialAuction.id}`)
      router.refresh()
      return
    }

    if (typeof createdOrUpdatedAuction === 'boolean') {
      return
    }

    router.push(`/auction/${createdOrUpdatedAuction.id}`)
  }

  return (
    <>
      <CreateAuctionAssetsSection
        uploadedAssets={uploadedAssets}
        setUploadedAssets={handleAssetsPicked}
      />

      <form className="mt-20" onSubmit={handleSubmit}>
        <AuctionFormTitleSection
          rootRef={titleRef}
          initialTitle={title}
          formIsValid={formIsValid}
          formSubmitTries={formSubmitTries}
          onChange={(value) => setTitle(value)}
        />

        <AuctionFormYoutubeSection
          initialLink={youtubeLink}
          onChange={(value) => setYoutubeLink(value)}
        />

        <AuctionFormCategorySection
          categories={allCategories}
          initialData={{ mainCategoryId, subCategoryId }}
          buttonRef={categoryButtonRef}
          formIsValid={formIsValid}
          formSubmitTries={formSubmitTries}
          setCurrentCategory={handleSelectCategory}
        />

        <AuctionFormLocationSection
          initialLocation={selectedLocation}
          formIsValid={formIsValid}
          formSubmitTries={formSubmitTries}
          inputRef={locationSearchInputRef}
          useLocationDetection={!initialAuction}
          setLocation={setSelectedLocation}
        />

        <AuctionFormConditionSection
          rootRef={conditionRef}
          formIsValid={formIsValid}
          initialCondition={condition ?? undefined}
          formSubmitTries={formSubmitTries}
          onSelect={setCondition}
        />

        <AuctionFormPriceSection
          rootRef={priceRef}
          formIsValid={formIsValid}
          isCustomPriceSelected={isCustomPrice}
          formSubmitTries={formSubmitTries}
          selectedPrice={selectedPrice}
          initialCurrencyId={!initialAuction ? undefined : initialAuction.initialCurrencyId}
          setPrice={(value, isCustomPrice = false) => {
            setSelectedPrice(value)
            setIsCustomPrice(isCustomPrice)
          }}
        />

        {(!initialAuction || initialAuction?.startAt) ? (
          <AuctionCustomStartEndDateSection
            initialStartDate={dateMetadata.startDate ?? undefined}
            initialEndDate={dateMetadata.endDate ?? undefined}
            forUpdateAuction={!!initialAuction}
            onSelect={(useCustomData, startDate, endDate) => {
              setDateMetadata({
                startDate: startDate ?? null,
                endDate: endDate ?? null,
                useCustomDate: useCustomData,
              })
            }}
          />) : null}

        <div className="mt-40">
          <label htmlFor="description" className="create-auction-label mb-10">
            {t('create_auction.description')}{' '}
            <span className="fw-light"> {t('generic.optional')}</span>
          </label>
          <textarea
            name="description"
            className="custom-textarea"
            id="description"
            value={description}
            maxLength={1000}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('create_auction.enter_description')}
          />
          <div className="d-flex justify-content-end mt-1">
            <span className="fw-light">{description.length}/1000</span>
          </div>
        </div>

        <button className={`fill-btn w-100 mb-40 mt-20`} type="submit" disabled={submitInProgress}>
          {submitInProgress ? (
            <div className="loader-wrapper d-flex justify-content-center">
              <Icon type="loading" color={'white'} size={40} />
            </div>
          ) : initialAuction?.id ? (
            t('auction_details.update.title')
          ) : (
            <>
              <span>{t('create_auction.create_auction')}</span>

              {freeAuctionsCount <= AppStore.accountStats.allAuctionsCount &&
                !props.auction?.id && (
                  <span className="ml-10 d-flex align-items-center">
                    (<Icon type="generic/coin" />
                    <span className="ml-5">
                      {t('buy_coins.coins_no', { no: auctionsCoinsCost })})
                    </span>
                  </span>
                )}
            </>
          )}
        </button>
      </form>

      <CreateAuctionConfirmationModal
        isOpened={createConfirmationModalOpen}
        close={() => setCreateConfirmationModalOpen(false)}
        handleSubmit={handleCreateOrUpdate}
      />
    </>
  )
})
