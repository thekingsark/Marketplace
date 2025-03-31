import { ButtonHTMLAttributes } from 'react'
import { Icon, ValidIconSize } from './icon'

export const IconButton = (
  props: {
    icon: string
    onClick: (ev?: Event) => void
    countInfo?: number
    size?: number
    color?: string
    transparent?: boolean
    noMargin?: boolean
    style?: Record<string, string | number>
  } & ButtonHTMLAttributes<HTMLButtonElement>
) => {
  const {
    icon,
    onClick,
    size = 24,
    transparent = false,
    noMargin = false,
    color,
    countInfo,
    style = {},
    ...rest
  } = props

  return (
    <button
      {...rest}
      aria-label="icon-button"
      className={`icon-button position-relative ${noMargin ? '' : 'ml-20'}`}
      style={{ background: transparent ? 'transparent' : 'var(--background_4)', ...style }}
      onClick={(ev) => onClick(ev)}
    >
      <div className="d-flex justify-content-center align-items-center">
        <Icon
          type={icon}
          size={size as ValidIconSize}
          {...(color ? { color } : { color: 'var(--font_1)' })}
        />
        {countInfo ? <span className="icon-button-count">{countInfo}</span> : null}
      </div>
    </button>
  )
}
