import { useTranslation } from '@/app/i18n/client'
import { CustomModal } from '@/components/common/custom-modal'
import { Icon } from '@/components/common/icon'
import { AuctionHistoryEvent } from '@/core/domain/auction'
import useGlobalContext from '@/hooks/use-context'
import { AuctionHistoryEventCard } from '../common/history-event'
import { NoResultsAvailable } from '@/components/common/no-results'

export const AuctionHistoryModal = (props: {
  isOpened: boolean
  events: AuctionHistoryEvent[]
  close: () => void
}) => {
  const { isOpened, events, close } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const sortedDescEvents = events.sort((a, b) => {
    return (
      new Date(b.createdAt ?? new Date()).getTime() - new Date(a.createdAt ?? new Date()).getTime()
    )
  })

  return (
    <CustomModal
      open={isOpened}
      onClose={close}
      styles={{
        modal: {
          maxWidth: '550px',
          maxHeight: '80vh',
          backgroundColor: 'var(--background_2)',
        },
        overlay: {
          background: 'rgba(0, 0, 0, 0.5)',
        },
      }}
      classNames={{
        modal: 'info-modal',
      }}
      closeIcon={<Icon type="generic/close-filled" />}
      center
    >
      <h4>{t('auction_history.auction_history')}</h4>

      {sortedDescEvents.length ? (
        <div
          className="d-flex flex-column gap-2 mt-20"
          style={{ maxHeight: '75vh', overflow: 'auto' }}
        >
          {sortedDescEvents.map((event, index) => {
            return <AuctionHistoryEventCard key={index} event={event} />
          })}
        </div>
      ) : (
        <div className="mt-30">
          <NoResultsAvailable title={t('home.filter.no_data_found')} />
        </div>
      )}
    </CustomModal>
  )
}
