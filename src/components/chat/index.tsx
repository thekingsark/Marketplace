'use client'

import React, { useEffect, useState } from 'react'
import { ChatWindow } from './window'
import { observer } from 'mobx-react-lite'
import { AppStore } from '@/core/store'

export const ChatRoot = observer(() => {
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  )
  const openedChatGroups = AppStore.openedChatGroups

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const computeWindowsToDisplay = () => {
    const maxWindows = Math.floor(screenWidth / (400 + 32))
    if (maxWindows < 2) {
      return openedChatGroups.slice(0, 1)
    }

    return openedChatGroups.slice(0, maxWindows)
  }

  const windowsToDisplay = computeWindowsToDisplay()

  return (
    <div>
      {windowsToDisplay.map((group, index) => {
        const rightOffset = index * 432
        return (
          <ChatWindow
            key={group.id}
            rightOffset={rightOffset ? rightOffset : 16}
            chatGroup={group}
          />
        )
      })}
    </div>
  )
})
