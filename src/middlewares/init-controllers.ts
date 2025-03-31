'use client'

import { InitController } from '@/core/controllers/init'
import { AppStore } from '@/core/store'

class InitializeControllers {
  exec = async () => {
    try {
      const userData = AppStore.accountData
      if (userData) {
        return true
      }

      InitController.init(false)
      return true
    } catch (error) {
      console.error(`Could not initialize controllers: ${error}`)
      return true
    }
  }
}

export const initializeControllers = new InitializeControllers()
