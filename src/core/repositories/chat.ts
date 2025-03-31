import { ChatGroup } from '../domain/chat-group'
import { ChatMessage } from '../domain/chat-message'
import { RequestMaker, RequestType } from '../services/request-maker'

class ChatRepository {
  private basePath = '/chat-group'

  public async sendAssetsMessage(
    message: ChatMessage,
    assets: FileList
  ): Promise<ChatMessage | null> {
    try {
      const form = new FormData()
      for (let i = 0; i < assets.length; i++) {
        form.append('files', assets[i])
      }
      form.set('id', message.id)
      form.set('groupId', message.chatGroupId)

      const response = await RequestMaker.makeRequest({
        path: `${this.basePath}/message/new/assets`,
        method: RequestType.POST,
        payload: form,
        contentType: 'multipart/form-data',
      })
      return ChatMessage.fromJSON(response as Record<string, unknown>)
    } catch (error) {
      console.error('Error sending assets message:', error)
      return null
    }
  }

  public async sendMessage(message: ChatMessage): Promise<ChatMessage | null> {
    try {
      const response = await RequestMaker.makeRequest({
        path: `${this.basePath}/message/new`,
        method: RequestType.POST,
        payload: JSON.stringify({
          message: message.message,
          id: message.id,
          groupId: message.chatGroupId,
        }),
        contentType: 'application/json',
      })
      return ChatMessage.fromJSON(response as Record<string, unknown>)
    } catch (error) {
      console.error('Error sending message:', error)
      return null
    }
  }

  public async removeMessages(groupId: string, messagesIds: string[]): Promise<void> {
    try {
      await RequestMaker.makeRequest({
        path: `${this.basePath}/delete/messages/${groupId}`,
        method: RequestType.POST,
        payload: JSON.stringify({ messagesIds }),
        contentType: 'application/json',
      })
    } catch (error) {
      console.error('Error removing messages:', error)
    }
  }

  public async translate(id: string, language: string): Promise<string | null> {
    try {
      const response = (await RequestMaker.makeRequest({
        path: `${this.basePath}/translate/${id}/${language}`,
        method: RequestType.GET,
      })) as string
      return response
    } catch (error) {
      console.error('Error translating chat message:', error)
      return null
    }
  }

  public async loadById(id: string): Promise<ChatGroup | null> {
    try {
      const response = (await RequestMaker.makeRequest({
        path: `${this.basePath}/${id}`,
        method: RequestType.GET,
      })) as Record<string, unknown>
      return ChatGroup.fromJSON(response)
    } catch (error) {
      console.error('Error loading chat group:', error)
      return null
    }
  }

  public async loadMessagesForGroup(
    groupId: string,
    page = 0,
    perPage = 50
  ): Promise<ChatMessage[]> {
    try {
      const response = (await RequestMaker.makeRequest({
        path: `${this.basePath}/messages/${groupId}/${page}/${perPage}`,
        method: RequestType.GET,
      })) as Record<string, unknown>[]
      return response.map((el: Record<string, unknown>) => ChatMessage.fromJSON(el))
    } catch (error) {
      console.error('Error loading chat messages:', error)
      return []
    }
  }

  public async markMessagesAsSeen(chatGroupId: string): Promise<void> {
    try {
      await RequestMaker.makeRequest({
        path: `${this.basePath}/seen/${chatGroupId}`,
        method: RequestType.PUT,
      })
    } catch (error) {
      console.error('Error marking messages as seen:', error)
    }
  }

  public async loadGroupsForAccount(): Promise<ChatGroup[]> {
    try {
      const response = (await RequestMaker.makeRequest({
        path: this.basePath,
        method: RequestType.GET,
      })) as Record<string, unknown>[]
      return response.map((el: Record<string, unknown>) => ChatGroup.fromJSON(el))
    } catch (error) {
      console.error('Error loading chat groups:', error)
      return []
    }
  }

  public async sendMessageToAccount(accountId: string): Promise<boolean> {
    try {
      const response = (await RequestMaker.makeRequest({
        path: `${this.basePath}/sendMessage/${accountId}`,
        method: RequestType.POST,
      })) as { sent: boolean }
      return response.sent
    } catch (error) {
      console.error('Error sending message to account:', error)
      return false
    }
  }

  public async loadForTwoAccounts(firstAcc: string, secondAcc: string): Promise<ChatGroup | null> {
    try {
      const response = (await RequestMaker.makeRequest({
        path: `${this.basePath}/${firstAcc}/${secondAcc}`,
        method: RequestType.GET,
      })) as Record<string, unknown>
      return ChatGroup.fromJSON(response)
    } catch (error) {
      console.error('Error loading chat group for two accounts:', error)
      return null
    }
  }

  public async createOrLoadWithAccount(
    accountId: string,
    auctionId?: string
  ): Promise<ChatGroup | null> {
    try {
      const response = (await RequestMaker.makeRequest({
        path: `${this.basePath}/${accountId}`,
        method: RequestType.POST,
        ...(auctionId ? { payload: JSON.stringify({ auctionId }) } : {}),
      })) as Record<string, unknown>
      return ChatGroup.fromJSON(response)
    } catch (error) {
      console.error('Error creating or loading chat group with account:', error)
      return null
    }
  }
}

const chatRepository = new ChatRepository()
export { chatRepository as ChatRepository }
