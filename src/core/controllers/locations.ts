import { GooglePlaceDetails } from '../domain/location'
import { LocationsRepository } from '../repositories/locations'

class LocationsController {
  searchGooglePlaces(query: string) {
    return LocationsRepository.searchGooglePlaces(query)
  }

  getGooglePlaceDetails(referenceId: string) {
    return LocationsRepository.getGooglePlaceDetails(referenceId)
  }

  locationIsInRomania(location: GooglePlaceDetails) {
    return location.address_components?.some((addr) => {
      return addr.types.includes('country') && addr.short_name === 'RO'
    })
  }

  getPlaceDetailsFromLatLng(lat: number, lng: number) {
    return LocationsRepository.getPlaceDetailsFromLatLng(lat, lng)
  }

  getLocationFromCurrentDevice = (): Promise<GooglePlaceDetails | null> => {
    const options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0,
    }

    return new Promise(async (resolve, reject) => {
      if (!navigator.geolocation) {
        return resolve(null)
      }

      const errors = (err: unknown) => {
        reject(err)
      }

      const success = async (position: GeolocationPosition) => {
        try {
          const placeDetails = await LocationsRepository.getPlaceDetailsFromLatLng(
            position.coords.latitude,
            position.coords.longitude
          )

          resolve(placeDetails)
        } catch (error) {
          console.error(`Could not get place details from lat lng: ${error}`)
          resolve(null)
        }
      }

      try {
        const permissionStatus = await navigator.permissions.query({
          name: 'geolocation',
        })

        if (permissionStatus.state === 'granted') {
          navigator.geolocation.getCurrentPosition(success, errors, options)
        } else if (permissionStatus.state === 'prompt') {
          navigator.geolocation.getCurrentPosition(success, errors, options)
        } else if (permissionStatus.state === 'denied') {
          reject('denied')
        }

        if (permissionStatus.state === 'denied') {
          reject('denied')
        }
      } catch (error) {
        return reject(error)
      }
    })
  }
}

const locationsController = new LocationsController()
export { locationsController as LocationsController }
