import { useTranslation } from '@/app/i18n/client'
import { Icon } from '@/components/common/icon'
import { IconButton } from '@/components/common/icon-button'
import { Auction } from '@/core/domain/auction'
import { AppStore } from '@/core/store'
import { useClickOutside } from '@/hooks/click-outside'
import useGlobalContext from '@/hooks/use-context'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import { useRef, useState } from 'react'

export const AuctionDetailsMoreActions = observer((props: {
  auction: Auction
  handleRemove: () => void
}) => {
  const { auction } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const currentAccountIsAuctionOwner = AppStore.accountData?.id === auction.auctioneer?.id

  const actionsMenuRef = useRef<HTMLDivElement>(null)
  const [menuOpened, setMenuOpened] = useState(false)
  const menuButtonRef = useRef<HTMLDivElement>(null)

  useClickOutside(
    actionsMenuRef,
    () => {
      if (menuOpened) {
        setMenuOpened(false)
      }
    },
    [menuOpened],
    [menuButtonRef]
  )

  const handleRemove = () => {
    setMenuOpened(false)
    props.handleRemove()
  }

  if (!currentAccountIsAuctionOwner) {
    return null
  }

  const now = new Date()
  const auctionIsClosed = (auction.expiresAt ?? now) < new Date()

  return (
    <div className={`${menuOpened ? 'button-menu-show-element' : ''}`} ref={menuButtonRef}>
      <IconButton
        noMargin
        icon="generic/more"
        onClick={(ev) => {
          ev?.preventDefault()
          ev?.stopPropagation()
          setMenuOpened(!menuOpened)
        }}
      />
      <div
        className="align-items-center justify-content-end button-menu-content"
        ref={actionsMenuRef}
      >
        <div className="d-flex flex-column align-items-center">
          {!auctionIsClosed && (
            <Link href={`/auction-update/${auction.id}`} className="button-menu-content-item">
              <button
                className="d-flex align-items-center gap-2"
                aria-label={t('auction_details.update.update')}
              >
                <Icon type="header/edit" />
                <span>{t('auction_details.update.update')}</span>
              </button>
            </Link>)}
          <button
            className="d-flex align-items-center gap-2 button-menu-content-item"
            onClick={handleRemove}
            aria-label={t('generic.remove')}
          >
            <Icon type="generic/trash" />
            <span>{t('generic.remove')}</span>
          </button>
        </div>
      </div>
    </div>
  )
})