import { useTranslation } from '@/app/i18n/client'
import { AppStore } from '@/core/store'
import { useClickOutside } from '@/hooks/click-outside'
import useGlobalContext from '@/hooks/use-context'
import { dir } from 'i18next'
import { observer } from 'mobx-react-lite'
import { useEffect, useRef, useState } from 'react'
import { Icon } from '../common/icon'
import { AccountController } from '@/core/controllers/account'
import { useScreenIsBig } from '@/hooks/use-screen-is-big'

const MENU_WIDTH = 300

export const ChangeCurrencyButton = observer(() => {
  const globalContext = useGlobalContext()
  const { currentLanguage, appCurrencies, appSettings } = globalContext
  const { t } = useTranslation(currentLanguage)

  const direction = dir(currentLanguage)

  const [dropdownOpened, setDropdownOpened] = useState(false)
  const [initialised, setInitialised] = useState(false)
  const [currentCurrencyId, setCurrentCurrencyId] = useState(
    AppStore.accountData?.selectedCurrencyId ?? appSettings.defaultCurrencyId
  )
  const [search, setSearch] = useState('')
  const buttonRef = useRef<HTMLButtonElement>(null)
  const languagesMenuRef = useRef<HTMLDivElement>(null)

  const screenIsBig = useScreenIsBig()

  useEffect(() => {
    setCurrentCurrencyId(AppStore.accountData?.selectedCurrencyId ?? appSettings.defaultCurrencyId)
  }, [AppStore.accountData?.selectedCurrencyId, appSettings.defaultCurrencyId])

  useEffect(() => {
    if (!initialised) {
      setInitialised(true)
    }
  }, [])

  useClickOutside(
    languagesMenuRef,
    () => {
      if (dropdownOpened) {
        setDropdownOpened(false)
      }
    },
    [dropdownOpened],
    [buttonRef]
  )

  const toggleDropdown = () => {
    setDropdownOpened(!dropdownOpened)
  }

  const handleCurrencyChange = (currencyId: string) => {
    setCurrentCurrencyId(currencyId)
    AccountController.updateAccountCurrency(currencyId)
    setDropdownOpened(false)
  }

  const currencyToDisplay = appCurrencies.find((c) => c.id === currentCurrencyId)
  if (!currencyToDisplay) {
    return null
  }

  return (
    <>
      <div className={`pos-rel d-inline-flex ${dropdownOpened ? 'show-element' : ''}`}>
        <button ref={buttonRef} className="btn border-btn footer-btn" onClick={toggleDropdown}>
          <div className="d-flex align-items-center gap-2">
            <Icon type="profile/bitcoin" size={24} />
            <span>{currencyToDisplay!.name[currentLanguage]}</span>
            <span className="fw-bold">{`(${currencyToDisplay!.symbol})`}</span>
          </div>
        </button>
        {initialised && (
          <div className="dropdown-details gap-2" ref={languagesMenuRef}>
            <input
              name="profile-name"
              className="create-auction-input create-auction-no-icon-input"
              id="profile-name"
              value={search}
              maxLength={100}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('generic.search')}
            />
            <div className="dropdown-details-content">
              {appCurrencies
                .filter(
                  (c) =>
                    c.name[currentLanguage].toLowerCase().includes(search.toLowerCase()) ||
                    c.code.toLowerCase().includes(search.toLowerCase())
                )
                .map((c, i) => {
                  return (
                    <button key={i} className="w-100" onClick={() => handleCurrencyChange(c.id)}>
                      <div className="language-item w-100">
                        <span className="">
                          <div className="d-flex align-items-center gap-2">
                            <span>{c.name[currentLanguage]}</span>
                            <span className="fw-bold">{`(${c!.symbol})`}</span>
                          </div>
                        </span>
                      </div>
                    </button>
                  )
                })}
              <div className="transparent-overlay overlay-open" onClick={toggleDropdown}></div>
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        .dropdown-details {
          padding: 16px;
          background: var(--background_1);
          min-width: 120px;
          border-radius: 6px;
          position: absolute;
          ${direction === 'rtl' ? `left: -${MENU_WIDTH + (screenIsBig ? 0 : -150) + 4}px;` : `right: -${MENU_WIDTH + (screenIsBig ? 0 : -150) + 4}px;`}
          bottom: 0;
          z-index: 99999;
          box-shadow: 5px 30px 20px rgba(37, 52, 103, 0.11);
          border: 1px solid var(--separator);
          display: none;
          flex-direction: column;
          width: ${MENU_WIDTH}px;
        }
        .dropdown-details-content {
          max-height: 750px;
          overflow-y: auto;
          flex-direction: column;
        }
        .language-item {
          padding: 8px;
          border-radius: 6px;
        }
        .language-item:hover {
          background-color: var(--background_2);
        }
        .show-element .dropdown-details {
          display: flex !important;
        }
      `}</style>
    </>
  )
})
