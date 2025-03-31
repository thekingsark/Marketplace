'use client'
import { AppStore } from '@/core/store'
import useGlobalContext from '@/hooks/use-context'
import React, { useEffect, useState } from 'react'
import { useTranslation } from '@/app/i18n/client'
import { useClickOutside } from '@/hooks/click-outside'
import { IconButton } from '../common/icon-button'
import { ELEMENT_IDS } from '@/constants/ids'
import { YouNeedToLogin } from '../common/you-need-to-login'
import { observer } from 'mobx-react-lite'
import { NotificationsList } from './notifications/list'
import { dir } from 'i18next'

export const NotificationsButton = observer(() => {
  const currentAccount = AppStore.accountData ?? undefined
  const unreadNotificationsCount = AppStore.userUnreadNotificationsCount

  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)
  const direction = dir(currentLanguage)

  const [notificationsVisible, setNotificationsVisible] = useState(false)

  const notifMenuRef = React.useRef<HTMLDivElement>(null)
  const buttonRef = React.useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 50, right: 0 })
  const [initialised, setInitialised] = useState(false)

  useEffect(() => {
    if (!initialised) {
      setInitialised(true)
    }
  }, [])

  useClickOutside(
    notifMenuRef,
    () => {
      if (notificationsVisible) {
        setNotificationsVisible(false)
      }
    },
    [notificationsVisible],
    [buttonRef]
  )

  const hideNotifications = () => {
    setNotificationsVisible(false)
  }

  const handleShowNotifications = () => {
    const rect = buttonRef.current?.getBoundingClientRect()
    if (!rect) {
      return
    }
    const newPos = {
      top: 50,
      right: 0,
    }

    const maxWidthOfDetails = !currentAccount
      ? 350
      : window.innerWidth > 1200
        ? 500
        : window.innerWidth - 30

    if (rect.bottom + maxWidthOfDetails > window.innerWidth) {
      newPos.top -= rect.bottom + maxWidthOfDetails - window.innerWidth
      newPos.top -= 45
    }

    const availableWidth = window.innerWidth - (window.innerWidth - (rect.width + rect.left))
    const windowWidthIsSmallerThanDetails = availableWidth < maxWidthOfDetails
    if (windowWidthIsSmallerThanDetails) {
      const rightSpace = window.innerWidth - rect.right
      const overflowAmount =
        window.innerWidth > 1200
          ? 0
          : maxWidthOfDetails - rightSpace - (window.innerWidth - rect.width) + 100
      newPos.right -= overflowAmount ? overflowAmount : 0
    }

    setPosition(newPos)
    setNotificationsVisible(!notificationsVisible)
  }

  return (
    <div className={`pos-rel ${notificationsVisible ? 'show-element' : ''}`}>
      <div ref={buttonRef}>
        <IconButton
          noMargin
          icon="header/notification"
          title={t('profile.notifications.notifications')}
          aria-label={t('profile.notifications.notifications')}
          onClick={handleShowNotifications}
          countInfo={unreadNotificationsCount}
          id={ELEMENT_IDS.NOTIFICATIONS_HEADER_BTN}
        />
      </div>

      {initialised && (
        <div
          className="notification-details"
          ref={notifMenuRef}
          style={{
            maxWidth: !currentAccount ? '350px' : `${window.innerWidth - 30}px`,
          }}
        >
          {!currentAccount ? (
            <div className="p-16">
              <YouNeedToLogin message={t('anonymous.login_for_notifications')} />
            </div>
          ) : (
            <NotificationsList onNotificationClick={hideNotifications} />
          )}
          <div
            className="transparent-overlay overlay-open"
            onClick={hideNotifications}
          ></div>
        </div>
      )}
      <style jsx>{`
        .notification-details {
          background: var(--background_1);
          border: 1px solid var(--separator);
          padding: 0;
          min-width: 120px;
          border-radius: 6px;
          position: absolute;
         ${direction === 'rtl' ? 'left: -50px;' : `right: ${position.right}px;`} 
          top: 50px;
          z-index: 99999;
          box-shadow: 5px 30px 20px rgba(37, 52, 103, 0.11);
          display: none;
          width: 500px;
          overflow-y: auto;
        }
        .show-element .notification-details {
          display: block;
        }
      `}</style>
    </div>
  )
})
