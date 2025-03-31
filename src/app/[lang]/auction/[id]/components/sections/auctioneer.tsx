import { useTranslation } from '@/app/i18n/client'
import { AccountInfo } from '@/components/account/info'
import { SendMessageToAccountButton } from '@/components/common/send-message-button'
import { Auction } from '@/core/domain/auction'
import { AppStore } from '@/core/store'
import useGlobalContext from '@/hooks/use-context'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'

export const AuctionDetailsAuctioneerSection = observer((props: { auction: Auction }) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)
  const { auction } = props

  const currentAccountLoading = AppStore.loadingStates.currentAccount
  const isCurrentAccount = AppStore.accountData?.id === auction.auctioneer?.id

  return (
    <div>
      <Link href={`/account/${auction.auctioneer?.id}`}>
        <AccountInfo account={auction.auctioneer!} />
      </Link>
      {!isCurrentAccount && !currentAccountLoading && !!auction.auctioneer && (
        <div className="mt-20">
          <SendMessageToAccountButton auction={auction} account={auction.auctioneer} fullWidth />
        </div>
      )}

      <Link
        href={
          AppStore.accountData?.id === auction.auctioneer?.id
            ? '/profile?tab=auctions'
            : `/account/${auction.auctioneer?.id}?tab=auctions`
        }
      >
        <div className="top-border d-flex align-items-center justify-content-center mt-20">
          <span className="mt-10 secondary-color">
            {t(
              AppStore.accountData?.id === auction.auctioneer?.id
                ? 'info.see_all_my_auctions'
                : 'info.see_all_auctions_from_user'
            )}
          </span>
        </div>
      </Link>
    </div>
  )
})
