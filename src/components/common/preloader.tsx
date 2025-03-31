'use client'
import React from 'react'

const Preloader = () => {
  return (
    <>
      <div id="preloader" style={{ background: 'var(--background_2)' }}>
        <div className="preloader">
          <span></span>
          <span></span>
        </div>
      </div>
    </>
  )
}

export default Preloader
