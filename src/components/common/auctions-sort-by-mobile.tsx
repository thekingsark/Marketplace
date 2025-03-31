import { useTranslation } from '@/app/i18n/client'
import { Icon } from '@/components/common/icon'
import { AuctionsSortBy } from '@/core/repositories/auction'
import { useClickOutside } from '@/hooks/click-outside'
import useGlobalContext from '@/hooks/use-context'
import { memo, useEffect, useRef, useState } from 'react'

interface AuctionsSortByDropdownProps {
  selected: AuctionsSortBy
  handleSelect: (options: AuctionsSortBy) => void
}

export const AuctionsSortByMobileDropdown = memo((props: AuctionsSortByDropdownProps) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const [selectedOption, setSelectedOption] = useState(AuctionsSortBy.newest)

  const sortMenuRef = useRef<HTMLDivElement>(null)
  const [menuOpened, setMenuOpened] = useState(false)
  const menuButtonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSelectedOption(props.selected)
  }, [props.selected])

  useClickOutside(
    sortMenuRef,
    () => {
      if (menuOpened) {
        setMenuOpened(false)
      }
    },
    [menuOpened],
    [menuButtonRef]
  )

  const getIconPathBySelectedOption = (selected: AuctionsSortBy) => {
    switch (selected) {
      case AuctionsSortBy.newest:
        return 'sort/hourglass-top'
      case AuctionsSortBy.oldest:
        return 'sort/hourglass-bottom'
      case AuctionsSortBy.priceAsc:
        return 'sort/sort-ascending'
      case AuctionsSortBy.priceDesc:
        return 'sort/sort-descending'
      default:
        return 'sort/hourglass-top'
    }
  }

  const handleSelect = (option: number) => {
    setMenuOpened(false)
    props.handleSelect(option)
  }

  return (
    <div
      className={`d-block d-lg-none ${menuOpened ? 'button-menu-show-element' : ''}`}
      ref={menuButtonRef}
    >
      <button
        className="secondary-border-btn"
        onClick={(ev) => {
          ev?.preventDefault()
          ev?.stopPropagation()
          setMenuOpened(!menuOpened)
        }}
        style={{ width: 45 }}
        aria-label={'sort'}
      >
        <Icon type={getIconPathBySelectedOption(selectedOption)} />
      </button>
      <div className="align-items-center justify-content-end button-menu-content" ref={sortMenuRef}>
        <div className="d-flex flex-column align-items-center">
          <ul>
            <li
              className="button-menu-content-item d-flex align-items-center gap-2"
              onClick={() => handleSelect(0)}
            >
              <Icon type="sort/hourglass-top" />
              <span>{t('generic.newest')}</span>
            </li>
            <li
              className="button-menu-content-item d-flex align-items-center gap-2"
              onClick={() => handleSelect(1)}
            >
              <Icon type="sort/hourglass-bottom" />
              <span>{t('generic.oldest')}</span>
            </li>
            <li
              className="button-menu-content-item d-flex align-items-center gap-2"
              onClick={() => handleSelect(2)}
            >
              <Icon type="sort/sort-ascending" />
              <span>{t('generic.ascending_price')}</span>
            </li>
            <li
              className="button-menu-content-item d-flex align-items-center gap-2"
              onClick={() => handleSelect(3)}
            >
              <Icon type="sort/sort-descending" />
              <span>{t('generic.descending_price')}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
})

AuctionsSortByMobileDropdown.displayName = 'AuctionsSortByMobileDropdown'
