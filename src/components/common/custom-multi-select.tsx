import React, { useState, useCallback, useRef, KeyboardEvent, MouseEvent, useEffect } from 'react'
import { useClickAway } from 'react-use'
import { Icon } from './icon'
import removeAccents from 'remove-accents'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'

export interface CustomMultiSelectOption {
  id: number | string
  option: string
  icon?: React.ReactNode
  sufix?: React.ReactNode
}

interface CustomMultiSelectProps {
  options: CustomMultiSelectOption[]
  initialSelected: string[]
  allowAll?: boolean
  allSelectedByDefault?: boolean
  allOptionSufix?: React.ReactNode
  placeholder?: string
  className?: string
  withSearch?: boolean
  searchPlaceholder?: string
  onChange: (item: CustomMultiSelectOption, name: string) => void
  name: string
}

export const CustomMultiSelect: React.FC<CustomMultiSelectProps> = ({
  options,
  initialSelected,
  allowAll,
  placeholder,
  allSelectedByDefault,
  allOptionSufix,
  searchPlaceholder,
  className,
  withSearch,
  onChange,
  name,
}) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const ALL_ITEM = {
    id: 'all',
    option: t('home.categories.all'),
  }

  const computeSelectedOptions = () => {
    if (!initialSelected?.length && allSelectedByDefault) {
      return [ALL_ITEM]
    }

    return options.filter((el) => (initialSelected ?? []).includes(el.option))
  }

  const [open, setOpen] = useState(false)
  const [selectedOptions, setSelectedOptions] =
    useState<CustomMultiSelectOption[]>(computeSelectedOptions())

  const onClose = useCallback(() => {
    setOpen(false)
  }, [])

  const [allSelected, setAllSelected] = useState(allSelectedByDefault ?? false)
  const [searchKey, setSearchKey] = useState<string>('')
  const [filteredOptions, setFilteredOptions] = useState<CustomMultiSelectOption[]>(options)

  useEffect(() => {
    setSelectedOptions(computeSelectedOptions())
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

  const currentHandler = (item: CustomMultiSelectOption) => {
    if (item.option === ALL_ITEM.option) {
      setSelectedOptions([ALL_ITEM])
      setAllSelected(true)
      onChange(item, name)
      setSearchKey('')
      return
    }

    setAllSelected(false)
    const itemIsSelected = selectedOptions.find((el) => el.option === item.option)
    let newOptions = []

    if (itemIsSelected) {
      newOptions = selectedOptions.filter((el) => {
        return el.option !== ALL_ITEM.option && el.option !== item.option
      })
    } else {
      newOptions = [...selectedOptions, item].filter((el) => el.option !== ALL_ITEM.option)
    }

    setSelectedOptions(newOptions.length ? newOptions : [ALL_ITEM])

    if (!newOptions.length) {
      setAllSelected(true)
    }

    onChange(item, name)
    // onClose()
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
    >
      <div className="current d-flex align-items-center">
        <span className="selected-value-text">
          {selectedOptions?.map((el) => el.option).join(', ') || placeholder}
        </span>
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

            {!!searchKey.length && !allowAll && !!options.length && !filteredOptions.length && (
              <div className="pt-1 d-flex align-items-center justify-content-center">
                {t('home.filter.no_data_found')}
              </div>
            )}
          </div>
        )}
        {allowAll && (
          <li
            className={`option d-flex align-items-center `}
            role="menuitem"
            onClick={() => {
              currentHandler(ALL_ITEM)
            }}
            onKeyPress={(e: KeyboardEvent<HTMLLIElement>) => {
              stopPropagation(e)
            }}
          >
            <div className="w-100 d-flex align-items-center justify-content-between gap-2">
              <div className="w-100 d-flex align-items-center justify-content-between gap-2">
                <span>{ALL_ITEM.option}</span>
                {allOptionSufix}
              </div>
              <input
                type="checkbox"
                onChange={() => {
                  currentHandler(ALL_ITEM)
                }}
                style={{ marginBottom: 4 }}
                checked={allSelected}
              />
            </div>
          </li>
        )}
        {filteredOptions?.map((item) => (
          <li
            key={item.id}
            data-value={item.id}
            className={`option d-flex align-items-center `}
            role="menuitem"
            onClick={() => currentHandler(item)}
            onKeyPress={(e: KeyboardEvent<HTMLLIElement>) => {
              stopPropagation(e)
            }}
          >
            <div className="w-100 d-flex align-items-center justify-content-between gap-2">
              <div className="w-100 d-flex align-content-center justify-content-between option-title-root gap-2">
                <div className="d-flex align-items-center option-title-root gap-2">
                  {item.icon}
                  <span className="option-title">{item.option}</span>
                </div>
                {item.sufix}
              </div>
              <input
                type="checkbox"
                onChange={() => {
                  currentHandler(item)
                }}
                style={{ marginBottom: 4 }}
                checked={selectedOptions.find((el) => el.option === item.option) ? true : false}
              />
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

export default CustomMultiSelect
