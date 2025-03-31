'use client'
import React, { useState } from 'react'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'
import { debounce } from 'lodash'
import { toast } from 'react-toastify'
import { ELEMENT_IDS } from '@/constants/ids'
import dynamic from 'next/dynamic'
import { useClickOutside } from '@/hooks/click-outside'
import { Account } from '@/core/domain/account'
import { Icon } from '../../common/icon'
import { CustomInput } from '../../common/custom-input'
import { observer } from 'mobx-react-lite'
import { SearchController } from '@/core/controllers/search'
import { Auction } from '@/core/domain/auction'
import { AppStore } from '@/core/store'

const GlobalSearchInputMenu = dynamic(() => import('./input-menu'), { ssr: false })

export interface SearchResult {
  accounts: Account[]
  auctions: Auction[]
}

export const GlobalSearchInput = observer(() => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const [searchMenuOpened, setSearchMenuOpened] = useState(false)
  const searchMenuRef = React.useRef<HTMLDivElement>(null)
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  const [searchValue, setSearchValue] = useState('' as string)
  const [searchInProgress, setSearchInProgress] = useState(false)
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)

  useClickOutside(
    searchMenuRef,
    () => {
      if (searchMenuOpened) {
        setSearchMenuOpened(false)
      }
    },
    [searchMenuOpened],
    [searchInputRef]
  )

  const handleValueChange = async (newValue: string) => {
    setSearchValue(newValue)
    if (newValue.length === 0) {
      setSearchResult(null)
    }

    if (newValue.length < 3) {
      return
    }

    try {
      setSearchInProgress(true)
      const result = await SearchController.triggerGlobalSearch(newValue)
      setSearchResult(result)
    } catch (err) {
      console.error(`Failed to search: ${err}`)
      toast.error(t('generic.could_not_search'))
    } finally {
      setSearchInProgress(false)
    }
  }

  const debounceHandleSearch = debounce(handleValueChange, 700)

  return (
    <div className="w-100">
      <div className="d-flex h-100 w-100 justify-center justify-content-center align-items-center">
        <div className="w-100 max-width p-0">
          <div className={`pos-rel w-100 `} id={ELEMENT_IDS.GLOBAL_SEARCH_INPUT}>
            <div className="search-icon-root">
              <Icon type="generic/search" />
            </div>
            <div className="d-flex">
              <div className={`pos-rel w-100 ${searchMenuOpened ? 'show-element' : ''}`}>
                <CustomInput
                  type="text"
                  value={searchValue}
                  onChange={debounceHandleSearch}
                  placeholder={t('home.search.search')}
                  inputAttrs={{
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    ref: searchInputRef,
                    onFocus: () => setSearchMenuOpened(true),
                  }}
                  isLoading={searchInProgress}
                  style={{
                    zIndex: 9999,
                    height: 50,
                    borderRadius: '8px',
                    background: 'var(--background_4)',
                    borderColor: 'transparent',
                  }}
                />
                <div className="global-search-menu" ref={searchMenuRef}>
                  <div className="position-relative" style={{ zIndex: 9999 }}>
                    <GlobalSearchInputMenu
                      historyItems={AppStore.searchHistoryItems}
                      searchResult={searchResult as SearchResult}
                      searchKey={searchValue}
                    />
                  </div>
                  <div
                    className="transparent-overlay overlay-open global-search-overlay"
                    onClick={() => {
                      setSearchMenuOpened(!searchMenuOpened)
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
