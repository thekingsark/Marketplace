'use client'

import { languages } from '@/app/i18n/settings'
import useGlobalContext from '@/hooks/use-context'
import { useEffect, useRef, useState } from 'react'
import { useClickOutside } from '@/hooks/click-outside'
import { LANGUAGES_META } from '@/constants/languages'
import { Icon } from '../common/icon'
import { useRouter } from 'next/navigation'
import { dir } from 'i18next'

const MENU_WIDTH = 300

export const ChangeLanguageButton = () => {
  const context = useGlobalContext()
  const lang = context.currentLanguage
  const direction = dir(lang)

  const [dropdownOpened, setDropdownOpened] = useState(false)
  const [initialised, setInitialised] = useState(false)

  const buttonRef = useRef<HTMLButtonElement>(null)
  const languagesMenuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

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

  const setLanguageCookie = (lang: string) => {
    document.cookie = `i18next=${lang};`
  }

  const redirectToNewLanguage = (newLang: string) => {
    if (typeof window === 'undefined') {
      return '/'
    }
    setLanguageCookie(newLang)

    const currentPath = window?.location?.pathname || ''
    const newPath = currentPath.replace(`/${lang}`, `/${newLang}`)
    router.push(`${newPath}?lang=${newLang}`)
  }

  const toggleDropdown = () => {
    setDropdownOpened(!dropdownOpened)
  }

  const currentLanguage = LANGUAGES_META[lang]

  return (
    <>
      <div className={`pos-rel d-inline-flex ${dropdownOpened ? 'show-element' : ''}`}>
        <button ref={buttonRef} className="btn border-btn footer-btn" onClick={toggleDropdown}>
          {!!currentLanguage ? (
            <div className="d-flex align-items-center gap-2">
              <Icon type={currentLanguage.icon} />
              <span>{currentLanguage.name}</span>
            </div>
          ) : (
            lang
          )}
        </button>
        {initialised && (
          <div className="dropdown-details" ref={languagesMenuRef}>
            {languages
              .filter((l) => lang !== l)
              .map((l, i) => {
                const languageMeta = LANGUAGES_META[l]
                return (
                  <button key={i} onClick={() => redirectToNewLanguage(l)} className="w-100">
                    <div className="language-item w-100">
                      <span className="">
                        {!!languageMeta ? (
                          <div className="d-flex align-items-center gap-2">
                            <Icon type={languageMeta.icon} />
                            <span>{languageMeta.name}</span>
                          </div>
                        ) : (
                          l
                        )}
                      </span>
                    </div>
                  </button>
                )
              })}
            <div className="transparent-overlay overlay-open" onClick={toggleDropdown}></div>
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
          ${direction === 'rtl' ? `left: -${MENU_WIDTH + 4}px;` : `right: -${MENU_WIDTH + 4}px;`}
          bottom: 0;
          z-index: 99999;
          box-shadow: 5px 30px 20px rgba(37, 52, 103, 0.11);
          border: 1px solid var(--separator);
          display: none;
          width: ${MENU_WIDTH}px;
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
}
