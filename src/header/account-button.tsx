'use client'
import { useTranslation } from '@/app/i18n/client'
import { useClickOutside } from '@/hooks/click-outside'
import useGlobalContext from '@/hooks/use-context'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { generateNameForAccount } from '@/utils'
import { useRouter } from 'next/navigation'
import { AuthController } from '@/core/controllers/auth'
import { AppStore } from '@/core/store'
import { ELEMENT_IDS } from '@/constants/ids'
import { Icon } from '../common/icon'
import { observer } from 'mobx-react-lite'
import { VerifiedBadge } from '../common/verified-badge'

export const HeaderAccountButton = observer((props: { handleBuyCoins: () => void }) => {
  const { handleBuyCoins } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const router = useRouter()
  const [menuVisible, setMenuVisible] = useState(false)

  const chatMenuRef = React.useRef<HTMLDivElement>(null)
  const buttonRef = React.useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 50, right: 0 })

  const [logoutInProgress, setLogoutInProgress] = useState(false)

  const account = AppStore.accountData
  const auctionsCount = AppStore.accountStats.allAuctionsCount
  const bidsCount = AppStore.accountStats.allBidsCount

  useClickOutside(
    chatMenuRef,
    () => {
      if (menuVisible) {
        setMenuVisible(false)
      }
    },
    [menuVisible],
    [buttonRef]
  )

  const handleShowMenu = () => {
    const rect = buttonRef.current?.getBoundingClientRect()
    if (!rect) {
      return
    }
    const newPos = {
      top: 50,
      right: 0,
    }

    if (rect.bottom + 500 > window.innerHeight) {
      newPos.top -= rect.bottom + 500 - window.innerHeight
      newPos.top -= 45
    }

    const availableWidth = window.innerWidth - (window.innerWidth - (rect.width + rect.left))
    const windowWidthIsSmallerThanDetails = availableWidth < 430
    if (windowWidthIsSmallerThanDetails) {
      newPos.right -= 0
    }

    setPosition(newPos)
    setMenuVisible(!menuVisible)
  }

  const handleLogout = async () => {
    if (logoutInProgress) {
      return
    }

    setLogoutInProgress(true)
    await AuthController.logout()
    setLogoutInProgress(false)

    router.push('/auth/login')
  }

  const toggleBuyCoinsModal = () => {
    setMenuVisible(false)
    handleBuyCoins()
  }

  if (!account) {
    return (
      <div>
        <Link href="/auth/login">
          <button className="btn border-btn profile-btn" aria-label={t('header.profile')}>
            <div className="placeholder-icon">
              <Icon type={'header/profile'} size={24} />
            </div>
            {t('header.profile')}
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className={`pos-rel  cursor-pointer ${menuVisible ? 'show-element' : ''}`}>
      <div ref={buttonRef} onClick={handleShowMenu} id={ELEMENT_IDS.ACCOUNT_HEADER_BTN}>
        <button className="border-btn profile-btn" aria-label={t('header.profile')}>
          <Image
            width={30}
            height={30}
            src={account?.picture || ''}
            alt="profile-img"
            style={{ borderRadius: '50%' }}
          />
          {t('header.profile')}
        </button>
      </div>

      <div className="profile-menu" ref={chatMenuRef}>
        <div className="position-relative" style={{ zIndex: 9999 }}>
          <div className="profile-settings-root">
            <Link href="/profile">
              <div className="d-flex align-items-center account-menu-header">
                <div className="d-flex align-items-center gap-2">
                  <div className='position-relative'>
                    <Image
                      width={60}
                      height={60}
                      src={account?.picture || ''}
                      alt="profile-img"
                      style={{ borderRadius: '50%' }}
                    />
                    <div className='verified-badge-container'><VerifiedBadge verified={AppStore.accountData!.verified} /></div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between account-menu-header-name">
                    <div className="d-flex flex-column align-items-start justify-content-center overflow-hidden">
                      <span className="account-name">{generateNameForAccount(account)}</span>
                      <span className="account-email">{account?.email}</span>
                    </div>

                    <div className="ml-10">
                      <Icon type="header/edit" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
          <ul style={{ borderBottom: '1px solid var(--separator)' }}>
            <li className="account-menu-item buy-coins-account-menu-item">
              <div
                className="d-flex align-items-start flex-column p-16"
                onClick={toggleBuyCoinsModal}
              >
                <div className="d-flex align-items-start justify-content-start gap-2 w-100">
                  <Icon type="generic/coin" size={30} />
                  <span className="fw-bold">
                    {t('buy_coins.coins_no', { no: AppStore.accountData?.coins ?? 0 })}
                  </span>
                </div>
                <span className="fw-light">{t('info.buy_coins_description')}</span>
              </div>
            </li>
          </ul>
          <ul style={{ borderBottom: '1px solid var(--separator)' }}>
            <li className="account-menu-item">
              <Link href={`/profile?tab=auctions`} className="w-100 account-menu-link d-flex">
                <div className="d-flex align-items-center gap-2">
                  <Icon type="header/auction" />
                  <span>
                    {t('header.my_auctions')} ({auctionsCount})
                  </span>
                </div>
              </Link>
            </li>
            <li className="account-menu-item">
              <Link href={`/profile?tab=bids`} className="w-100 account-menu-link">
                <div className="d-flex align-items-center gap-2">
                  <Icon type="header/bid" />
                  <span>
                    {t('header.my_bids')} ({bidsCount})
                  </span>
                </div>
              </Link>
            </li>
          </ul>
          <ul>
            <li
              className="account-menu-item account-menu-link"
              onClick={() => {
                handleLogout()
              }}
            >
              <span>
                <div className="d-flex align-items-center gap-2">
                  <div className="logout-icon d-flex align-items-center">
                    <Icon type="header/logout" />
                  </div>
                  <span>{t('profile.sign_out')}</span>
                </div>
              </span>
            </li>
          </ul>
        </div>
        <div
          className="transparent-overlay overlay-open"
          onClick={() => {
            setMenuVisible(!menuVisible)
          }}
        ></div>
      </div>

      <style jsx>{`
        .profile-wrapper {
          padding: 1px;
          background: var(--separator);
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .profile-wrapper:hover {
          transform: scale(1.03);
        }
        .profile-menu {
          background: var(--background_1);
          padding: 0;
          border-radius: 6px;
          position: absolute;
          right: ${position.right}px;
          top: 50px;
          z-index: 99999;
          box-shadow: 10px 30px 20px rgba(37, 52, 103, 0.11);
          display: none;
          width: 430px;
          max-width: ${window.innerWidth - 30}px;
          border: 1px solid var(--separator);
          overflow: hidden;
        }
        .show-element .profile-menu {
          display: block;
        }
        .profile-menu ul {
          padding: 16px;
        }
        .account-menu-header {
          width: 100%;
          border-radius: 6px;
        }
        .profile-settings-root {
          padding: 16px;
          border-bottom: 1px solid var(--separator);
        }
        .account-menu-header > div {
          width: 100%;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
        }
        .account-menu-header > div:hover {
          border-radius: 6px;
          background: var(--background_2);
        }
        .account-menu-header-name {
          flex: 1;
          overflow: hidden;
        }
        .account-name,
        .account-email {
          line-height: 1.2;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 100%;
        }
        .account-name {
          font-size: 16px;
          color: var(--font_1);
        }
        .account-menu-item {
          align-items: center;
          height: 50px;
          // padding: 8px 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        :global(.account-menu-link) {
          padding: 8px 24px;
        }
        .account-menu-item:hover {
          border-radius: 6px;
          background: var(--background_2);
        }
        .logout-icon {
          margin-left: 3px;
        }
        .buy-coins-account-menu-item {
          background: var(--background_4);
          border-radius: 6px;
          height: auto;
        }
      `}</style>
    </div>
  )
})
