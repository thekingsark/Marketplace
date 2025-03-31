'use client'
import React, { useEffect, useState } from 'react'
import { Icon } from './icon'

export const CustomInput = (props: {
  onChange?: (value: string) => void
  onEnter?: () => void
  value?: string
  secondary?: boolean
  placeholder?: string
  isLoading?: boolean
  disabled?: boolean
  withPrefixIcon?: boolean
  prefixIcon?: React.ReactNode
  listenForValueChange?: boolean
  type?: string
  largeHeight?: boolean
  withSufixIcon?: boolean
  suffixIcon?: React.ReactNode
  style?: React.CSSProperties
  inputAttrs?: React.InputHTMLAttributes<HTMLInputElement>
}) => {
  const {
    isLoading,
    disabled,
    withPrefixIcon = true,
    withSufixIcon = true,
    suffixIcon,
    prefixIcon,
    listenForValueChange = false,
    largeHeight = false,
    type = 'text',
    style = {},
    secondary = false,
    inputAttrs = {},
    placeholder,
    onChange,
  } = props

  const [value, setValue] = useState(props.value || '')

  useEffect(() => {
    if (listenForValueChange && props.value !== value) {
      setValue(props.value ?? '')
    }
  }, [props.value, listenForValueChange])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    onChange?.(e.target.value)
  }

  const handleClear = () => {
    setValue('')
    onChange?.('')
  }

  return (
    <div className="filter-search-input m-0">
      <div className="input-container">
        <input
          {...inputAttrs}
          disabled={disabled}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (props.onEnter && e.key === 'Enter') {
              props.onEnter()
              setValue('')
            }
          }}
          type={type}
          style={{ ...style, ...(largeHeight ? { height: 50 } : {}) }}
          value={value}
          className={`search-input ${secondary ? 'secondary-input-background' : ''}`}
          placeholder={placeholder ?? 'Search...'}
        />
        {prefixIcon && <div className="search-icon">{prefixIcon}</div>}
        {withPrefixIcon && !prefixIcon ? (
          <div className="search-icon d-flex align-items-center justify-content-center">
            <Icon type="generic/search" />
          </div>
        ) : null}

        {!!suffixIcon && (
          <div style={{ top: 12, position: 'absolute', right: 16 }}>{suffixIcon}</div>
        )}

        {isLoading && withSufixIcon ? (
          <div className="loading-icon">
            <div className="d-flex justify-content-center">
              <Icon type="loading" color={'var(--font_1)'} size={40} />
            </div>
          </div>
        ) : null}

        {!isLoading && withSufixIcon && value.length ? (
          <div className="input-icon" onClick={handleClear}>
            <Icon type="generic/close-filled" size={18} />
          </div>
        ) : null}
      </div>
    </div>
  )
}
