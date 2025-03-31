import React, { useCallback, useEffect, useRef, useState } from 'react'
import { NotificationItem } from './item'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'
import { toast } from 'react-toastify'
import InfiniteScroll from 'react-infinite-scroll-component'
import { NotificationsController } from '@/core/controllers/notifications'
import { AppStore } from '@/core/store'
import { Icon } from '@/components/common/icon'
import { observer } from 'mobx-react-lite'
import { NoNotifications } from './no-notifications'
import { BiddoNotification } from '@/core/domain/notification'

export const NotificationsList = observer((props: {
  onNotificationClick: () => void
}) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const sortNotificationsInReverse = (notifications: Record<string, BiddoNotification> = {}) => {
    return Object.values(notifications).sort((a, b) => {
      return (
        (new Date(b.createdAt ?? new Date())?.getTime() ?? 0) -
        (new Date(a.createdAt ?? new Date())?.getTime() ?? 0)
      )
    })
  }

  const initialNotifications = AppStore.notifications

  const [notifications, setNotifications] = useState(
    sortNotificationsInReverse(initialNotifications)
  )
  const [isLoading, setIsLoading] = useState(false)
  const loaderRef = useRef(null)

  const [page, setPage] = useState(1)
  const [reachedEnd, setReachedEnd] = useState(false)
  const [markAllAsSeenInProgress, setMarkAllAsSeenInProgress] = useState(false)

  const initialNotificationsLoading = AppStore.loadingStates.notifications
  const unseenNotificationsCount = AppStore.userUnreadNotificationsCount

  useEffect(() => {
    if (initialNotificationsLoading) {
      return
    }
    setNotifications(sortNotificationsInReverse(initialNotifications))
  }, [initialNotifications])

  const fetchData = useCallback(async () => {
    if (isLoading || initialNotificationsLoading || reachedEnd) {
      return
    }

    setIsLoading(true)

    try {
      const newNotifications = await NotificationsController.loadForAccount(page)
      if (newNotifications.length === 0) {
        setReachedEnd(true)
      }

      setPage(page + 1)
      setNotifications((prev) => [...prev, ...newNotifications])
    } catch (error) {
      console.error(`Could not load notifications: ${error}`)
      toast.error(t('generic.something_went_wrong'), { delay: 5000 })
    } finally {
      setIsLoading(false)
    }
  }, [page, initialNotificationsLoading])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0]
      if (target.isIntersecting) {
        fetchData()
      }
    })

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => {
      if (loaderRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(loaderRef.current)
      }
    }
  }, [fetchData])

  const markAllAsSeen = async () => {
    if (markAllAsSeenInProgress) {
      return
    }

    setMarkAllAsSeenInProgress(true)
    const markedAsSeen = await NotificationsController.markAllAsRead()
    if (!markedAsSeen) {
      toast.error(t('notifications.mark_as_seen_error'))
    } else {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    }

    setMarkAllAsSeenInProgress(false)
  }

  return (
    <div className="root">
      <div className="d-flex justify-content-between align-items-center mb-20 mt-20 pl-20 pr-20 pt-10">
        <h3 className="mt-0 mb-0">{t('profile.notifications.notifications')} </h3>
        {unseenNotificationsCount === 0 ? null : (
          <>
            <button className="border-btn" onClick={markAllAsSeen}>
              {!markAllAsSeenInProgress ? (
                t('home.notifications.mark_as_seen')
              ) : (
                <div className="d-flex align-items-center justify-content-center">
                  <Icon type="loading" />
                </div>
              )}
            </button>
          </>
        )}
      </div>

      {!initialNotificationsLoading && notifications.length === 0 ? <NoNotifications /> : null}

      <div id="notifications-list-root">
        {!initialNotificationsLoading && (
          <InfiniteScroll
            dataLength={notifications.length}
            next={() => fetchData()}
            hasMore={!reachedEnd}
            loader={
              !notifications.length ? null : (
                <div className="loader-wrapper d-flex align-items-center justify-content-center mb-20">
                  <Icon type="loading" color={'#fff'} size={40} />
                </div>
              )
            }
            scrollableTarget="notifications-list-root"
          >
            {notifications.map((notification, index) => {
              return <NotificationItem key={index} notification={notification} handleClick={props.onNotificationClick} />
            })}
          </InfiniteScroll>
        )}
      </div>
      <style jsx>{`
        #notifications-list-root {
          overflow-y: auto;
          max-height: 450px;
        }
        .root {
          position: relative;
          z-index: 10;
        }
      `}</style>
    </div>
  )
})
