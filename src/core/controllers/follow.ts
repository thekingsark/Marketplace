import { FollowersRepository } from '../repositories/followers'
import { AppStore } from '../store'
import { runInAction } from 'mobx'

class FollowController {
  follow = async (accountId: string) => {
    try {
      if (!AppStore.accountData) {
        return
      }

      await FollowersRepository.followAccount(accountId)

      runInAction(() => {
        AppStore.accountData!.followersCount = (AppStore.accountData!.followersCount ?? 0) + 1
        if (!AppStore.accountData!.followingAccountsIds) {
          AppStore.accountData!.followingAccountsIds = []
        }
        AppStore.accountData!.followingAccountsIds?.push(accountId)
      })
      return true
    } catch (error) {
      console.error('Could not follow account.', error)
      return false
    }
  }

  unfollow = async (accountId: string) => {
    try {
      if (!AppStore.accountData) {
        return
      }

      await FollowersRepository.unfollowAccount(accountId)

      runInAction(() => {
        AppStore.accountData!.followersCount = (AppStore.accountData!.followersCount ?? 1) - 1
        if (AppStore.accountData!.followersCount < 0) {
          AppStore.accountData!.followersCount = 0
        }

        AppStore.accountData!.followingAccountsIds =
          AppStore.accountData!.followingAccountsIds?.filter((id) => id !== accountId)
      })
      return true
    } catch (error) {
      console.error('Could not unfollow account.', error)
      return false
    }
  }

  getFollowers = async (accountId: string, page = 0, perPage = 20) => {
    return FollowersRepository.getFollowers(accountId, page, perPage)
  }

  getFollowing = async (accountId: string, page = 0, perPage = 20) => {
    return FollowersRepository.getFollowing(accountId, page, perPage)
  }
}

const followControllerInstance = new FollowController()
Object.freeze(followControllerInstance)
export { followControllerInstance as FollowController }
