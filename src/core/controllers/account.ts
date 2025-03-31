import { AccountsRepository } from '../repositories/account'
import { AccountNotifications } from '../domain/account'
import { AppStore } from '../store'
import { compressFile } from '@/utils/compressor'
import { Category } from '../domain/category'
import { AuthController } from './auth'
import { AuctionsController } from './auctions'
import { runInAction } from 'mobx'

class AccountController {
  async finishCategoriesSetup(categories: Category[]) {
    try {
      const account = AppStore.accountData!
      runInAction(() => {
        account.categoriesSetupDone = true
        account.preferredCategoriesIds = categories.map((c) => c.id)
      })

      const updatedAccount = await AccountsRepository.update(account)
      if (!updatedAccount) {
        return false
      }

      AuctionsController.refreshRecommendations()
      return true
    } catch (error) {
      console.error(`Error finishing categories setup: ${error}`)
      return false
    }
  }

  async askForVerification() {
    const asked = await AccountsRepository.askForVerification()
    if (!asked) {
      return false
    }

    const account = AppStore.accountData!
    runInAction(() => {
      account.verificationRequestedAt = new Date()
    })

    return true
  }

  async saveLocationToAccount(lat?: number, lng?: number, locationPretty?: string) {
    try {
      const account = AppStore.accountData
      if (!account) {
        return false
      }

      if (account.locationLatLng?.lat === lat && account.locationLatLng?.lng === lng) {
        return true
      }

      runInAction(() => {
        account.locationLatLng = lat && lng ? { lat, lng } : undefined
        account.locationPretty = locationPretty ?? ''
      })

      const updatedAccount = await AccountsRepository.update(account)
      if (!updatedAccount) {
        return false
      }

      return true
    } catch (error) {
      console.error(`Error saving location to account: ${error}`)
      return false
    }
  }

  async updateAccountCurrency(currencyId: string) {
    try {
      const account = AppStore.accountData!
      runInAction(() => {
        account.selectedCurrencyId = currencyId
      })

      await AccountsRepository.update(account)
      return true
    } catch (error) {
      console.error(`Error updating account currency: ${error}`)
      return false
    }
  }

  async finishInto() {
    try {
      const account = AppStore.accountData!
      runInAction(() => {
        account.introDone = true
      })
      await AccountsRepository.update(account)
      return true
    } catch (error) {
      console.error(`Error finishing intro: ${error}`)
      return false
    }
  }

  async skipIntro() {
    try {
      const account = AppStore.accountData!
      runInAction(() => {
        account.introSkipped = true
      })
      await AccountsRepository.update(account)
      return true
    } catch (error) {
      console.error(`Error skipping intro: ${error}`)
      return false
    }
  }

  async acceptTerms(acceptedTerms: boolean) {
    try {
      const account = AppStore.accountData!
      if (!account) {
        return
      }
      runInAction(() => {
        account.acceptedTermsAndCondition = acceptedTerms
      })

      await AccountsRepository.update(account)
      return true
    } catch (error) {
      console.error(`Error accepting terms: ${error}`)
      return false
    }
  }

  async loadAccountStats() {
    try {
      const account = AppStore.accountData!
      if (!account) {
        return
      }

      const stats = await AccountsRepository.loadStats()
      if (stats) {
        this.updateAccountAuctionsCountFromStats(stats)
      }
    } catch (error) {
      console.error(`Error loading account stats: ${error}`)
    }
  }

  async updateAccountAllowedNotifications(notifications: AccountNotifications) {
    try {
      if (!AppStore.accountData?.id) {
        return
      }

      runInAction(() => {
        AppStore.accountData!.allowedNotifications = notifications
      })

      await AccountsRepository.update({ ...AppStore.accountData })
      return true
    } catch (error) {
      console.error(`Error updating account notifications: ${error}`)
      return false
    }
  }

  async blockAccount(accountId: string) {
    try {
      if (!AppStore.accountData?.id) {
        return
      }

      await AccountsRepository.blockAccount(accountId)
      runInAction(() => {
        AppStore.accountData!.blockedAccounts = AppStore.accountData!.blockedAccounts ?? []
        AppStore.accountData!.blockedAccounts.push(accountId)
      })

      return true
    } catch (error) {
      console.error(`Error blocking account: ${error}`)
      return false
    }
  }

  async unblockAccount(accountId: string) {
    try {
      if (!AppStore.accountData?.id) {
        return
      }

      await AccountsRepository.unblockAccount(accountId)
      runInAction(() => {
        AppStore.accountData!.blockedAccounts = AppStore.accountData!.blockedAccounts?.filter(
          (id) => id !== accountId
        )
      })

      return true
    } catch (error) {
      console.error(`Error unblocking account: ${error}`)
      return false
    }
  }

  async updateNameAndProfilePicture(name?: string, asset?: File) {
    if (!name && !asset) {
      return false
    }

    let compressedAsset: File | null = null
    if (asset) {
      compressedAsset = await compressFile(asset)
    }

    try {
      const account = AppStore.accountData
      if (!account) {
        return false
      }

      if (name) {
        runInAction(() => {
          account.name = name
        })
      }

      const updatedAccount = await AccountsRepository.update(account, compressedAsset ?? undefined)
      if (!updatedAccount) {
        return false
      }
      if (asset) {
        runInAction(() => {
          AppStore.accountData!.picture = updatedAccount?.picture
        })
      }
      return true
    } catch (error) {
      console.error(`Error updating name and profile picture: ${error}`)
      return false
    }
  }

  async deleteAccount() {
    try {
      const deleted = await AccountsRepository.delete()
      if (!deleted) {
        return false
      }
      await AuthController.logout()
      return true
    } catch (error) {
      console.error(`Failed to delete account: ${error}`)
      return false
    }
  }

  updateAccountAuctionsCountFromStats(accountStats: Record<string, number>) {
    runInAction(() => {
      AppStore.accountStats.allAuctionsCount = accountStats.auctions
      AppStore.accountStats.activeAuctions = accountStats.activeAuctions
      AppStore.accountStats.closedAuctions = accountStats.closedAuctions
      AppStore.accountStats.allBidsCount = accountStats.bids
      AppStore.accountStats.acceptedBids = accountStats.acceptedBids
      AppStore.accountStats.rejectedBids = accountStats.rejectedBids
    })
  }
}

const accountController = new AccountController()
export { accountController as AccountController }
