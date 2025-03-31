import { useTranslation } from '@/app/i18n/client'
import { Auction } from '@/core/domain/auction'
import { AppStore } from '@/core/store'
import useGlobalContext from '@/hooks/use-context'
import { calculateDistanceBetweenPoints } from '@/utils'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export const AuctionDetailsLocationSection = observer((props: { auction: Auction }) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)
  const { auction } = props

  const currentAccount = AppStore.accountData
  const [distance, setDistance] = useState<number | null>(AppStore.accountData?.locationLatLng ? calculateDistanceBetweenPoints(
    currentAccount!.locationLatLng!.lat,
    currentAccount!.locationLatLng!.lng,
    auction.location.lat,
    auction.location.lng
  ) : null)


  useEffect(() => {
    if (!currentAccount) {
      return
    }

    const accountLocation = currentAccount.locationLatLng
    if (!accountLocation) {
      return
    }

    const newDistance = calculateDistanceBetweenPoints(
      accountLocation.lat,
      accountLocation.lng,
      auction.location.lat,
      auction.location.lng
    )

    setDistance(newDistance)
  }, [currentAccount])

  const formatDouble = (value: number) => {
    if (value % 1 === 0) {
      return new Intl.NumberFormat().format(Math.floor(value));
    }
    if (value < 1) {
      return new Intl.NumberFormat().format(value);
    }
    return new Intl.NumberFormat().format(Math.floor(value));
  }

  return (
    <div className="w-100 d-flex flex-column">
      <div className="d-flex flex-column align-items-start">
        <div className="d-flex align-items-center justify-content-between w-100">
          <span className="auction-details-section-title">{t('location.location')}</span>
          <Link href={`/auctions/map?lat=${auction.location.lat}&lng=${auction.location.lng}`} className="border-btn">Show on map</Link>
        </div>
        <div className="d-flex align-items-center justify-content-between w-100 mt-10">
          <span className="secondary-color">{auction.locationPretty}</span>
          <span>{distance !== null ? t('location.distance', { no: formatDouble(distance) }) : ''}</span>
        </div>
      </div>
      <iframe
        title="location"
        className="w-100 mt-10"
        style={{ borderRadius: 6 }}
        src={`https://www.google.com/maps?q=${auction.location.lat},${auction.location.lng}&z=15&output=embed`}
      ></iframe>
    </div>
  )
})
