'use client'
import React, { useRef } from 'react'
import { Icon } from './icon'
import useScrollDirection from '@/hooks/scroll-direction'

export const BackToTop = () => {
  const elementRef = useRef<HTMLDivElement>(null)
  const scrollDirection = useScrollDirection()

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <div
        ref={elementRef}
        onClick={handleClick}
        className={`progress-wrap ${scrollDirection === 'down' ? 'active-progress' : ''}`}
      >
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ rotate: '90deg' }}
        >
          <Icon type={'arrows/arrow-left-filled'} color="white" />
        </div>
      </div>
    </>
  )
}
