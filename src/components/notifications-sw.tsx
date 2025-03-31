'use client'

import { AuthService } from '@/core/services/auth'
import { AppStore } from '@/core/store'
import { observer } from 'mobx-react-lite'
import { useEffect, useRef } from 'react'

interface NotificationsSWProps {
  vapidPublicKey: string
}

export const NotificationsSW = observer((props: NotificationsSWProps) => {
  const currentAccount = AppStore.accountData
  const initializedRef = useRef(false)

  useEffect(() => {
    if (!currentAccount || initializedRef.current) {
      return
    }

    if ('serviceWorker' in navigator) {
      const handleServiceWorker = async () => {
        try {
          const authUser = await AuthService.getAuthUserAsync()
          if (!authUser) {
            return
          }

          const authToken = await authUser.getIdToken()
          if (!authToken) {
            return
          }

          const register = await navigator.serviceWorker.register('/notifications-sw.js')

          const subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: props.vapidPublicKey,
          })

          await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/web-push-subscribe`, {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
              'content-type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
          })

          initializedRef.current = true
        } catch (error) {
          console.info(`Could not register notifications service worker: ${error}`)
        }
      }
      handleServiceWorker()
    }
  }, [currentAccount])

  return null
})
