import { io, Socket } from 'socket.io-client'
import { AuthService } from './auth'

class SocketService {
  onMessageHandler: ((message: MessageEvent) => void) | undefined = undefined
  socketConnection: Socket | null = null

  private wasInitializedOnce = false

  async connect(serverWSURL: string) {
    const authUser = await AuthService.getAuthUserAsync()
    if (!authUser) {
      console.error('Could not get auth user')
    }

    const token = authUser ? await authUser.getIdToken() : ''

    this.socketConnection = io(serverWSURL, {
      transports: ['websocket'],
      auth: { token },
      query: { token },
      extraHeaders: { token },
    })

    this.socketConnection.on('connect', () => {
      if (!this.wasInitializedOnce) {
        this.wasInitializedOnce = true
      }
    })

    return this.socketConnection as Socket
  }

  attachMessageHandler(handler: (message: MessageEvent) => void) {
    if (!handler) {
      return null
    }

    this.onMessageHandler = (message: MessageEvent<unknown>) => {
      handler(message)
    }
    return this.socketConnection
  }
}

const socketService = new SocketService()
export { socketService as SocketService }
