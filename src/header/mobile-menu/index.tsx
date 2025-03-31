'use client'
import React, { useRef } from 'react'
import Link from 'next/link'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'
import { Icon } from '../../common/icon'
import { observer } from 'mobx-react-lite'
import { AppStore } from '@/core/store'
import Image from 'next/image'
import { generateNameForAccount } from '@/utils'
import { CreateAuctionButton } from '../../common/create-auction-button'
import { AppLogo } from '../../common/app-logo'
import { useRouter } from 'next/navigation'
import { AuthController } from '@/core/controllers/auth'
import { AnonymousMobileMenu } from './anonymous'
import { useClickOutside } from '@/hooks/click-outside'
import { dir } from 'i18next'

export const MobileMenu = observer(
  (props: { opened: boolean; handleClose: () => void; handleBuyCoins: () => void }) => {
    const { opened, handleClose, handleBuyCoins } = props
    const globalContext = useGlobalContext()
    const currentLanguage = globalContext.currentLanguage
    const { t } = useTranslation(currentLanguage)
    const direction = dir(currentLanguage)

    const router = useRouter()
    const account = AppStore.accountData
    const auctionsCount = AppStore.accountStats.allAuctionsCount
    const bidsCount = AppStore.accountStats.allBidsCount
    const favouritesCount = AppStore.favouriteAuctions.length

    const mobileMenuRef = useRef<HTMLDivElement>(null)
    useClickOutside(mobileMenuRef, () => {
      if (opened) {
        handleClose()
      }
    })

    const computeUnreadMessagesCount = () => {
      return Object.values(AppStore.chatGroups).reduce(
        (acc, val) => acc + (val.unreadMessages ?? 0),
        0
      )
    }
    const unreadMessages = computeUnreadMessagesCount()

    const handleLogout = () => {
      handleClose()
      AuthController.logout()
      router.replace('/auth/login')
    }

    return (
      <>
        <div className={opened ? 'side-info info-open' : 'side-info'} ref={mobileMenuRef}>
          {!account?.id ? (
            <AnonymousMobileMenu handleClose={handleClose} />
          ) : (
            <>
              <div className="side-info-content">
                <div className="mb-40">
                  <div className="row align-items-center">
                    <div className="col-9">
                      <AppLogo />
                    </div>
                    <div className={`col-3 ${direction === 'rtl' ? 'text-start' : 'text-end'}`}>
                      <button className="side-info-close" aria-label="close" onClick={handleClose}>
                        <Icon type="generic/close-filled" />
                      </button>
                    </div>
                  </div>
                </div>
                <Link href={`/profile?tab=settings`} onClick={handleClose}>
                  <div className="mb-10 mobile-menu-item">
                    <div className="d-flex align-items-center account-menu-header">
                      <div className="d-flex align-items-center gap-2">
                        <Image
                          width={60}
                          height={60}
                          src={account?.picture || ''}
                          alt="profile-img"
                          style={{ borderRadius: '50%' }}
                        />

                        <div className="d-flex align-items-center justify-content-between account-menu-header-name">
                          <div className="d-flex flex-column align-items-start justify-content-center overflow-hidden">
                            <span className="account-name">{generateNameForAccount(account!)}</span>
                            <span className="account-email">{account?.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="buy-coins-account-menu-item mobile-menu-item mb-10">
                  <div
                    className="d-flex align-items-start flex-column p-16"
                    onClick={handleBuyCoins}
                  >
                    <div className="d-flex align-items-start justify-content-start gap-2 w-100">
                      <Icon type="generic/coin" size={30} />
                      <span className="fw-bold">
                        {t('buy_coins.coins_no', {
                          no: AppStore.accountData?.coins ?? 0,
                        })}
                      </span>
                    </div>
                    <span className="fw-light">{t('info.buy_coins_description')}</span>
                  </div>
                </div>

                <Link href="/profile?tab=auctions" onClick={handleClose}>
                  <div className="mb-10 mobile-menu-item justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <Icon type="header/auction" />
                      <span>
                        {t('header.my_auctions')} ({auctionsCount})
                      </span>
                    </div>
                    <Icon type={direction === 'rtl' ? 'arrows/arrow-left-filled' : 'arrows/arrow-right-filled'} />
                  </div>
                </Link>
                <Link href="/profile?tab=bids" onClick={handleClose}>
                  <div className="mb-10 mobile-menu-item justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <Icon type="header/bid" />
                      <span>
                        {t('header.my_bids')} ({bidsCount})
                      </span>
                    </div>
                    <Icon type={direction === 'rtl' ? 'arrows/arrow-left-filled' : 'arrows/arrow-right-filled'} />
                  </div>
                </Link>
                <Link href="/profile?tab=chat" onClick={handleClose}>
                  <div className="mb-10 mobile-menu-item justify-content-between pos-rel">
                    <div className="d-flex align-items-center gap-2">
                      <Icon type="header/chat" />
                      <span>{t('chat.chat')}</span>
                      {!!unreadMessages && (
                        <span className="relative-icon-button-count">{unreadMessages}</span>
                      )}
                    </div>
                    <Icon type={direction === 'rtl' ? 'arrows/arrow-left-filled' : 'arrows/arrow-right-filled'} />
                  </div>
                </Link>

                <Link href="/profile?tab=favourites" onClick={handleClose}>
                  <div className="mb-10 mobile-menu-item justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <Icon type="header/heart" />
                      <span>
                        {t('bottom_nav.favourites')} ({favouritesCount})
                      </span>
                    </div>
                    <Icon type={direction === 'rtl' ? 'arrows/arrow-left-filled' : 'arrows/arrow-right-filled'} />
                  </div>
                </Link>

                <CreateAuctionButton fullWidth handleClick={handleClose} />
              </div>
              <div className="mb-30 mt-20">
                <button
                  className="border-btn w-100"
                  onClick={handleLogout}
                  aria-label={t('profile.sign_out')}
                >
                  {t('profile.sign_out')}
                </button>
              </div>
            </>
          )}
        </div>
        <div className="offcanvas-overlay"></div>
        <div className="offcanvas-overlay-white"></div>

        <style jsx>{`
          .buy-coins-account-menu-item {
            background: var(--background_4);
            border-radius: 6px;
          }
          .buy-coins-account-menu-item:hover {
            background: var(--background_2);
          }
        `}</style>
      </>
    )
  }
)
