import { RequestMaker, RequestType } from '../services/request-maker'
import { Account } from '../domain/account'

class AccountsRepository {
  async loadLoggedIn(): Promise<Account | null> {
    try {
      const response = (await RequestMaker.makeRequest({
        method: RequestType.GET,
        path: '/account',
      })) as Record<string, unknown>
      return Account.fromJSON(response)
    } catch (error) {
      console.error('Error loading logged-in user:', error)
      return null
    }
  }

  async delete(): Promise<boolean> {
    try {
      await RequestMaker.makeRequest({
        method: RequestType.DELETE,
        path: '/account',
      })
      return true
    } catch (error) {
      console.error('Error deleting account:', error)
      return false
    }
  }

  async loadAccountDetails(accountId: string): Promise<Account | null> {
    try {
      const response = (await RequestMaker.makeRequest({
        method: RequestType.GET,
        path: `/account/details/${accountId}`,
      })) as Record<string, unknown>
      return Account.fromJSON(response)
    } catch (error) {
      console.error('Error loading account details:', error)
      return null
    }
  }

  async askForVerification() {
    try {
      await RequestMaker.makeRequest({
        method: RequestType.PUT,
        path: '/account/requestVerification',
      })
      return true
    } catch (error) {
      console.error('Error asking for verification:', error)
      return false
    }
  }

  async update(account: Account, asset?: File): Promise<Account | null> {
    const {
      name,
      allowedNotifications,
      acceptedTermsAndCondition,
      introDone,
      introSkipped,
      categoriesSetupDone,
      preferredCategoriesIds,
      locationLatLng,
      locationPretty,
      selectedCurrencyId,
    } = account

    const payload = {
      meta: account.meta?.asObject(),
      name,
      allowedNotifications,
      categoriesSetupDone,
      locationLatLng: JSON.stringify([locationLatLng?.lat ?? null, locationLatLng?.lng ?? null]),
      locationPretty,
      selectedCurrencyId,
      acceptedTermsAndCondition,
      introDone,
      introSkipped,
      preferredCategoriesIds,
    } as Record<string, unknown>

    const form = new FormData()
    if (asset) {
      Object.keys(payload).forEach((key) => {
        const value = payload[key]
        form.append(key, typeof value === 'string' ? value : JSON.stringify(value))
      })

      form.append('files', asset)
    }
    const finalPayload = asset ? form : JSON.stringify(payload)

    try {
      const response = (await RequestMaker.makeRequest({
        method: RequestType.POST,
        path: '/account',
        payload: finalPayload,
        contentType: asset ? 'multipart/form-data' : 'application/json',
      })) as Record<string, unknown>
      return Account.fromJSON(response)
    } catch (error) {
      console.error('Could not update account:', error)
      return null
    }
  }

  async search(keyword: string, page: number = 0): Promise<Account[]> {
    try {
      const response = (await RequestMaker.makeRequest({
        method: RequestType.POST,
        path: '/account/search',
        payload: JSON.stringify({ keyword, page }),
        contentType: 'application/json',
      })) as Record<string, unknown>[]
      return response.map((el: Record<string, unknown>) => Account.fromJSON(el))
    } catch (error) {
      console.error('Error searching accounts:', error)
      return []
    }
  }

  async loadStats(): Promise<Record<string, number> | null> {
    try {
      const response = (await RequestMaker.makeRequest({
        method: RequestType.GET,
        path: '/account/stats',
      })) as Record<string, number>
      return response
    } catch (error) {
      console.error('Error loading account stats:', error)
      return null
    }
  }

  async blockAccount(accountId: string): Promise<void> {
    await RequestMaker.makeRequest({
      method: RequestType.PUT,
      path: `/account/update/blocked/block/${accountId}`,
    })
  }

  async unblockAccount(accountId: string): Promise<void> {
    await RequestMaker.makeRequest({
      method: RequestType.PUT,
      path: `/account/update/blocked/unblock/${accountId}`,
    })
  }
}

const accountsRepository = new AccountsRepository()
export { accountsRepository as AccountsRepository }
