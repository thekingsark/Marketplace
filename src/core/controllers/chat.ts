import { Auction } from '../domain/auction'
import { ChatGroup } from '../domain/chat-group'
import { ChatMessage, ChatMessageStatus } from '../domain/chat-message'
import { ChatRepository } from '../repositories/chat'
import { AppStore } from '../store'
import { CustomMessages, SocketController } from './socket'
import { runInAction } from 'mobx'

export const DEFAULT_CHAT_MESSAGES_PER_PAGE = 30

class ChatController {
  private isInitialized = false

  async init() {
    if (this.isInitialized) {
      return
    }

    await this.loadChatGroups()
    this.isInitialized = true

    SocketController.setHandler(CustomMessages.newMessage, this.handleNewMessageReceived)
    SocketController.setHandler(CustomMessages.newChatGroup, this.handleNewChatGroup)
    SocketController.setHandler(CustomMessages.messagesRemoved, this.handleMessagesRemoved)
  }

  async loadChatGroups() {
    const chatGroupsData = await ChatRepository.loadGroupsForAccount()
    runInAction(() => {
      AppStore.chatGroups = []
      AppStore.chatGroups = [...AppStore.chatGroups, ...chatGroupsData]
    })

    for (const element of chatGroupsData) {
      await this.loadMessagesForGroup(element.id, 0, DEFAULT_CHAT_MESSAGES_PER_PAGE)
    }
  }

  async loadMessagesForGroup(
    groupId: string,
    page = 0,
    perPage = DEFAULT_CHAT_MESSAGES_PER_PAGE,
    olderMessages = false
  ) {
    // If we're fetching the first page, but we already have
    // some items in the chat messages array, we don't need to
    // fetch the messages again.
    if (page === 0 && AppStore.chatMessages[groupId]?.length) {
      return
    }

    const messages = await ChatRepository.loadMessagesForGroup(groupId, page, perPage)
    messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    if (!AppStore.chatMessages[groupId] || page === 0) {
      runInAction(() => {
        AppStore.chatMessages[groupId] = []
      })
    }

    const messagesToParse = olderMessages ? messages : messages.reverse()

    for (const message of messagesToParse) {
      const alreadyAdded = AppStore.chatMessages[groupId].find(
        (element) => element.id === message.id
      )
      if (alreadyAdded) {
        continue
      }

      runInAction(() => {
        if (olderMessages) {
          AppStore.chatMessages[groupId].unshift(message)
        } else {
          AppStore.chatMessages[groupId].push(message)
        }
      })
    }
  }

  translateMessage = async (messageId: string, language: string) => {
    return ChatRepository.translate(messageId, language)
  }

  handleNewChatGroup = async (data: Record<string, unknown>) => {
    const newChatGroup = ChatGroup.fromJSON(data)
    const existingChatGroup = AppStore.chatGroups.find((group) => group.id === newChatGroup.id)

    if (existingChatGroup) {
      return
    }

    runInAction(() => {
      AppStore.chatGroups = [newChatGroup, ...AppStore.chatGroups]
      AppStore.chatMessages[newChatGroup.id] = []
    })
  }

  handleNewMessageReceived = async (data: Record<string, unknown>) => {
    const newCreatedMessage = ChatMessage.fromJSON(data)
    const groupId = newCreatedMessage.chatGroupId

    runInAction(() => {
      if (!AppStore.chatMessages[groupId]) {
        AppStore.chatMessages[groupId] = []
      }

      AppStore.chatMessages[groupId].push(newCreatedMessage)

      const chatGroup = AppStore.chatGroups.values().find((element) => element.id == groupId)

      const groupIsOpened = AppStore.openedChatGroups.find(
        (openedGroup) => openedGroup.id === groupId
      )
      if (chatGroup && !groupIsOpened) {
        chatGroup.unreadMessages = (chatGroup.unreadMessages ?? 0) + 1
      }
    })
  }

  loadForTwoAccounts = async (firstAccountId: string, secondAccountId: string) => {
    try {
      const chatGroup = await ChatRepository.loadForTwoAccounts(firstAccountId, secondAccountId)
      if (!chatGroup) {
        return
      }

      const existingChatGroup = AppStore.chatGroups.find((group) => group.id === chatGroup.id)

      if (!existingChatGroup) {
        runInAction(() => {
          AppStore.chatGroups = [chatGroup, ...AppStore.chatGroups]
          AppStore.chatMessages[chatGroup.id] = []
        })
      }
    } catch (error) {
      console.error(
        'Could not load chat group for accounts:',
        firstAccountId,
        secondAccountId,
        error
      )
    }
  }

  async sendMessage(chatMessage: ChatMessage, assets?: FileList) {
    const { chatGroupId } = chatMessage

    runInAction(() => {
      if (!AppStore.chatMessages[chatGroupId]) {
        AppStore.chatMessages[chatGroupId] = []
      }

      AppStore.chatMessages[chatGroupId].push(chatMessage)
      const chatGroupToUpdate = AppStore.chatGroups.find((element) => element.id === chatGroupId)

      if (chatGroupToUpdate) {
        chatGroupToUpdate.lastMessageAt = chatMessage.createdAt
      }
    })

    const sentMessage = assets?.length
      ? await ChatRepository.sendAssetsMessage(chatMessage, assets)
      : await ChatRepository.sendMessage(chatMessage)

    runInAction(() => {
      const messageToUpdate = AppStore.chatMessages[chatGroupId].find(
        (element) => element.id === chatMessage.id
      )

      if (!messageToUpdate) {
        return
      }

      messageToUpdate.status = !!sentMessage ? ChatMessageStatus.sent : ChatMessageStatus.error

      if (sentMessage?.assetPaths?.length) {
        messageToUpdate.assetPaths = sentMessage?.assetPaths
      }
    })
  }

  handleMessagesRemoved = (data: { groupId: string; messagesIds: string[] }) => {
    const { groupId, messagesIds } = data

    const chatGroup = AppStore.chatGroups.values().find((element) => element.id == groupId)

    if (!chatGroup) {
      return
    }

    const groupMessages = AppStore.chatMessages[groupId]
    if (!groupMessages) {
      return
    }

    for (const messageId of messagesIds) {
      const message = groupMessages.find((element) => element.id == messageId)
      // if the message is unread, we need to decrement the unread messages count
      if (message && message.seenAt == null) {
        chatGroup.unreadMessages = (chatGroup.unreadMessages ?? 1) - 1
      }

      if (message) {
        runInAction(() => {
          AppStore.chatMessages[groupId] = groupMessages.filter(
            (element) => element.id !== messageId
          )
        })
      }
    }

    this.updateChatGroupLastMessageWithLatestMessage(groupId)
  }

  async openChatGroupWithAccount(accountId: string) {
    try {
      const chatGroup = await this.createOrLoadChatGroupWithAccount(accountId)
      if (!chatGroup) {
        return false
      }

      this.openChatGroup(chatGroup)
      return true
    } catch (error) {
      console.error('Could not open chat group:', error)
      return false
    }
  }

  openChatGroup(group: ChatGroup) {
    const groupAlreadyOpened = AppStore.openedChatGroups.find(
      (openedGroup) => openedGroup.id === group.id
    )

    if (groupAlreadyOpened) {
      return
    }

    runInAction(() => {
      if (AppStore.openedChatGroups.length >= 2) {
        AppStore.openedChatGroups.shift()
      }
      AppStore.openedChatGroups.push(group)
    })
    this.markMessagesAsSeen(group.id)
  }

  closeChatGroup(groupId: string) {
    runInAction(() => {
      AppStore.openedChatGroups = AppStore.openedChatGroups.filter(
        (openedGroup) => openedGroup.id !== groupId
      )
    })
  }

  async markMessagesAsSeen(chatGroupId: string) {
    let unseenMessagesExisted = false
    const chatGroup = AppStore.chatGroups.find((element) => element.id == chatGroupId)
    if (!chatGroup) {
      return
    }

    chatGroup.unreadMessages = 0

    const messagesList = AppStore.chatMessages[chatGroupId]
    if (!messagesList) {
      return
    }

    for (const element of AppStore.chatMessages[chatGroupId]!) {
      runInAction(() => {
        if (!element.seenAt) {
          unseenMessagesExisted = true
          element.seenAt = new Date()
        }
      })
    }

    if (unseenMessagesExisted) {
      await ChatRepository.markMessagesAsSeen(chatGroupId)
    }
  }

  createOrLoadChatGroupWithAccount = async (accountId: string, auction?: Auction) => {
    const chatGroup = AppStore.chatGroups.find(
      (group) => group.firstAccountId === accountId || group.secondAccountId === accountId
    )

    if (chatGroup) {
      if (!chatGroup.chatGroupAuctions) {
        chatGroup.chatGroupAuctions = []
      }

      const auctionAlreadyInAdded = chatGroup.chatGroupAuctions?.some((el) => el.id === auction?.id)

      if (!auctionAlreadyInAdded && auction) {
        runInAction(() => {
          chatGroup.chatGroupAuctions = [auction, ...(chatGroup.chatGroupAuctions ?? [])]
        })

        // Calling this again, because it will actually add the auction to the chat
        // on the server side as well
        ChatRepository.createOrLoadWithAccount(accountId, auction.id)
      }

      return chatGroup
    }

    try {
      const newChatGroup = await ChatRepository.createOrLoadWithAccount(accountId, auction?.id)
      if (!newChatGroup) {
        return null
      }

      runInAction(() => {
        AppStore.chatGroups = [newChatGroup, ...AppStore.chatGroups]
        AppStore.chatMessages[newChatGroup.id] = []
      })

      return newChatGroup
    } catch (error) {
      console.error('Could not create chat group:', error)
      return null
    }
  }

  private updateChatGroupLastMessageWithLatestMessage(groupId: string) {
    runInAction(() => {
      const chatGroupToUpdate = AppStore.chatGroups
        .values()
        .find((element) => element.id == groupId)

      if (!chatGroupToUpdate) {
        return
      }

      const messagesList = AppStore.chatMessages[groupId]
      if (!messagesList) {
        return
      }

      const lastMessage = messagesList.length ? messagesList[messagesList.length - 1] : null

      if (!lastMessage) {
        return
      }

      chatGroupToUpdate.lastMessageAt = lastMessage.createdAt
    })
  }
}

const chatController = new ChatController()
export { chatController as ChatController }
