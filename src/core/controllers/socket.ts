import { BiddoNotification } from '@/core/domain/notification'
import { SocketService } from '@/core/services/socket'
import { Socket } from 'socket.io-client'
import { AppStore } from '../store'
import { runInAction } from 'mobx'

export enum CustomMessages {
  auctionAdded = 'auctionAdded',
  auctionUpdated = 'auctionUpdated',
  auctionRemoved = 'auctionRemoved',
  auctionReactivate = 'auctionReactivate',
  bidAccepted = 'bidAccepted',
  bidAdded = 'bidAdded',
  bidRejected = 'bidRejected',
  bidRemoved = 'bidRemoved',
  bidUpdated = 'bidUpdated',
  reviewAdded = 'reviewAdded',
  appDataLoad = 'appDataLoad',
  system = 'system',
  auctionLastPriceUpdate = 'auctionLastPriceUpdate',
  accountUpdated = 'accountUpdated',
  newNotification = 'newNotification',
  newMessage = 'newMessage',
  messagesRemoved = 'messagesRemoved',
  coinsUpdated = 'coinsUpdated',
  newChatGroup = 'newChatGroup',
  allConnectedAccounts = 'allConnectedAccounts',
  newConnectedAccount = 'newConnectedAccount',
  accountDisconnected = 'accountDisconnected',
  accountVerified = 'accountVerified',
}

class SocketController {
  private socketConnection: Socket | null = null
  private handlers = {} as Record<CustomMessages, Function[]>

  initSocket = async (serverWsUrl: string) => {
    if (this.socketConnection?.active || this.socketConnection?.connected) {
      return
    }

    this.socketConnection = await SocketService.connect(serverWsUrl)
    if (!this.socketConnection) {
      return
    }

    this.socketConnection.on('message', (socketMessage) => {
      try {
        const parsedMessage = JSON.parse(socketMessage)
        if (!parsedMessage.custom) {
          return
        }

        const { type, message } = parsedMessage as {
          type: CustomMessages
          message: unknown
        }

        if (this.handlers[type]) {
          this.handlers[type].forEach((handler) => handler(message))
        }

        switch (type) {
          case CustomMessages.accountVerified:
            runInAction(() => {
              if (AppStore.accountData) {
                AppStore.accountData.verified = true
                AppStore.accountData.verifiedAt = new Date()
              }
            })
            break
          case CustomMessages.newNotification:
            this.handleNewNotification(
              (message as { dataValues: Record<string, unknown> }).dataValues
            )
            break
          case CustomMessages.coinsUpdated:
            runInAction(() => {
              if (AppStore.accountData && message) {
                AppStore.accountData.coins =
                  typeof message === 'object' && 'coins' in message
                    ? (message.coins as number)
                    : (message as number)
              }
            })
            break
          case CustomMessages.allConnectedAccounts:
            const connected = (message as string[]).filter((el) => el)
            const uniqueConnected = Array.from(new Set(connected))
            AppStore.loggedInAccounts = uniqueConnected
            break
          case CustomMessages.newConnectedAccount:
            const alreadyInList = AppStore.loggedInAccounts.find((acc) => acc === message)
            if (!alreadyInList) {
              AppStore.loggedInAccounts.push(message as string)
            }
            break
          case CustomMessages.accountDisconnected:
            if (!message) {
              break
            }
            AppStore.loggedInAccounts = AppStore.loggedInAccounts.filter((acc) => acc !== message)
            break
        }
      } catch (error) {
        console.error('Error handling message', error)
      }
    })
  }

  disconnect = () => {
    if (this.socketConnection) {
      this.socketConnection.disconnect()
      this.socketConnection.close()
    }
  }

  setHandler = (type: CustomMessages, handler: Function) => {
    if (!this.handlers[type]) {
      this.handlers[type] = []
    }

    this.handlers[type].push(handler)
  }

  handleNewNotification = (notificationData: Record<string, unknown>) => {
    const notificationExists = Object.values(AppStore.notifications).find(
      (not) => not.id === notificationData.id
    )
    if (notificationExists) {
      return
    }

    const notification = new BiddoNotification(notificationData)
    if (!notificationData) {
      return
    }

    runInAction(() => {
      AppStore.notifications = { ...AppStore.notifications, [notification.id]: notification }
      AppStore.userUnreadNotificationsCount++
    })
  }
}

const socketController = new SocketController()
export { socketController as SocketController }
