import { createSession, removeSession } from '@/app/actions/auth-actions'
import { AuthController } from '../controllers/auth'

export enum RequestType {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export type PayloadType =
  | string
  | FormData
  | Blob
  | ArrayBufferView
  | ArrayBuffer
  | URLSearchParams
  | ReadableStream<Uint8Array>
  | null

export interface MakeRequestParams {
  method?: RequestType
  path?: string
  payload?: PayloadType
  contentType?: string
  headers?: Record<string, string>
  try?: number
}

export interface IRequestMaker {
  makeRequest: (params?: MakeRequestParams) => Promise<unknown>
  setAuthToken: (token: string) => void
}

class RequestMaker implements IRequestMaker {
  private authToken = ''

  setAuthToken(token: string) {
    this.authToken = token
  }

  async makeRequest(params: MakeRequestParams = {}): Promise<unknown> {
    const {
      method = RequestType.GET,
      path: path = '',
      payload,
      headers: requestHeaders = {},
      contentType = 'application/json',
    } = params
    try {
      const headers: HeadersInit = {}

      if (Object.keys(requestHeaders).length) {
        Object.keys(requestHeaders).forEach((key) => {
          headers[key] = requestHeaders[key]
        })
      }

      if (this.authToken) {
        headers['Authorization'] = `${this.authToken}`
      }

      if (contentType !== 'multipart/form-data') {
        headers['Content-Type'] = contentType
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${path}`, {
        headers,
        method,
        body: payload,
      })

      const responseBody = await response.json()
      if (response.status >= 400 && response.status < 600) {
        throw new Error(JSON.stringify(responseBody))
      }

      return responseBody
    } catch (err) {
      const error = err as Error
      if (error.message.includes('Token expired')) {
        await this.refreshAccessToken()

        if (params.try && params.try > 5) {
          await AuthController.logout()
          window.location.href = '/'
        }

        return this.makeRequest({ ...params, try: (params.try || 0) + 1 })
      }

      throw error
    }
  }

  private async refreshAccessToken() {
    try {
      const authUser = await AuthController.getAuthUserAsync()
      if (!authUser) {
        throw new Error('No auth user')
      }

      const newAccessToken = await authUser.getIdToken()
      if (!newAccessToken) {
        throw new Error('No auth token')
      }

      this.authToken = newAccessToken

      try {
        await removeSession()
        await createSession(newAccessToken)
      } catch (err) {
        console.error('Error creating session', err)
      }
    } catch (error) {
      console.error('Error refreshing access token', error)
      this.authToken = ''
      AuthController.logout()
    }
  }
}

const requestMaker = new RequestMaker()
export { requestMaker as RequestMaker }
