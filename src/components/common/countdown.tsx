'use client'

import { useTranslation } from '@/app/i18n/client'
import useGlobalContext from '@/hooks/use-context'
import React from 'react'
import { default as ReactCountdown } from 'react-countdown'
import { dir } from 'i18next'

export const Countdown = ({
  deadlineDate = new Date(),
  large = false,
  small = false,
  withDays = false,
}) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)
  const direction = dir(currentLanguage)

  const renderer = (params: {
    days: number
    hours: number
    minutes: number
    seconds: number
    completed: boolean
  }) => {
    const { days, minutes, seconds, completed } = params
    let { hours } = params

    if (!withDays) {
      hours += days * 24
    }

    if (completed) {
      return (
        <p className="auction-card-status m-0">
          {t('auction_details.closed')}
          <style jsx>{`
            .auction-card-status {
              color: var(--call_to_action);
              white-space: nowrap;
              font-size: ${large ? 24 : small ? 16 : 18}px;
            }
          `}</style>
        </p>
      )
    }

    if (days > 3) {
      return (
        <p className="auction-card-status m-0">
          {t('generic.days_no', { no: days })}
        </p>
      )
    }

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          fontSize: small ? 14 : large ? 24 : 16,
          color: 'var(--font_1)',
        }}
      >
        {withDays && (
          <>
            <div style={{ textAlign: 'start', width: small ? 24 : 35 }}>
              <span>{days.toString().padStart(2, '0')}</span>
            </div>
            <div style={{ ...(direction === 'rtl' ? { paddingLeft: 6 } : { paddingRight: 6 }) }}>:</div>
          </>
        )}
        <div className='d-flex align-items-center justify-content-center' style={{ textAlign: 'start', width: small ? 24 : 30 }} suppressHydrationWarning>
          <span>{hours.toString().padStart(2, '0')}</span>
        </div>
        <div className='d-flex align-items-center justify-content-center'>:</div>
        <div className='d-flex align-items-center justify-content-center' style={{ textAlign: 'start', width: small ? 24 : 30 }} suppressHydrationWarning>
          {minutes.toString().padStart(2, '0')}
        </div>
        <div className='d-flex align-items-center justify-content-center' style={{ ...(direction === 'rtl' ? { paddingLeft: 6 } : { paddingRight: 6 }) }}>:</div>
        <div style={{ textAlign: 'start', width: small ? 24 : 30 }} suppressHydrationWarning>
          {seconds.toString().padStart(2, '0')}
        </div>
      </div >
    )
  }

  return <ReactCountdown date={deadlineDate} renderer={renderer} />
}
