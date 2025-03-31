import { AccountStatusCircle } from '@/components/common/account-status-circle'
import { VerifiedBadge } from '@/components/common/verified-badge'
import { Account } from '@/core/domain/account'
import { generateNameForAccount } from '@/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export const GlobalSearchAccountItem = (props: { account: Account; onClick?: () => void }) => {
  const { account } = props
  const router = useRouter()

  const handleClick = () => {
    if (props.onClick) {
      props.onClick()
    }

    router.push(`/account/${account.id}`)
  }

  const renderAccount = () => {
    return (
      <>
        <div className="global-search-item-root gap-2">
          <div className='position-relative'>
            <Image
              src={account.picture}
              alt={'account image'}
              height={40}
              width={40}
              style={{ borderRadius: '50%' }}
            />
            <AccountStatusCircle accountId={account.id} />
            <div className='verified-badge-container'><VerifiedBadge verified={account.verified} size={20} /></div>
          </div>
          <span className="account-name">{generateNameForAccount(account)}</span>
        </div>
        <style jsx>{`
          .account-name {
            color: var(--font_1);
          }
        `}</style>
      </>
    )
  }

  if (props.onClick) {
    return <div onClick={handleClick}>{renderAccount()}</div>
  }

  return <Link href={`/account/${account.id}`}>{renderAccount()}</Link>
}
