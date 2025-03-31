export interface ILocalStorageService<T> {
  retrieveData: () => void

  set: <K extends keyof T>(key: K, value: T[K]) => void
  get: <K extends keyof T>(key: K) => T[K] | undefined
}

export enum STORAGE_DATA {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  USER_STATE = 'USER_STATE',
  ACCEPTED_NEWSLETTER = 'ACCEPTED_NEWSLETTER',
  ACCEPTED_TERMS = 'ACCEPTED_TERMS',
  COMMITED_ACCEPTED_TERMS = 'COMMITED_ACCEPTED_TERMS',
}

export interface LocalStorageData {
  [STORAGE_DATA.ACCESS_TOKEN]?: string
}

const USER_DATA = 'thqUserData'

class LocalStorageService {
  private localStorageData: LocalStorageData = {}

  retrieveData = () => {
    const stringData = localStorage.getItem(USER_DATA)
    if (!stringData) {
      return
    }

    try {
      this.localStorageData = JSON.parse(stringData)
    } catch (error) {
      console.error(error)
    }
  }

  get: ILocalStorageService<LocalStorageData>['get'] = (key) => {
    return this.localStorageData[key]
  }

  set: ILocalStorageService<LocalStorageData>['set'] = (key, value) => {
    if (typeof window === 'undefined') {
      return
    }

    this.localStorageData[key] = value
    localStorage.setItem(USER_DATA, JSON.stringify(this.localStorageData))
  }
}

const localStorageService = new LocalStorageService()
export { localStorageService as LocalStorageService }
