'use client'
import React, { useEffect, useState } from 'react'
import { useTranslation } from '@/app/i18n/client'
import useGlobalContext from '@/hooks/use-context'
import { useClickOutside } from '@/hooks/click-outside'
import { ELEMENT_IDS } from '@/constants/ids'
import { AppStore } from '@/core/store'
import { IconButton } from '../common/icon-button'
import { YouNeedToLogin } from '../common/you-need-to-login'
import { observer } from 'mobx-react-lite'
import { FavouritesMenuList } from './favourites/list'

export const FavouritesButton = observer(() => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const currentAccount = AppStore.accountData ?? undefined
  const favouritesCount = AppStore.favouriteAuctions.length

  const [favouritesVisible, setFavouritesVisible] = useState(false)
  const favouritesMenuRef = React.useRef<HTMLDivElement>(null)
  const buttonRef = React.useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 50, right: 0 })
  const [initialised, setInitialised] = useState(false)

  useEffect(() => {
    if (!initialised) {
      setInitialised(true)
    }
  }, [])

  useClickOutside(
    favouritesMenuRef,
    () => {
      if (favouritesVisible) {
        setFavouritesVisible(false)
      }
    },
    [favouritesVisible],
    [buttonRef]
  )

  const handleShowFavourites = () => {
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
    const windowWidthIsSmallerThanDetails = availableWidth < 500
    if (windowWidthIsSmallerThanDetails) {
      const rightSpace = window.innerWidth - rect.right
      const overflowAmount = 500 - rightSpace + (window.innerWidth < 412 ? -90 : 45)
      newPos.right -= overflowAmount ? overflowAmount : 0
    }

    setPosition(newPos)
    setFavouritesVisible(!favouritesVisible)
  }

  return (
    <div className={`pos-rel ${favouritesVisible ? 'show-element' : ''}`}>
      <div ref={buttonRef}>
        <IconButton
          noMargin
          icon="header/heart"
          title={t('bottom_nav.favourites')}
          aria-label={t('bottom_nav.favourites')}
          onClick={handleShowFavourites}
          countInfo={favouritesCount}
          style={{
            paddingTop: 2,
          }}
          id={ELEMENT_IDS.FAVOURITES_HEADER_BTN}
        />
      </div>
      {initialised && (
        <div
          className="favourites-details"
          ref={favouritesMenuRef}
          style={{
            maxWidth: !currentAccount ? '350px' : `${window.innerWidth - 30}px`,
          }}
        >
          {!currentAccount ? (
            <div className="p-16">
              <YouNeedToLogin message={t('anonymous.login_for_favourites')} />
            </div>
          ) : (
            <FavouritesMenuList />
          )}
          <div
            className="transparent-overlay overlay-open"
            onClick={() => {
              setFavouritesVisible(!favouritesVisible)
            }}
          ></div>
        </div>
      )}

      <style jsx>{`
        .favourites-details {
          background: var(--background_1);
          border: 1px solid var(--separator);
          padding: 0;
          min-width: 120px;
          border-radius: 6px;
          position: absolute;
          right: ${position.right}px;
          top: 50px;
          z-index: 99999;
          box-shadow: 5px 30px 20px rgba(37, 52, 103, 0.11);
          display: none;
          width: 500px;
          max-height: 750px;
          overflow-y: auto;
        }
        .show-element .favourites-details {
          display: block !important;
        }
      `}</style>
    </div>
  )
})
