import useScrollDirection from '@/hooks/scroll-direction'
import { useEffect, useRef, useState } from 'react'

export const AuctionBottomActionsWrapper = (props: {
  children: React.ReactNode
}) => {
  const scrollDirection = useScrollDirection()

  const initializedRef = useRef(false)
  const [showActions, setShowActions] = useState(true)

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true
      return
    }

    if (!scrollDirection) {
      return
    }

    if (scrollDirection === 'up') {
      setShowActions(true)
    } else {
      setShowActions(false)
    }
  }, [scrollDirection])

  return (
    <div className={`auction-bottom-actions ${showActions ? 'active' : ''}`}>
      {props.children}
    </div>
  )
}
