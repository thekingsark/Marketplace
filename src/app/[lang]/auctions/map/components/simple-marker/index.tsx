import React, { useState } from 'react'
import { AdvancedMarker } from '@vis.gl/react-google-maps'
import classNames from 'classnames'
import { AuctionMarkerDetails } from './details'
import { CategoryIcon } from '@/components/common/category-icon'
import useGlobalContext from '@/hooks/use-context'
import { AuctionMarkerAssets } from './images'
import { useClickOutside } from '@/hooks/click-outside'
import { useScreenIsBig } from '@/hooks/use-screen-is-big'
import { GeoJsonProperties } from 'geojson'
import { PointFeature } from 'supercluster'

export const CustomAuctionMarker = (props: { point: PointFeature<GeoJsonProperties> }) => {
  const { point } = props
  const globalContext = useGlobalContext()

  const [detailsOpened, setDetailesOpened] = useState(false)
  const [hovered, setHovered] = useState(false)
  const position = {
    lat: point.geometry.coordinates[1],
    lng: point.geometry.coordinates[0],
  }

  const screenIsBig = useScreenIsBig()
  const mainCategory = globalContext.appCategories.find(
    (category) => category.id === point.properties?.categoryId
  )

  const pinRef = React.useRef<HTMLDivElement>(null)
  const detailsRef = React.useRef<HTMLDivElement>(null)

  useClickOutside(
    detailsRef,
    () => {
      if (detailsOpened) {
        setDetailesOpened(false)
      }
    },
    [detailsOpened],
    [pinRef]
  )

  const renderCustomPin = () => {
    return (
      <>
        <div className="custom-pin">
          <div
            className={`image-container ${detailsOpened ? (screenIsBig ? 'w-50' : 'w-100') : ''}`}
            style={{ zIndex: 2 }}
          >
            <div
              className={`${detailsOpened ? 'h-100' : ''}`}
              style={{ ...(!hovered ? { visibility: 'hidden' } : {}) }}
            >
              <AuctionMarkerAssets
                isExtended={detailsOpened}
                path={point.properties?.assetPath ?? ''}
              />
            </div>
            <span className="icon w-100 h-100" ref={pinRef}>
              <CategoryIcon category={mainCategory} size={30} />
            </span>
          </div>
          <div
            ref={detailsRef}
            className={`${detailsOpened ? (screenIsBig ? 'w-50' : 'w-100') : ''} h-100`}
            style={{ ...(detailsOpened ? { minWidth: 180 } : {}) }}
          >
            <AuctionMarkerDetails auctionId={point.properties?.auctionId} />
          </div>
        </div>
        <div className="tip" />
      </>
    )
  }

  return (
    <div className={`${detailsOpened ? 'opened-advanced-marker' : ''}`}>
      <AdvancedMarker
        position={position}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={classNames('auction-marker', {
          clicked: detailsOpened,
          hovered,
        })}
        onClick={() => setDetailesOpened(!detailsOpened)}
        style={{ ...(detailsOpened ? { zIndex: 100 } : {}) }}
      >
        {renderCustomPin()}
      </AdvancedMarker>
    </div>
  )
}
