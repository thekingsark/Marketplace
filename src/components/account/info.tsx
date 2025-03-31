import { useTranslation } from '@/app/i18n/client'
import useGlobalContext from '@/hooks/use-context'
import { computeReviewsAverage, generateNameForAccount } from '@/utils'
import Image from 'next/image'
import { Icon } from '../common/icon'
import { Account } from '@/core/domain/account'
import { observer } from 'mobx-react-lite'
import { AppStore } from '@/core/store'
import { AccountStatusCircle } from '../common/account-status-circle'
import { VerifiedBadge } from '../common/verified-badge'

export const AccountInfo = observer((props: { account: Account; pictureSize?: number }) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const { account, pictureSize = 60 } = props

  return (
    <div className="d-flex align-items-center gap-3">
      <div className='position-relative'>
        <Image
          alt="account picture"
          src={account?.picture}
          height={pictureSize}
          width={pictureSize}
          style={{ borderRadius: '50%' }}
        />
        <AccountStatusCircle accountId={account.id} />
        <div className='verified-badge-container'><VerifiedBadge verified={account.verified} /></div>
      </div>

      <div className="d-flex flex-column overflow-hidden">
        <span className="account-info-name">{generateNameForAccount(account)}</span>
        {!account?.reviews?.length && !account?.reviewsAverage ? (
          <span className="secondary-color one-line-only" title={t(
            AppStore.accountData?.id === account?.id
              ? 'info.you_dont_have_any_reviews'
              : 'profile.reviews.no_reviews_for_account'
          )}>
            {t(
              AppStore.accountData?.id === account?.id
                ? 'info.you_dont_have_any_reviews'
                : 'profile.reviews.no_reviews_for_account'
            )}
          </span>
        ) : (
          <div className="d-flex align-items-center gap-2">
            <div className="d-flex align-items-center" style={{ marginBottom: 3 }}>
              <Icon type="generic/star-filled" size={20} color="#FFC107" />
            </div>
            <span className="secondary-color">
              {account.reviewsAverage?.toFixed(2) ??
                computeReviewsAverage(account.reviews || []).toFixed(2)}{' '}
              (
              {account.reviewsCount
                ? account.reviewsCount
                : account.reviews?.length
                  ? account.reviews?.length
                  : 10}
              )
            </span>
          </div>
        )}
      </div>
    </div>
  )
})
