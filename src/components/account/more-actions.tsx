import { useTranslation } from '@/app/i18n/client'
import { Account } from '@/core/domain/account'
import { useClickOutside } from '@/hooks/click-outside'
import useGlobalContext from '@/hooks/use-context'
import { observer } from 'mobx-react-lite'
import { useRef, useState } from 'react'
import { Icon } from '../common/icon'
import { AppStore } from '@/core/store'
import { AccountController } from '@/core/controllers/account'
import { BlockOrUnblockAccountModal } from '@/components/account/modals/block-unblock'
import { generateNameForAccount } from '@/utils'
import { ReportAccountModal } from './modals/report'
import { ReportsController } from '@/core/controllers/reports'
import { ShareButton } from '../share/button'

export const AccountMoreActions = observer((props: { account: Account }) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)
  const { account } = props

  const moreActionsRef = useRef<HTMLDivElement>(null)
  const [menuOpened, setMenuOpened] = useState(false)
  const menuButtonRef = useRef<HTMLDivElement>(null)

  const [blockModalOpened, setBlockModalOpened] = useState(false)
  const [reportModalOpened, setReportModalOpened] = useState(false)

  useClickOutside(
    moreActionsRef,
    () => {
      if (menuOpened) {
        setMenuOpened(false)
      }
    },
    [menuOpened],
    [menuButtonRef]
  )

  const toggleReportModal = () => {
    setReportModalOpened(!reportModalOpened)
  }

  const toggleBlockOrUnblockModal = () => {
    setBlockModalOpened(!blockModalOpened)
  }

  const isBlockedByLoggedAccount = () => {
    return AppStore.accountData?.blockedAccounts?.indexOf(account.id) !== -1
  }

  const handleBlockOrUnblock = async () => {
    const isBlocked = isBlockedByLoggedAccount()

    const result = isBlocked
      ? await AccountController.unblockAccount(account.id)
      : await AccountController.blockAccount(account.id)

    return !!result
  }

  const handleReport = async (reportOption: string, details?: string) => {
    try {
      return await ReportsController.create('account', account.id, reportOption, details)
    } catch (error) {
      console.error(`Error creating report: ${error}`)
      return false
    }
  }

  if (!AppStore.accountData?.id || AppStore.accountData?.id === account.id) {
    return null
  }

  return (
    <div className={`pos-rel ${menuOpened ? 'button-menu-show-element' : ''}`} ref={menuButtonRef}>
      <button
        className="border-btn more-actions-btn"
        style={{ width: 45, padding: 0 }}
        onClick={(ev) => {
          ev?.preventDefault()
          ev?.stopPropagation()
          setMenuOpened(!menuOpened)
        }}
      >
        <Icon type="generic/more" />
      </button>

      <div
        className="align-items-center justify-content-end button-menu-content"
        ref={moreActionsRef}
      >
        <div className="d-flex flex-column align-items-center">
          <ul>
            <li
              className="button-menu-content-item d-flex align-items-center gap-2"
              onClick={toggleBlockOrUnblockModal}
            >
              <span>
                {t(isBlockedByLoggedAccount() ? 'profile.block.unblock_2' : 'profile.block.block')}
              </span>
            </li>
            <li
              className="button-menu-content-item d-flex align-items-center gap-2"
              onClick={toggleReportModal}
            >
              <span>{t('reports.report_action')}</span>
            </li>

            <li className="button-menu-content-item d-flex align-items-center gap-2">
              <ShareButton
                fullWidth
                url={`/account/${account.id}`}
                title={t('share.check_account')}
              />
            </li>
          </ul>
        </div>
      </div>

      <BlockOrUnblockAccountModal
        isOpened={blockModalOpened}
        accountName={generateNameForAccount(account)}
        isBlocked={isBlockedByLoggedAccount()}
        onSubmit={handleBlockOrUnblock}
        onClose={toggleBlockOrUnblockModal}
      />

      <ReportAccountModal
        isOpened={reportModalOpened}
        close={toggleReportModal}
        onConfirm={handleReport}
      />
    </div>
  )
})
