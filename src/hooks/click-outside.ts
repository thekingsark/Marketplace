import { useEffect, RefObject } from 'react'

export const useClickOutside = (
  ref: RefObject<HTMLElement>,
  callback: () => void,
  deps: unknown[] = [],
  allowedRefs = [] as RefObject<HTMLElement>[],
  allowedClasses = [] as string[]
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement

      if (ref.current && !ref.current.contains(target)) {
        // Check if target is in allowedRefs
        if (allowedRefs.length > 0) {
          for (const allowedRef of allowedRefs) {
            if (allowedRef.current && allowedRef.current.contains(target)) {
              return
            }
          }
        }

        // Check if target is in allowedClasses
        if (allowedClasses.length > 0) {
          for (const className of allowedClasses) {
            if (target.classList.contains(className)) {
              return
            }

            const classInsideParent = target.closest(`.${className}`)
            if (classInsideParent) {
              return
            }
          }
        }

        callback()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, callback, allowedClasses, allowedRefs, ...deps])
}
