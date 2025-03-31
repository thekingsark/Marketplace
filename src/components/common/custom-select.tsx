import React, { useState, useCallback, useRef, KeyboardEvent, MouseEvent, useEffect } from 'react'
import { useClickAway } from 'react-use'
import { Icon } from './icon'
import removeAccents from 'remove-accents'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'

export interface CustomSelectOption {
  id: number | string
  option: string
  icon?: React.ReactNode
  sufix?: React.ReactNode
}

interface CustomSelectProps {
  options: CustomSelectOption[]
  defaultCurrent: number
  placeholder?: string
  className?: string
  itemClassName?: string
  withSearch?: boolean
  searchPlaceholder?: string
  customStyle?: React.CSSProperties
  onChange: (item: CustomSelectOption, name: string) => void
  name: string
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  defaultCurrent,
  placeholder,
  searchPlaceholder,
  className,
  itemClassName,
  withSearch,
  customStyle = {},
  onChange,
  name,
}) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState<CustomSelectOption>(options[defaultCurrent])
  const onClose = useCallback(() => {
    setOpen(false)
  }, [])

  const [searchKey, setSearchKey] = useState<string>('')
  const [filteredOptions, setFilteredOptions] = useState<CustomSelectOption[]>(options)

  useEffect(() => {
    setCurrent(options[defaultCurrent])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options])

  useEffect(() => {
    setFilteredOptions(options)
  }, [options])

  useEffect(() => {
    if (!searchKey) {
      setFilteredOptions(options)
    } else {
      setFilteredOptions(
        options.filter((item) =>
          removeAccents(item.option).toLowerCase().includes(removeAccents(searchKey).toLowerCase())
        )
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey])

  const ref = useRef<HTMLDivElement>(null)
  useClickAway(ref, onClose)

  const currentHandler = (item: CustomSelectOption) => {
    setCurrent(item)
    onChange(item, name)
    onClose()
    setSearchKey('')
  }

  const handleClick = () => {
    setOpen((prev) => !prev)
  }

  const handleClear = () => {
    setSearchKey('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      setOpen((prev) => !prev)
    }
  }

  const stopPropagation = (e: MouseEvent | KeyboardEvent) => {
    e.stopPropagation()
  }

  return (
    <div
      className={`nice-select ${className || ''} ${open ? 'open' : ''}`}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      ref={ref}
      style={customStyle}
    >
      <div className="current d-flex align-items-center gap-2 align-items-center">
        {current?.icon}
        <span>{current?.option || placeholder}</span>
      </div>
      <ul
        className="list"
        role="menubar"
        onClick={stopPropagation}
        onKeyDown={stopPropagation}
        onKeyUp={stopPropagation}
      >
        {withSearch && (
          <div className="w-100 p-16">
            <div className="pos-rel">
              <input
                className="w-100 nice-select-search-input"
                placeholder={searchPlaceholder ?? 'Search...'}
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
              />
              {searchKey.length ? (
                <div className="clear-search-icon" onClick={handleClear}>
                  <Icon type="generic/close-filled" size={18} />
                </div>
              ) : null}
            </div>

            {!!searchKey.length && !!options.length && !filteredOptions.length && (
              <div className="pt-1 d-flex align-items-center justify-content-center">
                {t('home.filter.no_data_found')}
              </div>
            )}
          </div>
        )}
        {filteredOptions?.map((item) => (
          <li
            key={item.id}
            data-value={item.id}
            className={`option d-flex align-items-center ${itemClassName ?? ''} ${item.id === current?.id ? 'selected focus' : ''
              }`}
            role="menuitem"
            onClick={() => currentHandler(item)}
            onKeyPress={(e: KeyboardEvent<HTMLLIElement>) => {
              stopPropagation(e)
            }}
            aria-label={item.option}
          >
            <div className="w-100 d-flex align-content-center justify-content-between">
              <div className="d-flex align-items-center option-title-root gap-2">
                {item.icon}
                <span className="option-title">{item.option}</span>
              </div>
              {item.sufix}
            </div>
          </li>
        ))}
      </ul>
      <style jsx>{`
        .clear-search-icon {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  )
}

export default CustomSelect
