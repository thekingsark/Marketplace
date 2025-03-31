import { RequestMaker, RequestType } from '../services/request-maker'
import { GooglePlaceDetails, GooglePlacesPrediction, Location } from '../domain/location'

class LocationsRepository {
  private basePath = '/locations'

  public async load() {
    try {
      const locations = (await RequestMaker.makeRequest({
        path: `${this.basePath}`,
      })) as { data: Array<Partial<Location>> }

      return locations.data.map((location: Record<string, unknown>) => {
        return Location.fromJSON({ ...location })
      })
    } catch (error) {
      throw new Error(`Could not load locations: ${error}`)
    }
  }

  public async searchGooglePlaces(query: string) {
    try {
      const result = await RequestMaker.makeRequest({
        path: `/google-maps/search/${query}`,
        method: RequestType.GET,
      })
      return (result as { predictions: [] })?.predictions?.map(
        (location: Record<string, unknown>) => {
          return new GooglePlacesPrediction({ ...location })
        }
      )
    } catch (error) {
      throw new Error(`Could not search google places: ${error}`)
    }
  }

  public async getGooglePlaceDetails(referenceId: string) {
    try {
      const result = await RequestMaker.makeRequest({
        path: `/google-maps/details/${referenceId}`,
        method: RequestType.GET,
      })
      return new GooglePlaceDetails({
        ...((result as { result: object })?.result ?? {}),
      })
    } catch (error) {
      throw new Error(`Could not get google place details: ${error}`)
    }
  }

  public async getPlaceDetailsFromLatLng(lat: number, lng: number) {
    try {
      const result = await RequestMaker.makeRequest({
        path: `/google-maps/location/${lat}/${lng}`,
        method: RequestType.GET,
      })
      return new GooglePlaceDetails({ ...(result as object) })
    } catch (error) {
      throw new Error(`Could not get google place details by location: ${error}`)
    }
  }
}

const locationsRepository = new LocationsRepository()
export { locationsRepository as LocationsRepository }
