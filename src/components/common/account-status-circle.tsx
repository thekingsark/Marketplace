import { useTranslation } from '@/app/i18n/client'
import { AppStore } from '@/core/store'
import useGlobalContext from '@/hooks/use-context'
import { observer } from 'mobx-react-lite'

export const AccountStatusCircle = observer((props: { accountId: string }) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const isLoggedIn = AppStore.loggedInAccounts.includes(props.accountId)
  return (
    <div
      className={`account-status-circle ${isLoggedIn ? 'logged-in-account' : 'logged-out-account'}`}
      title={isLoggedIn ? t('generic.online') : t('generic.offline')}
    ></div>
  )
})
