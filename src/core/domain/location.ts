export class Location {
  id: string
  name: string
  auctionsCount?: number

  constructor(params: Record<string, unknown> = {}) {
    this.id = params.id as string
    this.name = params.name as string
    this.auctionsCount = params.auctionsCount as number
  }

  static fromJSON(params: Record<string, unknown> = {}): Location {
    return new Location(params)
  }
}

export class GooglePlaceDetails {
  geometry: {
    location: {
      lat: number
      lng: number
    }
    viewport: {
      northeast: { lat: number; lng: number }
      southwest: { lat: number; lng: number }
    }
  }

  address_components: {
    long_name: string
    short_name: string
    types: string[]
  }[]

  adr_address: string

  name: string
  place_id: string
  reference: string
  utc_offset: number
  vicinity: string

  constructor(params: Record<string, unknown> = {}) {
    this.adr_address = params.adr_address as string
    this.name = params.name as string
    this.place_id = params.place_id as string
    this.reference = params.reference as string
    this.utc_offset = params.utc_offset as number
    this.vicinity = params.vicinity as string

    this.geometry = params.geometry as {
      location: { lat: number; lng: number }
      viewport: {
        northeast: { lat: number; lng: number }
        southwest: { lat: number; lng: number }
      }
    }

    this.address_components = params.address_components as {
      long_name: string
      short_name: string
      types: string[]
    }[]
  }
}

export class GooglePlacesPrediction {
  description: string
  matched_substrings: string[]
  place_id: string
  reference: string
  structured_formatting: {
    main_text: string
    main_text_matched_substrings: string[]
    secondary_text: string
  }
  terms: string[]
  types: string[]

  constructor(params: Record<string, unknown> = {}) {
    this.description = params.description as string
    this.matched_substrings = params.matched_substrings as string[]
    this.place_id = params.place_id as string
    this.reference = params.reference as string
    this.terms = params.terms as string[]
    this.types = params.types as string[]

    this.structured_formatting = params.structured_formatting as {
      main_text: string
      main_text_matched_substrings: string[]
      secondary_text: string
    }
  }
}
