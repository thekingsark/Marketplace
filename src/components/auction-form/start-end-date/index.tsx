import { useTranslation } from '@/app/i18n/client'
import useGlobalContext from '@/hooks/use-context'
import { useEffect, useState } from 'react'
import DatePicker from 'react-date-picker'

interface AuctionCustomStartEndDateSectionProps {
  initialStartDate?: Date
  initialEndDate?: Date
  forUpdateAuction?: boolean
  onSelect: (useCustomDate: boolean, startDate?: Date, endDate?: Date) => void
}

export const AuctionCustomStartEndDateSection = (props: AuctionCustomStartEndDateSectionProps) => {
  const { initialStartDate, initialEndDate, forUpdateAuction = false } = props

  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const tomorrowDate = new Date()
  tomorrowDate.setDate(tomorrowDate.getDate() + 1)

  const tomorrowPlusTreeDays = new Date(tomorrowDate)
  tomorrowPlusTreeDays.setDate(tomorrowPlusTreeDays.getDate() + 3)

  const [useCustomDate, setUseCustomDate] = useState(!!initialStartDate)
  const [selectedStartDate, setSelectedStartDate] = useState<Date>(initialStartDate ?? tomorrowDate)
  const [selectedEndDate, setSelectedEndDate] = useState<Date>(initialEndDate ?? tomorrowPlusTreeDays)

  const maxStartDate = new Date()
  maxStartDate.setMonth(maxStartDate.getMonth() + 1)

  const startDateAfterOneDay = new Date(selectedStartDate)
  startDateAfterOneDay.setDate(startDateAfterOneDay.getDate() + 1)
  const [minEndDate, setMinEndDate] = useState<Date>(startDateAfterOneDay)

  const endDateAfterOneMonth = new Date(selectedEndDate)
  endDateAfterOneMonth.setDate(endDateAfterOneMonth.getDate() + 30)
  const [maxEndDate, setMaxEndDate] = useState<Date>(endDateAfterOneMonth)

  const toggleUseCustomDate = () => {
    if (forUpdateAuction) {
      return
    }

    setUseCustomDate(!useCustomDate)
  }

  useEffect(() => {
    props.onSelect(useCustomDate, selectedStartDate, selectedEndDate)
  }, [selectedStartDate, selectedEndDate, useCustomDate])

  const handleSelectStartDate = (date: Date) => {
    setSelectedStartDate(date)

    const differenceBetweenDateAndEndDate = selectedEndDate.getTime() - date.getTime()
    const differenceInDays = differenceBetweenDateAndEndDate / (1000 * 3600 * 24)

    if (date > selectedEndDate || differenceInDays > 25) {
      const endAfterThreeDays = new Date(date)
      endAfterThreeDays.setDate(endAfterThreeDays.getDate() + 3)

      const startAfterOneDay = new Date(date)
      startAfterOneDay.setDate(startAfterOneDay.getDate() + 1)

      const endAfterOneMonth = new Date(endAfterThreeDays)
      endAfterOneMonth.setMonth(endAfterOneMonth.getMonth() + 1)

      setMinEndDate(startAfterOneDay)
      setSelectedEndDate(endAfterThreeDays)
      setMaxEndDate(endAfterOneMonth)
    }
  }

  const handleSelectEndDate = (date: Date) => {
    setSelectedEndDate(date)
  }

  return (
    <div className="mt-40 auction-start-end-date-root">
      <div
        className="d-flex flex-row justify-content-between align-items-center mb-10"
        onClick={toggleUseCustomDate}
      >
        <label className="mb-0 create-auction-label">
          {t('starting_soon_auctions.custom_start_date')}
        </label>
        {!forUpdateAuction && (
          <div className="checkbox-container">
            <input type="checkbox" onChange={toggleUseCustomDate} checked={useCustomDate} />
          </div>)}
      </div>
      {useCustomDate && (
        <div className="d-flex align-items-center justify-content-center gap-2 mb-10">
          <div className="d-flex flex-column align-items-start w-100 flex-grow-1">
            <span className="secondary-color">{t('starting_soon_auctions.start_date')}</span>
            <DatePicker
              locale={currentLanguage}
              className="auction-date-picker"
              onChange={(value) => handleSelectStartDate(value as Date)}
              minDate={tomorrowDate}
              maxDate={maxStartDate}
              value={selectedStartDate}
              clearIcon={null}
              calendarIcon={null}
            />
          </div>
          <div className="d-flex flex-column align-items-start w-100 flex-grow-1">
            <span className="secondary-color">{t('starting_soon_auctions.end_date')}</span>
            <DatePicker
              locale={currentLanguage}
              className="auction-date-picker"
              onChange={(value) => handleSelectEndDate(value as Date)}
              value={selectedEndDate}
              minDate={minEndDate}
              maxDate={maxEndDate}
              clearIcon={null}
              calendarIcon={null}
            />
          </div>
        </div>
      )}
      <span className="secondary-color">{t(forUpdateAuction ? 'starting_soon_auctions.opted_for_custom' : 'starting_soon_auctions.will_automaticaly_start')}</span>
      <style jsx>{`
        .auction-start-end-date-root {
          padding-bottom: 8px;
          border-bottom: ${useCustomDate ? '1px solid var(--font_1)' : 'none'};
        }
      `}</style>
    </div>
  )
}
