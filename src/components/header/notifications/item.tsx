import React, { useEffect, useState } from 'react'
import useGlobalContext from '@/hooks/use-context'
import { useRouter } from 'next/navigation'
import { BiddoNotification } from '@/core/domain/notification'
import { NotificationsController } from '@/core/controllers/notifications'
import { ChatController } from '@/core/controllers/chat'
import { Icon } from '@/components/common/icon'
import { AppStore } from '@/core/store'
import { FormattedDate } from '@/components/common/formatted-date'

interface NotificationItemProps {
  notification: BiddoNotification
  handleClick: () => void
}

export const NotificationItem = (props: NotificationItemProps) => {
  const { notification, handleClick } = props

  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const router = useRouter()

  const notificationUrl = NotificationsController.generateURLForNotification(notification)

  const [isRead, setIsRead] = useState(notification.read)

  useEffect(() => {
    setIsRead(notification.read)
  }, [notification.read])

  const markNotificationAsRead = () => {
    return NotificationsController.markAsRead(props.notification.id)
  }

  const openChatGroup = (chatGroupId: string) => {
    const chatGroup = AppStore.chatGroups.find((group) => group.id === chatGroupId)

    if (!chatGroup) {
      return
    }

    ChatController.openChatGroup(chatGroup)
  }

  const handleNotificationClick = () => {
    setIsRead(true)
    markNotificationAsRead()
    handleClick()

    if (notification.type === 'NEW_MESSAGE') {
      openChatGroup(notification.entityId)
      return
    }

    router.push(notificationUrl)
  }

  const icon = NotificationsController.generateIconForNotification(props.notification)

  return (
    <div
      className={`notification-item mb-0 pl-20 pr-20 pt-10 ${isRead ? '' : 'unread-notification'}`}
      onClick={() => handleNotificationClick()}
    >
      <div className="d-flex align-items-start gap-2">
        <div className="mt-2">
          <Icon type={`notifications/${icon}`} size={40} />
        </div>
        <div className="w-100">
          <div className="d-flex justify-content-between align-items-center">
            <p className="fw-light mb-0 notification-date mt-0">
              <FormattedDate date={notification.createdAt} format='D MMM, H:mm' />
            </p>
          </div>
          <span className="notification-title">{notification.title[currentLanguage]}</span>
          <p className="fw-light">{notification.description[currentLanguage]}</p>
        </div>
      </div>
      <style jsx>{`
        .notification-item {
          cursor: pointer;
        }
        .unread-notification,
        .notification-item:hover {
          background: var(--background_2);
        }
        .notification-title {
          color: var(--font_1);
          line-height: 1.5;
          font-weight: 600;
        }
        .notification-date {
          font-size: 14px;
          margin-bottom: 2px;
        }
      `}</style>
    </div>
  )
}
