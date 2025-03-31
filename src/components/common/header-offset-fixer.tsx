'use client'
import { useEffect } from 'react'

export const HeaderOffsetFixer = () => {
  useEffect(() => {
    const header = document.getElementById('header-sticky')
    const content = document.querySelector('.main-content')

    const adjustContentOffset = () => {
      if (header && content) {
        const headerHeight = header.offsetHeight
        ;(content as HTMLElement).style.paddingTop = `${headerHeight}px`
      }
    }

    adjustContentOffset()
    window.addEventListener('resize', adjustContentOffset)

    return () => {
      window.removeEventListener('resize', adjustContentOffset)
    }
  }, [])
  return null
}
