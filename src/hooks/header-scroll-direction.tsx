import { useEffect, useState } from 'react'

export const useHeaderScrollDirection = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isFixed, setIsFixed] = useState(false)

  useEffect(() => {
    const header = document.getElementById('header-sticky')
    const content = document.querySelector('.content')

    const updateIsFixed = () => {
      const fixed = window.innerWidth <= 575
      setIsFixed(fixed)

      if (header && content) {
        if (fixed) {
          ;(content as HTMLElement).style.paddingTop = `${header.offsetHeight}px`
        } else {
          ;(content as HTMLElement).style.paddingTop = '0'
        }
      }
    }

    const handleScroll = () => {
      const scrollY = window.scrollY

      if (isFixed) {
        if (scrollY > lastScrollY + 10) setIsVisible(false)
        if (scrollY < lastScrollY - 10 || scrollY <= 60) setIsVisible(true)
      }

      setLastScrollY(scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', updateIsFixed)

    updateIsFixed()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateIsFixed)
    }
  }, [isFixed, lastScrollY])

  return { isVisible, isFixed }
}
