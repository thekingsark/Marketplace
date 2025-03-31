'use client'
import useGlobalContext from '@/hooks/use-context'
import { AuctionDetailsAssets } from './components/sections/auction-assets'
import { AuctionDetailsContentSection } from './components/sections/content'
import { AuctionDetailsLocationSection } from './components/sections/location'
import { Auction } from '@/core/domain/auction'
import { AuctionDetailsAuctioneerSection } from './components/sections/auctioneer'
import { AuctionDetailsBidsSection } from './components/sections/bids'
import { useEffect, useRef, useState } from 'react'
import { AppStore } from '@/core/store'
import { useTranslation } from '@/app/i18n/client'
import { AssetsGalleryModal } from '../../../../components/auction-form/assets/assets-gallery'
import { FavouritesController } from '@/core/controllers/favourites'
import { AuctionDetailsStatusSection } from './components/sections/status'
import { observer } from 'mobx-react-lite'
import { ReportsController } from '@/core/controllers/reports'
import { BidsController, CreateBidParams } from '@/core/controllers/bids'
import { toast } from 'react-toastify'
import { ChatController } from '@/core/controllers/chat'
import { AuctionDetailsLeaveReview } from './components/sections/reviews/leave-review'
import { AuctionDetailsGivenReviews } from './components/sections/reviews/given-reviews'
import { AuctionsController } from '@/core/controllers/auctions'
import { AuctionsBySameAuctioneer } from './components/sections/auctions-by-same-account'
import { CreateBidModal } from './components/modals/create-bid'
import { ReportAuctionModal } from './components/modals/report'
import { RemoveAuctionModal } from './components/modals/remove-auction'
import { PromoteAuctionModal } from './components/modals/promote'
import { YouNeedToLoginModal } from '@/components/modals/you-need-to-login-modal'
import { AuctionDetailsMobileBottomActions } from './components/mobile/bottom-actions'
import { AuctionDetailsOwnerActions } from './components/sections/owner-actions'
import { AuctionDetailsCategorySection } from './components/sections/category'
import { AuctionDetailsMoreActions } from './components/mobile/owner-actions'
import { AuctionDetailsMobileSummary } from './components/mobile/summary'
import { AuctionDetailsBreadcrumbs } from './components/breadcrumbs'
import { SimilarAuctionsSection } from './components/sections/similar-auctions'
import { LanguageDetectorService } from '@/core/services/lang-detector'
import { AuctionBottomActionsWrapper } from './components/common/auction-bottom-actions'
import { AuctionHistoryModal } from './components/modals/history'
import { AuctionCommentsButton } from './components/comments/comments-button'
import { AuthService } from '@/core/services/auth'
import { EmailVerificationNeeded } from '../../../../components/modals/email-verification-needed'
import { useCurrentCurrency } from '@/hooks/current-currency'
import { Currency } from '@/core/domain/currency'

export const AuctionDetailsRoot = observer((props: { auction: Record<string, unknown> }) => {
  const globalContext = useGlobalContext()
  const { currentLanguage, appCurrencies, appExchangeRate } = globalContext
  const appSettings = globalContext.appSettings
  const { t } = useTranslation(currentLanguage)

  const [auction, setAuction] = useState<Auction>(Auction.fromJSON(props.auction))

  const [promoteModalOpened, setPromoteModalOpened] = useState(false)
  const [createBidModalOpened, setCreateBidModalOpened] = useState(false)
  const [reportAuctionModalOpened, setReportAuctionModalOpened] = useState(false)
  const [needToLoginModalOpened, setNeedToLoginModalOpened] = useState(false)
  const [assetsGalleryOpened, setAssetsGalleryOpened] = useState(false)
  const [removeAuctionModalOpened, setRemoveAuctionModalOpened] = useState(false)
  const [unverifiedUserModalOpened, setUnverifiedUserModalOpened] = useState(false)

  const [bottomActionsCanBeVisible, setBottomActionsCanBeVisible] = useState(true)
  const [needToLoginModalContent, setNeedToLoginModalContent] = useState('')

  const [historyModalOpened, setHistoryModalOpened] = useState(false)

  const shouldEnableTranslationRef = useRef<boolean | null>(null)
  const currentCurrency = useCurrentCurrency()

  const toggleHistoryModal = () => {
    setHistoryModalOpened(!historyModalOpened)
  }

  const toggleBidCreationModal = () => {
    setBottomActionsCanBeVisible(createBidModalOpened)
    setCreateBidModalOpened(!createBidModalOpened)
  }

  const togglePromoteModal = () => {
    setBottomActionsCanBeVisible(promoteModalOpened)
    setPromoteModalOpened(!promoteModalOpened)
  }

  const toggleRemoveAuctionModal = () => {
    setBottomActionsCanBeVisible(removeAuctionModalOpened)
    setRemoveAuctionModalOpened(!removeAuctionModalOpened)
  }

  const toggleAssetsGallery = () => {
    setBottomActionsCanBeVisible(assetsGalleryOpened)
    setAssetsGalleryOpened(!assetsGalleryOpened)
  }

  const toggleReportAuctionModal = () => {
    setBottomActionsCanBeVisible(reportAuctionModalOpened)
    setReportAuctionModalOpened(!reportAuctionModalOpened)
  }

  const toggleNeedToLoginModal = () => {
    setBottomActionsCanBeVisible(needToLoginModalOpened)
    setNeedToLoginModalOpened(!needToLoginModalOpened)
    setNeedToLoginModalContent('')
  }

  const toggleUnverifiedUserModal = () => {
    setUnverifiedUserModalOpened(!unverifiedUserModalOpened)
  }

  const currentAccount = AppStore.accountData

  useEffect(() => {
    if (!currentAccount) {
      return
    }

    AuctionsController.storeSeenAuction(auction)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount])

  useEffect(() => {
    if (!currentAccount) {
      return
    }

    const isOwnerOfAuction = auction.auctioneer?.id === currentAccount.id
    if (!isOwnerOfAuction) {
      return
    }

    BidsController.markBidsFromAuctionAsSeen(auction.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount])

  const handleReportAuction = () => {
    if (!AppStore.accountData?.id) {
      setNeedToLoginModalContent(t('anonymous.login_to_report'))
      setNeedToLoginModalOpened(true)
      return
    }

    toggleReportAuctionModal()
  }

  const handleLoveTap = (isLiked: boolean) => {
    if (!AppStore.accountData?.id) {
      setNeedToLoginModalContent(t('anonymous.login_for_favourites'))
      setNeedToLoginModalOpened(true)
      return false
    }

    if (isLiked) {
      FavouritesController.addAuctionToFavourites(auction)
    } else {
      FavouritesController.removeAuctionFromFavourites(auction)
    }

    return true
  }

  const convertPrice = (price: number, fromCurrencyId?: string): number => {
    const targetCurrencyCode = currentCurrency?.code
    if (!fromCurrencyId || !targetCurrencyCode) {
      return price
    }

    const fromCurrency = appCurrencies.find((currency: Currency) => currency.id === fromCurrencyId)
    if (!fromCurrency) {
      return price
    }

    const fromCurrencyCode = fromCurrency.code
    if (fromCurrencyCode === targetCurrencyCode) {
      return price
    }

    const fromRate = appExchangeRate?.rates[fromCurrencyCode] ?? 1.0
    const toRate = appExchangeRate?.rates[targetCurrencyCode] ?? 1.0

    const convertedPrice = (price / fromRate) * toRate

    // Rount to 4 decimals (ceiling)
    const factor = 10 ** 4
    return Math.ceil(convertedPrice * factor) / factor
  }

  const openCreateBidModal = async () => {
    if (!AppStore.accountData?.id) {
      setNeedToLoginModalContent(t('anonymous.login_to_bid'))
      setNeedToLoginModalOpened(true)
      return
    }

    const allowUnvalidatedUsersToCreateBids = appSettings.allowUnvalidatedUsersToCreateBids
    const emailIsVerified = await AuthService.userHasEmailVerified(appSettings)
    if (
      !allowUnvalidatedUsersToCreateBids &&
      !emailIsVerified &&
      !AuthService.userHasPhoneNumber()
    ) {
      toggleUnverifiedUserModal()
      return
    }

    const nonRejectedOrAcceptedBids = auction.bids?.filter(
      (bid) => !bid.isRejected && !bid.isAccepted
    )
    if (!nonRejectedOrAcceptedBids?.length) {
      toggleBidCreationModal()
      return
    }

    const highestBid = nonRejectedOrAcceptedBids?.reduce((max, obj) => {
      return convertPrice(obj.price ?? 0, obj.initialCurrencyId ?? appSettings.defaultCurrencyId) >
        convertPrice(max.price ?? 0, max.initialCurrencyId ?? appSettings.defaultCurrencyId)
        ? obj
        : max
    }, auction.bids[0])

    if (!highestBid) {
      toggleBidCreationModal()
      return
    }

    if (highestBid && highestBid?.bidder?.id === AppStore.accountData?.id) {
      toast.error(t('auction_details.create_bid.already_have_highest_bid'))
      return
    }

    toggleBidCreationModal()
  }

  const handleCreateReport = async (reportOption: string, details?: string) => {
    try {
      return await ReportsController.create('auction', auction.id, reportOption, details)
    } catch (error) {
      console.error(`Error creating report: ${error}`)
      return false
    }
  }

  const handleCreateBid = async (bidData: CreateBidParams) => {
    try {
      const createdBid = await BidsController.create(bidData, auction.id)

      if (createdBid) {
        const auctionClone = { ...auction }
        auctionClone.bids.push(createdBid)
        setAuction(auctionClone)
      }
      return true
    } catch (error) {
      console.error(`Error creating bid: ${error}`)
      return false
    }
  }

  const handleRemoveBid = async (bidId: string) => {
    try {
      await BidsController.delete(bidId)
      if (auction.bidsCount && auction.bidsCount > 0) {
        auction.bidsCount -= 1
      }

      const auctionClone = { ...auction }
      auctionClone.bids = auctionClone.bids.filter((bid) => bid.id !== bidId)
      setAuction(auctionClone)
      return true
    } catch (error) {
      console.error(`Error removing bid: ${error}`)
      return false
    }
  }

  const handleRejectBid = async (bidId: string, reason?: string) => {
    try {
      const rejected = await BidsController.update({
        bidId: bidId,
        isRejected: true,
        rejectionReason: reason,
      })
      if (!rejected) {
        return false
      }

      const auctionClone = { ...auction }
      auctionClone.bids = auctionClone.bids.map((bid) => {
        if (bid.id === bidId) {
          bid.isRejected = true
          bid.rejectionReason = reason
        }
        return bid
      })
      setAuction(auctionClone)
      return true
    } catch (error) {
      console.error(`Error rejecting bid: ${error}`)
      return false
    }
  }

  const handleAcceptBid = async (bidId: string) => {
    try {
      const accepted = await BidsController.update({
        bidId: bidId,
        isAccepted: true,
      })
      if (!accepted) {
        return false
      }

      const bid = auction.bids.find((bid) => bid.id === bidId)
      const auctionClone = { ...auction }
      auctionClone.acceptedBidId = bidId
      auctionClone.bids = auctionClone.bids.map((bid) => {
        if (bid.id === bidId) {
          bid.isAccepted = true
        }
        return bid
      })

      // Automatically create a chat group between the bidder and the auction owner
      const auctionOwner = auction?.auctioneer?.id ?? AppStore.accountData?.id
      if (auctionOwner && bid?.bidder?.id) {
        await ChatController.loadForTwoAccounts(bid.bidder.id, auctionOwner)
      }

      setAuction(auctionClone)
      return true
    } catch (error) {
      console.error(`Error accepting bid: ${error}`)
      return false
    }
  }

  const handleRemoveAuction = () => {
    return AuctionsController.remove(auction.id)
  }

  const handleTranslateAuctionDetails = async () => {
    const result = await AuctionsController.translateDetails(
      auction.id,
      globalContext.currentLanguage
    )
    if (!result) {
      return { title: auction.title, description: auction.description }
    }

    return result
  }

  const handlePromoteAuction = async () => {
    const promoted = await AuctionsController.promote(
      auction.id,
      globalContext.appSettings.promotionCoinsCost
    )
    if (promoted) {
      const auctionClone = { ...auction }
      auctionClone.promotedAt = new Date()
      setAuction(auctionClone)
    }
    return promoted
  }

  const checkIfTranslationShouldBeEnabled = () => {
    if (shouldEnableTranslationRef.current !== null) {
      return shouldEnableTranslationRef.current
    }

    const titleLang = LanguageDetectorService.detectLanguage(auction.title)
    const descriptionLang = LanguageDetectorService.detectLanguage(auction.description)
    shouldEnableTranslationRef.current = !!(
      (titleLang && titleLang !== currentLanguage) ||
      (descriptionLang && descriptionLang !== currentLanguage)
    )

    return shouldEnableTranslationRef.current
  }

  const currentAccountIsAuctionOwner = AppStore.accountData?.id === auction.auctioneer?.id
  const translationShouldBeEnabled = checkIfTranslationShouldBeEnabled()
  return (
    <>
      <div className="max-width mt-2 mt-lg-4" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
        <div className="d-none d-lg-flex align-items-center justify-content-between mb-20">
          <AuctionDetailsBreadcrumbs auction={auction} />

          {currentAccountIsAuctionOwner && !auction.acceptedBidId && (
            <AuctionDetailsOwnerActions
              auction={auction}
              handlePromote={togglePromoteModal}
              handleRemove={toggleRemoveAuctionModal}
            />
          )}
        </div>
        <div className="row auction-details-root">
          <div className="col-12 col-lg-8 col-md-12 mb-20 col-sm-12 p-10">
            <div className="pos-rel w-100 app-section auction-details-assets-section p-0">
              <AuctionDetailsAssets auction={auction} handleOpenGallery={toggleAssetsGallery} />
              <div className="d-flex d-lg-none auction-details-mobile-button">
                <AuctionDetailsMoreActions
                  auction={auction}
                  handleRemove={toggleRemoveAuctionModal}
                />
              </div>
              <div
                className="d-flex d-lg-flex auction-details-mobile-summary"
                style={{ ...((auction.assets?.length ?? 0) > 1 ? { bottom: 44 } : {}) }}
              >
                <AuctionDetailsMobileSummary auction={auction} />
              </div>
            </div>
            <AuctionDetailsCategorySection auction={auction} />

            <div className="w-100 p-16 mt-20 app-section">
              <AuctionDetailsContentSection
                auction={auction}
                openReport={handleReportAuction}
                handleLoveTap={handleLoveTap}
                translateContent={handleTranslateAuctionDetails}
                shouldEnableTranslation={translationShouldBeEnabled ?? false}
              />
            </div>
          </div>
          <div className="col-12 col-lg-4 col-md-12 col-sm-12 p-10">
            <div className="w-100 p-16 app-section pb-0">
              <AuctionDetailsBidsSection
                auction={auction}
                openCreateBidModal={openCreateBidModal}
                handleRemoveBid={handleRemoveBid}
                handleRejectBid={handleRejectBid}
                handleAcceptBid={handleAcceptBid}
                convertPrice={convertPrice}
              />
            </div>
            <div className="w-100 p-16 mt-20 radius-4 app-section">
              <AuctionDetailsAuctioneerSection auction={auction} />
            </div>
            <div className="w-100 p-16 mt-20 app-section">
              <AuctionDetailsStatusSection auction={auction} />
            </div>
            <div className="w-100 p-16 mt-20 radius-4 app-section">
              <AuctionDetailsLocationSection auction={auction} />
            </div>
          </div>

          {auction.acceptedBidId && (
            <div className="mt-20">
              <AuctionDetailsGivenReviews auction={auction} />
              <AuctionDetailsLeaveReview auction={auction} />
            </div>
          )}
        </div>
        <div className="mb-100 mt-50">
          <SimilarAuctionsSection auction={auction} />
          {auction.auctioneer && (
            <div className="mt-50">
              <AuctionsBySameAuctioneer auctioneer={auction.auctioneer!} />
            </div>
          )}
        </div>

        <AuctionDetailsMobileBottomActions
          auction={auction}
          canBeDisplayed={bottomActionsCanBeVisible}
          handlePromote={togglePromoteModal}
          handleCreateBid={openCreateBidModal}
        />
        <CreateBidModal
          auction={auction}
          isOpened={createBidModalOpened}
          close={toggleBidCreationModal}
          handleCreate={handleCreateBid}
          convertPrice={convertPrice}
        />
        <ReportAuctionModal
          isOpened={reportAuctionModalOpened}
          close={toggleReportAuctionModal}
          onConfirm={handleCreateReport}
        />
        <YouNeedToLoginModal
          isOpened={needToLoginModalOpened}
          close={toggleNeedToLoginModal}
          title={needToLoginModalContent}
        />
        <EmailVerificationNeeded
          isOpened={unverifiedUserModalOpened}
          close={toggleUnverifiedUserModal}
          onValidated={openCreateBidModal}
        />
        <AssetsGalleryModal
          isOpened={assetsGalleryOpened}
          setOpened={setAssetsGalleryOpened}
          assets={auction.assets ?? []}
          title={t('auction_details.auction_images')}
        />
        <RemoveAuctionModal
          handleSubmit={handleRemoveAuction}
          isOpened={removeAuctionModalOpened}
          close={toggleRemoveAuctionModal}
        />
        <PromoteAuctionModal
          isOpened={promoteModalOpened}
          close={togglePromoteModal}
          handleSubmit={handlePromoteAuction}
        />
      </div>

      <AuctionBottomActionsWrapper>
        <div className="auction-bottom-actions-wrapper gap-2">
          {AppStore.accountData?.id === auction.auctioneer?.id && (
            <button className="border-btn" onClick={toggleHistoryModal}>
              {t('auction_history.auction_history')}
            </button>
          )}
          <AuctionCommentsButton auctionId={auction.id} />
        </div>
      </AuctionBottomActionsWrapper>

      <AuctionHistoryModal
        events={auction.historyEvents ?? []}
        isOpened={historyModalOpened}
        close={toggleHistoryModal}
      />
    </>
  )
})
