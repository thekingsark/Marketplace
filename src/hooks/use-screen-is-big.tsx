import { useEffect, useState } from 'react'

export const useScreenIsBig = (initialValue = true) => {
  const [screenIsBig, setScreenIsBig] = useState(initialValue)

  useEffect(() => {
    const checkIfScreenIsBig = () => {
      if (window.innerWidth > 768) {
        setScreenIsBig(true)
      } else {
        setScreenIsBig(false)
      }
    }

    checkIfScreenIsBig()
    window.addEventListener('resize', checkIfScreenIsBig)

    return () => {
      window.removeEventListener('resize', checkIfScreenIsBig)
    }
  }, [])

  return screenIsBig
}
