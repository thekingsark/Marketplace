import { useTranslation } from '@/app/i18n/client'
import { Icon } from '@/components/common/icon'
import { FollowController } from '@/core/controllers/follow'
import { Account } from '@/core/domain/account'
import { AppStore } from '@/core/store'
import useGlobalContext from '@/hooks/use-context'
import { generateNameForAccount } from '@/utils'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { SendMessageToAccountButton } from '@/components/common/send-message-button'
import Link from 'next/link'
import { YouAreNowFollowingUserModal } from '@/components/modals/you-are-following'
import { useRouter } from 'next/navigation'
import { AccountMoreActions } from './more-actions'

export const AccountSpecificActions = observer(
  (props: {
    account: Account
    fullWidth?: boolean
    inverted?: boolean
    allowMoreActions?: boolean
    handleFollowDone?: () => void
    handleUnfollowDone?: () => void
    handleOpenChatAction?: () => Promise<void>
  }) => {
    const globalContext = useGlobalContext()
    const currentLanguage = globalContext.currentLanguage
    const { t } = useTranslation(currentLanguage)
    const { account, inverted = false, fullWidth = false, allowMoreActions = false } = props

    const [followActionInProgress, setFollowActionInProgress] = useState(false)
    const [followingModalOpened, setFollowingModalOpened] = useState(false)

    const router = useRouter()

    const toggleYouAreFollowingModal = () => {
      setFollowingModalOpened(!followingModalOpened)
    }

    const isFollowingCurrentAccount = () => {
      return AppStore.accountData?.followingAccountsIds?.includes(account.id)
    }

    const handleUnfollow = async () => {
      if (!AppStore.accountData?.id) {
        router.push('/auth/login')
        return
      }

      if (followActionInProgress) {
        return
      }

      setFollowActionInProgress(true)

      const accountName = generateNameForAccount(account)
      const success = await FollowController.unfollow(account.id)

      if (!success) {
        toast.error(t('profile.could_not_unfollow', { name: accountName }))
        setFollowActionInProgress(false)
        return
      }

      toast.success(t('profile.unfollow_success', { name: accountName }))
      props.handleUnfollowDone?.()

      setFollowActionInProgress(false)
    }

    const handleFollow = async () => {
      if (!AppStore.accountData?.id) {
        router.push('/auth/login')
        return
      }

      if (followActionInProgress) {
        return
      }

      setFollowActionInProgress(true)

      const accountName = generateNameForAccount(account)
      const success = await FollowController.follow(account.id)

      if (!success) {
        toast.error(t('profile.could_not_follow', { name: accountName }))
        setFollowActionInProgress(false)
        return
      }

      props.handleFollowDone?.()
      toggleYouAreFollowingModal()
      setFollowActionInProgress(false)
    }

    const isAlreadyFollowing = isFollowingCurrentAccount()
    const isCurrentUserAccount = AppStore.accountData?.id === account.id

    return (
      <div className={`d-flex gap-4 ${fullWidth ? 'w-100' : ''}`}>
        {isCurrentUserAccount ? (
          <Link href="/profile?tab=settings" className={`${fullWidth ? 'w-100' : ''}`}>
            <button
              className={`${fullWidth ? 'w-100' : ''} inverted-btn`}
              aria-label={t('profile.update_account')}
            >
              {t('profile.update_account')}
            </button>
          </Link>
        ) : (
          <div className={`d-flex align-items-center gap-2 ${fullWidth ? 'w-100' : ''}`}>
            <button
              className={`border-btn follow-action-button ${fullWidth ? 'w-100' : ''}`}
              onClick={isAlreadyFollowing ? handleUnfollow : handleFollow}
            >
              {followActionInProgress ? (
                <div className="loader-wrapper d-flex align-items-center justify-content-center">
                  <Icon type="loading" size={40} />
                </div>
              ) : isAlreadyFollowing ? (
                t('profile.unfollow')
              ) : (
                t('profile.follow')
              )}
            </button>
            <SendMessageToAccountButton
              fullWidth={fullWidth}
              account={account}
              inverted={inverted}
            />
            {allowMoreActions && <AccountMoreActions account={account} />}
          </div>
        )}
        <YouAreNowFollowingUserModal
          isOpened={followingModalOpened}
          close={toggleYouAreFollowingModal}
          account={account}
        />
      </div>
    )
  }
)
