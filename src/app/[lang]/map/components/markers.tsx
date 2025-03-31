import React from 'react'
import Supercluster, { ClusterProperties, PointFeature } from 'supercluster'
import { GeoJsonProperties } from 'geojson'
import { useSupercluster } from '@/hooks/use-supercluster'
import { FeaturesClusterMarker } from './clustered-marker'
import { CustomAuctionMarker } from './simple-marker'

interface AuctionDetailsMapMarkersProps {
  geojson: PointFeature<GeoJsonProperties>[]
}

const superclusterOptions: Supercluster.Options<GeoJsonProperties, ClusterProperties> = {
  extent: 256,
  radius: 80,
  maxZoom: 12,
}

export const AuctionDetailsMapMarkers = (props: AuctionDetailsMapMarkersProps) => {
  const { geojson } = props
  const { clusters, getLeaves } = useSupercluster(geojson, superclusterOptions)

  return (
    <>
      {clusters.map((feature) => {
        const [lng, lat] = feature.geometry.coordinates

        const clusterProperties = feature.properties as ClusterProperties
        const isCluster: boolean = clusterProperties.cluster

        return isCluster ? (
          <FeaturesClusterMarker
            key={feature.id}
            clusterId={clusterProperties.cluster_id}
            position={{ lat, lng }}
            size={clusterProperties.point_count}
            sizeAsText={String(clusterProperties.point_count_abbreviated)}
            getLeaves={getLeaves}
          />
        ) : (
          <CustomAuctionMarker key={feature.id} point={feature} />
        )
      })}
    </>
  )
}
