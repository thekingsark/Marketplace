import { GeoJsonProperties } from 'geojson'
import { PointFeature } from 'supercluster'
import Image from 'next/image'
import DefaultAssetImage from '@/../public/assets/img/default-item.jpeg'
import useGlobalContext from '@/hooks/use-context'
import { CategoryIcon } from '@/components/common/category-icon'
import Link from 'next/link'
import { Icon } from '@/components/common/icon'
import { Countdown } from '@/components/common/countdown'

export const AuctionClusteredMarkerDetails = (props: {
  points: PointFeature<GeoJsonProperties>[]
}) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage

  const serverBaseURL = process.env.NEXT_PUBLIC_SERVER_URL

  const { defaultProductImageUrl } = globalContext.appSettings

  return (
    <div className="d-flex pt-0 cluster-marker-details-root">
      {props.points.map((point) => {
        const category = globalContext.appCategories.find(
          (category) => category.id === point.properties?.categoryId
        )

        const deadline = new Date(point.properties?.expiresAt)

        return (
          <Link key={point.id} href={`/auction/${point.properties!.auctionId}`}>
            <div className="pos-rel cluster-marker-details-item">
              <div className="pos-rel cluster-marker-details-image">
                <Image
                  fill
                  src={
                    point.properties?.assetPath
                      ? `${serverBaseURL}/assets/${point.properties?.assetPath}`
                      : defaultProductImageUrl.length
                        ? defaultProductImageUrl
                        : DefaultAssetImage.src
                  }
                  alt={point.properties?.auctionId}
                  style={{ objectFit: 'cover', borderRadius: 4 }}
                />
              </div>
              <div className="cluster-marker-details-category">
                <CategoryIcon category={category} size={18} />
                <span>{category?.name[currentLanguage]}</span>
              </div>
              <div className="cluster-marker-details-countdown ">
                <div className="countdown-wrapper gap-2">
                  <div className="hourglass-wrapper">
                    <Icon type="generic/hourglass" size={18} />
                  </div>
                  <Countdown deadlineDate={deadline} />
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
