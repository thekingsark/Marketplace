'use client'
import { useState } from 'react'
import React from 'react'
import { AppLogo } from '../common/app-logo'
import { CreateAuctionButton } from '../common/create-auction-button'
import { HeaderAccountButton } from './account-button'
import { ChatButton } from './chat-button'
import { FavouritesButton } from './favourites-button'
import { NotificationsButton } from './notifications-button'
import { MobileMenu } from './mobile-menu'
import { GlobalSearchInput } from './global-search-input'
import { BuyCoinsModal } from '../modals/buy-coins'
import { useHeaderScrollDirection } from '@/hooks/header-scroll-direction'

export const Header = () => {
  const { isVisible, isFixed } = useHeaderScrollDirection()
  const [mobileMenuOpened, setMobileMenuOpened] = useState(false)
  const [buyCoinsModalOpened, setBuyCoinsModalOpened] = useState(false)

  const toggleMobileMenu = () => {
    if (!mobileMenuOpened) {
      document.body.classList.add('no-scroll')
    } else {
      document.body.classList.remove('no-scroll')
    }

    setMobileMenuOpened(!mobileMenuOpened)
  }

  const toggleBuyCoinsModal = (sessionUrl?: string) => {
    setMobileMenuOpened(false)
    document.body.classList.remove('no-scroll')
    setBuyCoinsModalOpened(!buyCoinsModalOpened)
    if (sessionUrl && typeof sessionUrl === 'string') {
      window.open(sessionUrl, '_blank')
    }
  }

  return (
    <>
      <header>
        <div id="header-sticky" className={`${isFixed ? (isVisible ? 'visible' : 'hidden') : ''}`}>
          <div className="header-root p-0 m-0 d-flex flex-column">
            <div className="align-items-center w-100">
              <div className="col-xl-6 col-lg-7 col-md-10 col-sm-10 col-8">
                <div className="header-main-left gap-4">
                  <AppLogo />
                  <div className="w-100 d-none d-sm-flex mr-10 ml-10">
                    <GlobalSearchInput />
                  </div>
                </div>
              </div>

              <div className="col-xl-6 col-lg-5 col-md-2 col-sm-2 col-4">
                <div className="d-flex align-items-center header-content d-none d-xl-flex">
                  <div className="d-flex align-items-center">
                    <div className="d-flex align-items-center gap-4">
                      <div className={`d-flex menu-action-buttons gap-3`}>
                        <ChatButton />
                        <FavouritesButton />
                        <NotificationsButton />
                      </div>
                      <div className="ml-20 mr-20">
                        <HeaderAccountButton handleBuyCoins={() => toggleBuyCoinsModal()} />
                      </div>
                    </div>
                    <CreateAuctionButton />
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-end gap-4">
                  <div className="d-block d-xl-none">
                    <NotificationsButton />
                  </div>

                  <div className="menu-bar d-block d-xl-none d-flex align-items-center">
                    <button aria-label="Side menu toggle" onClick={toggleMobileMenu}>
                      <div className="bar-icon">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </button>
                  </div>
                </div>
                <MobileMenu
                  opened={mobileMenuOpened}
                  handleClose={toggleMobileMenu}
                  handleBuyCoins={() => toggleBuyCoinsModal()}
                />
              </div>
            </div>

            <div className="d-block d-sm-none w-100 mt-20">
              <GlobalSearchInput />
            </div>
          </div>
        </div>
      </header>
      <BuyCoinsModal isOpened={buyCoinsModalOpened} close={toggleBuyCoinsModal} />
    </>
  )
}
