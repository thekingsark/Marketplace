import { useTranslation } from '@/app/i18n/client'
import { Icon } from '@/components/common/icon'
import { AppStore } from '@/core/store'
import useGlobalContext from '@/hooks/use-context'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { FilterItem } from '@/core/domain/filter'
import { Location } from '@/core/domain/location'
import { FilterController } from '@/core/controllers/filter'
import { FilterItemCard } from './saved-filter-card'
import { DeleteFilterModal } from '../modals/delete-filter'
import { CustomAccordion } from '@/components/common/custom-accordion'

export const AuctionsListSavedFilters = observer(
  (props: {
    locations: Location[]
    handleFilterClick: (filter: FilterItem) => void
    checkIfFilterIsApplied: () => boolean
  }) => {
    const globalContext = useGlobalContext()
    const currentLanguage = globalContext.currentLanguage
    const { t } = useTranslation(currentLanguage)

    const [filterUnderDelete, setFilterUnderDelete] = useState<FilterItem | null>(null)

    const closeDeleteFilterModal = () => {
      setFilterUnderDelete(null)
    }

    const handleDeleteFilter = async () => {
      if (!filterUnderDelete) {
        return false
      }

      return await FilterController.delete(filterUnderDelete.id)
    }

    return (
      <>
        <CustomAccordion
          style={{ border: '1px solid var(--separator)', borderRadius: 6 }}
          data={[
            {
              id: '0',
              collapsedId: '0collapsed',
              title: (
                <div className="d-flex gap-2 align-items-center">
                  <Icon type="generic/diskette" />
                  <p className="m-0 saved-filters-title">{t('info.saved_filters')}</p>
                </div>
              ),
              content: (
                <div className="d-flex flex-column align-items-start gap-2 w-100">
                  <span className="secondary-color d-flex gap-2 saved-filters-wrapper">
                    {AppStore.accountData?.filters?.map((filter, index) => {
                      return (
                        <FilterItemCard
                          item={filter}
                          key={index}
                          onClick={() => {
                            props.handleFilterClick(filter)
                          }}
                          handleDelete={() => {
                            setFilterUnderDelete(filter)
                          }}
                        />
                      )
                    })}
                    {!AppStore.accountData?.filters?.length && (
                      <span className="no-filters-message">
                        {t('home.filter.you_dont_have_saved_filters')}
                      </span>
                    )}
                  </span>
                </div>
              ),
            },
          ]}
        />

        <DeleteFilterModal
          close={closeDeleteFilterModal}
          isOpened={!!filterUnderDelete}
          onSubmit={handleDeleteFilter}
        />
      </>
    )
  }
)
