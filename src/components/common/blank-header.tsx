'use client'
import React from 'react'
import useSticky from '@/hooks/use-sticky'
import { AppLogo } from '@/components/common/app-logo'

const BlankHeader = () => {
  const { sticky } = useSticky()

  return (
    <>
      <header>
        <div id="header-sticky" className={`header-sticky ${sticky ? 'sticky ' : ''}`}>
          <div className="header-root p-0 m-0">
            <div className="row align-items-center">
              <div className="col-xl-2 col-lg-2 col-md-4 col-4">
                <div className="header-main-left">
                  <AppLogo />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <style jsx>{`
        .header-sticky {
          padding: 16px;
          display: flex;
          align-items: center;
        }
      `}</style>
    </>
  )
}

export default BlankHeader
