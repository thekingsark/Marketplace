'use client'
import React, { useEffect, useState } from 'react'
import { Icon, ValidIconSize } from './icon'
import { dir } from 'i18next'
import useGlobalContext from '@/hooks/use-context'

const LoveButton = ({
  duration = 150,
  containerPaddingLeft = 0,
  paddingBottom = 0,
  size = 32,
  isAbsolute = false,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  onTap,
  liked = false,
  withSplash = true,
  blockLike = false,
  transparentBackground = false,
}) => {
  const [isLiked, setIsLiked] = useState(liked)
  const [scale, setScale] = useState(1)
  const context = useGlobalContext()
  const lang = context.currentLanguage
  const direction = dir(lang)

  const animate = () => {
    setScale(1.3)
    setTimeout(() => {
      setScale(1)
    }, duration / 2)
  }

  useEffect(() => {
    if (liked !== isLiked) {
      animate()
      setIsLiked(liked)
    }
  }, [liked, animate])

  const handleTap = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()

    animate()
    if (onTap) {
      onTap(!isLiked)
    }

    if (!blockLike) {
      setIsLiked(!isLiked)
    }
  }

  const renderLoveIcon = () => {
    const IconComponent = isLiked ? (
      <Icon type="generic/heart-filled" color="#ee6148" size={(size as ValidIconSize) ?? 32} />
    ) : (
      <Icon type="generic/heart" color="var(--font_1)" size={(size as ValidIconSize) ?? 32} />
    )

    return (
      <div
        className="love-button-root"
        style={{
          paddingBottom,
          ...(transparentBackground
            ? {
              border: 0,
              background: 'transparent',
            }
            : {}),
        }}
      >
        {IconComponent}
      </div>
    )
  }

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transition: `transform ${duration / 2}ms`,
        position: isAbsolute ? 'absolute' : 'relative',
        ...(direction === 'rtl' ? { left: isAbsolute ? 12 : undefined } : { right: isAbsolute ? 12 : undefined }),
        top: isAbsolute ? 12 : undefined,
        zIndex: 1,
      }}
    >
      {withSplash ? (
        <button
          style={{
            maxHeight: 'auto',
            maxWidth: 'auto',
            padding: containerPaddingLeft,
          }}
          aria-label="Love button"
          onClick={handleTap}
        >
          {renderLoveIcon()}
        </button>
      ) : (
        <button
          onClick={handleTap}
          style={{
            height: '100%',
            padding: `0 ${containerPaddingLeft}px`,
            width: (size ?? 32) + containerPaddingLeft,
          }}
          aria-label="Love button"
        >
          {renderLoveIcon()}
        </button>
      )}
    </div>
  )
}

export default LoveButton
