import { useTranslation } from '@/app/i18n/client'
import { ChatGroup } from '@/core/domain/chat-group'
import useGlobalContext from '@/hooks/use-context'
import React, { useEffect } from 'react'
import { NoConversation } from './no-chats'
import { AppStore } from '@/core/store'
import { observer } from 'mobx-react-lite'
import { ChatGroupCard } from './group-card'
import { ChatController } from '@/core/controllers/chat'
import Link from 'next/link'

export const ChatGroupsList = observer((props: { close: () => void }) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)
  const { close } = props

  const sortChats = (chats: ChatGroup[]) => {
    return chats.slice().sort((a, b) => {
      return (b.lastMessageAt?.getTime() ?? 0) - (a.lastMessageAt?.getTime() ?? 0)
    })
  }
  const initialChatGroups = AppStore.chatGroups
  const [chatGroups, setChatGroups] = React.useState<ChatGroup[]>(sortChats(initialChatGroups))

  useEffect(() => {
    const chatGroups = sortChats(AppStore.chatGroups)
    setChatGroups(chatGroups)
  }, [initialChatGroups])

  const openChatGroup = (chatGroup: ChatGroup) => {
    ChatController.openChatGroup(chatGroup)
    close()
  }

  return (
    <div className="root">
      <div className="d-flex flex-column justify-content-between mb-20 mt-20 pl-20 pr-20 pt-10">
        <div className="d-flex align-items-center justify-content-between mb-20">
          <h3 className="mt-0 mb-0"> {t('chat.chat')} </h3>
          {!!chatGroups.length && (
            <Link href={`/profile?tab=chat`}>
              <button className="border-btn" aria-label={t('generic.see_all')}>
                {t('generic.see_all')}
              </button>
            </Link>
          )}
        </div>

        <div className="chat-groups-list-root">
          {chatGroups.length ? (
            chatGroups.map((chat, i) => {
              return (
                <ChatGroupCard key={i} chatGroup={chat} openChatGroup={() => openChatGroup(chat)} />
              )
            })
          ) : (
            <NoConversation />
          )}
        </div>
      </div>

      <style jsx>{`
        .chat-items {
          max-height: 420px;
          overflow-y: auto;
        }
        .root {
          position: relative;
          z-index: 10;
        }
        .chat-groups-list-root {
          max-height: 450px;
          overflow-y: auto;
        }
      `}</style>
    </div>
  )
})
