import { useTranslation } from '@/app/i18n/client'
import { AuthService } from '@/core/services/auth'
import { AppStore } from '@/core/store'
import useGlobalContext from '@/hooks/use-context'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { EmailVerificationNeeded } from '../modals/email-verification-needed'

export const CreateAuctionButton = observer(
  (props: { height?: number; fullWidth?: boolean; handleClick?: () => void }) => {
    const { height, fullWidth, handleClick } = props
    const globalContext = useGlobalContext()
    const currentLanguage = globalContext.currentLanguage
    const appSettings = globalContext.appSettings
    const { t } = useTranslation(currentLanguage)

    const [isEmailVerificationNeeded, setIsEmailVerificationNeeded] = useState(false)

    const router = useRouter()

    const toggleEmailVerificationNeeded = () => {
      setIsEmailVerificationNeeded(!isEmailVerificationNeeded)
    }

    const handleButtonClick = async () => {
      if (!AppStore.accountData?.id) {
        router.push('/auth/login')
        return
      }

      handleClick?.()
      const allowUnvalidatedUsersToCreateAuctions = appSettings.allowUnvalidatedUsersToCreateAuctions
      const emailIsVerified = await AuthService.userHasEmailVerified(appSettings)
      if (!allowUnvalidatedUsersToCreateAuctions && !emailIsVerified && !AuthService.userHasPhoneNumber()) {
        toggleEmailVerificationNeeded()
        return
      }

      router.push('/auction-create')
    }

    return (
      <>
        <button
          onClick={handleButtonClick}
          className={`fill-btn create-auction-btn ${fullWidth ? 'w-100' : ''}`}
          style={{ ...(height ? { height } : {}) }}
        >
          <span> {t('create_auction.create_auction')}</span>
        </button>
        <EmailVerificationNeeded
          isOpened={isEmailVerificationNeeded}
          close={toggleEmailVerificationNeeded}
          onValidated={handleButtonClick}
        />
      </>
    )
  }
)
