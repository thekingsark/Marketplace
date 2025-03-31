'use client'

import { MiddleWareProps } from '@/components/access-gateway'
import { SocketController } from '@/core/controllers/socket'

class WithSocketConnection {
  exec = async (props?: MiddleWareProps) => {
    if (!props) {
      return
    }

    try {
      SocketController.initSocket(props.serverWSUrl!)
      return true
    } catch (error) {
      console.error(`Error initializing socket connection`, error)
      return false
    }
  }
}

export const withSocketConnection = new WithSocketConnection()
