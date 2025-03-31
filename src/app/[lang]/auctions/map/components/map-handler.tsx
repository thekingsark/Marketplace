import { LatLng } from '@/core/domain/auction'
import { useMap } from '@vis.gl/react-google-maps'
import { memo, useEffect } from 'react'

export const MapHandler = memo((props: { place: LatLng, hasInitialDefaultLocation?: boolean }) => {
  const map = useMap()
  const { place, hasInitialDefaultLocation = false } = props

  useEffect(() => {
    if (!map) {
      return
    }

    if (!place || (place.lat == 0 && place.lng == 0)) {
      map.setZoom(2)
      return
    }

    map.setCenter(place)
    map.setZoom(hasInitialDefaultLocation ? 10 : 8)
  }, [map, place])

  return null
})

MapHandler.displayName = 'MapHandler'
