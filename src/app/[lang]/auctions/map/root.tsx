'use client'
import { APIProvider, Map } from '@vis.gl/react-google-maps'
import { LatLng } from '@/core/domain/auction'
import { useState } from 'react'
import { LocationsController } from '@/core/controllers/locations'
import { MapHandler } from './components/map-handler'
import { AuctionsMapControls } from './components/controls'

import { GeoJsonProperties } from 'geojson'
import { AuctionDetailsMapMarkers } from './components/markers'
import { PointFeature } from 'supercluster'
import { Category } from '@/core/domain/category'
import { useSearchParams } from 'next/navigation'

export type CastleFeatureProps = {
  name: string
  wikipedia: string
  wikidata: string
}

export const AuctionsMapRoot = (props: {
  apiKey: string
  auctionsMapClusters: Record<string, unknown>[]
}) => {
  const { apiKey, auctionsMapClusters } = props
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined)
  const searchParams = useSearchParams()

  const [selectedLagLng, setSelectedLatLng] = useState<LatLng>({
    lat: searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : 0,
    lng: searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : 0,
  })

  const generateGeoJson = (auctionsMapClusters: Record<string, unknown>[]) => {
    return auctionsMapClusters.map((cluster) => ({
      id: cluster.id,
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [cluster.locationLong, cluster.locationLat],
      },
      properties: {
        auctionId: cluster.id,
        categoryId: (cluster.meta as { mainCategoryId: string }).mainCategoryId,
        assetPath: (cluster.meta as { assetPath: string }).assetPath ?? '',
        expiresAt: cluster.expiresAt,
      },
    })) as PointFeature<GeoJsonProperties>[]
  }

  const [geojson, setGeojson] = useState<PointFeature<GeoJsonProperties>[]>(
    generateGeoJson(auctionsMapClusters)
  )

  const computeLatLangFromLocation = async (referenceId: string | null) => {
    if (!referenceId) {
      return
    }

    const locationDetails = await LocationsController.getGooglePlaceDetails(referenceId)
    const { lat, lng } = locationDetails.geometry?.location ?? {}
    if (lat && lng) {
      setSelectedLatLng({ lat, lng })
    }
  }

  const handleCategoryPick = (category?: Category) => {
    if (!category) {
      if (selectedCategory) {
        setGeojson(generateGeoJson(auctionsMapClusters))
        setSelectedCategory(undefined)
      }
      return
    }

    const filteredGeojson = auctionsMapClusters.filter(
      (cluster) => (cluster.meta as { mainCategoryId: string }).mainCategoryId === category.id
    )

    setGeojson(generateGeoJson(filteredGeojson))
    setSelectedCategory(category)
  }

  const hasInitialDefaultLocation = !!searchParams.get('lat') && !!searchParams.get('lng')
  return (
    <div
      className="pos-rel d-flex flex-col align-items-center w-100"
      style={{ flexDirection: 'column' }}
    >
      <div
        className="auctions-map w-100"
        style={{
          width: '100%',
          borderRadius: 6,
          height: 'calc(100vh - 250px)',
        }}
      >
        <APIProvider apiKey={apiKey} libraries={['marker']}>
          <Map
            mapId={'custom-map'}
            style={{ width: '100%', height: '100%', borderRadius: 6 }}
            defaultCenter={{
              lat: selectedLagLng?.lat,
              lng: selectedLagLng?.lng,
            }}
            defaultZoom={
              selectedLagLng?.lat === 0 && selectedLagLng.lng === 0
                ? 2
                : hasInitialDefaultLocation
                  ? 10
                  : 8
            }
            gestureHandling={'greedy'}
            disableDefaultUI
          />
          {geojson && <AuctionDetailsMapMarkers geojson={geojson} />}
          <AuctionsMapControls
            selectedCategory={selectedCategory}
            useDeviceLocation={hasInitialDefaultLocation ? false : true}
            handleLocationPick={computeLatLangFromLocation}
            handleCategoryPick={handleCategoryPick}
          />
          <MapHandler place={selectedLagLng} hasInitialDefaultLocation={hasInitialDefaultLocation} />
        </APIProvider>
      </div>
    </div>
  )
}
