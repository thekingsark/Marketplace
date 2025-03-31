import React, { useCallback, useState } from 'react'
import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  InfoWindow,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps'
import { Icon } from '@/components/common/icon'
import { AuctionClusteredMarkerDetails } from './details'
import Supercluster, { PointFeature } from 'supercluster'
import { GeoJsonProperties } from 'geojson'
import { useClickOutside } from '@/hooks/click-outside'

interface FeaturesClusterMarker {
  clusterId: number
  getLeaves: (clusterId: number) => Supercluster.PointFeature<GeoJsonProperties>[]
  position: google.maps.LatLngLiteral
  size: number
  sizeAsText: string
}

export const FeaturesClusterMarker = (props: FeaturesClusterMarker) => {
  const { clusterId, position, size, sizeAsText, getLeaves } = props
  const [markerRef, marker] = useAdvancedMarkerRef()

  const [detailsVisible, setDetailsVisible] = useState(false)
  const [detailsLeaves, setDetailsLeaves] = useState<PointFeature<GeoJsonProperties>[]>([])

  const pinRef = React.useRef<HTMLDivElement>(null)
  const detailsRef = React.useRef<HTMLDivElement>(null)

  useClickOutside(
    detailsRef,
    () => {
      if (detailsVisible) {
        setDetailsVisible(false)
      }
    },
    [],
    [],
    ['gm-style-iw-c']
  )

  const handleClick = useCallback(() => {
    setDetailsVisible(!detailsVisible)
    const leaves = getLeaves(clusterId)
    setDetailsLeaves(leaves)
  }, [getLeaves, detailsVisible, clusterId])

  const markerSize = Math.floor(48 + Math.sqrt(size) * 2)

  return (
    <AdvancedMarker
      ref={markerRef}
      position={position}
      zIndex={size}
      onClick={handleClick}
      className={'marker cluster'}
      style={{ width: markerSize, height: markerSize }}
      anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
    >
      <div ref={pinRef} className="d-flex flex-column align-content-center align-items-center">
        <Icon type="header/auction" size={18} />
        <span className="d-flex align-items-center justify-content-center">{sizeAsText}</span>
      </div>

      {detailsVisible && (
        <InfoWindow onCloseClick={() => setDetailsVisible(false)} anchor={marker}>
          <div ref={detailsRef} className="auction-cluster-details-root">
            <AuctionClusteredMarkerDetails points={detailsLeaves} />
          </div>
        </InfoWindow>
      )}
    </AdvancedMarker>
  )
}
