import { observer } from 'mobx-react-lite'
import { SaveFilterModal } from '../modals/save-filter'
import { useState } from 'react'
import { toast } from 'react-toastify'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'
import { FilterAuctionsParams } from '@/core/repositories/auction'
import { FilterItem, FilterItemData } from '@/core/domain/filter'
import { FilterController } from '@/core/controllers/filter'
import { Category } from '@/core/domain/category'
import { Location } from '@/core/domain/location'
import Link from 'next/link'
import { AppStore } from '@/core/store'

export const SaveFilterButton = observer(
  (props: {
    filterIsActive: boolean
    locations: Location[]
    getFilterData: () => Partial<FilterAuctionsParams>
  }) => {
    const currentAccount = AppStore.accountData
    const globalContext = useGlobalContext()
    const currentLanguage = globalContext.currentLanguage
    const { t } = useTranslation(currentLanguage)

    const { filterIsActive } = props
    const [saveFilterModalOpened, setSaveFilterModalOpened] = useState(false)

    const toggleSaveFilterModal = () => {
      setSaveFilterModalOpened(!saveFilterModalOpened)
    }

    const openSaveFilterModal = () => {
      if (!filterIsActive) {
        toast.error(t('info.no_filter_applied'))
        return
      }

      setSaveFilterModalOpened(true)
    }

    const getCategoriesFromIds = (categoriesIds: string[]) => {
      const categories = globalContext.appCategories.filter((cat) => categoriesIds.includes(cat.id))

      return categories.map((category) => ({
        ...category,
        subcategories: undefined,
      }))
    }

    const getSubCategoriesFromIds = (subCategoriesIds: string[]) => {
      const subCategories = globalContext.appCategories.reduce((acc: Category[], cat) => {
        const subCategories = cat.subcategories?.filter((subCat) =>
          subCategoriesIds.includes(subCat.id)
        )

        return [...acc, ...(subCategories ?? [])]
      }, [] as Category[])

      return subCategories.map((subCategory) => ({
        ...subCategory,
        subcategories: undefined,
      }))
    }

    const getLocationsFromIds = (locationsIds: string[]) => {
      return (
        locationsIds.map((id) => {
          return props.locations.find((loc) => loc.id === id)
        }) ?? []
      ).filter((el) => el) as Location[]
    }

    const handleSaveFilter = async (title: string) => {
      const filterData = props.getFilterData()
      if (!filterData) {
        return false
      }

      const filterItemData = new FilterItemData({
        selectedCategories: getCategoriesFromIds(filterData.categories ?? []),
        selectedSubCategories: getSubCategoriesFromIds(filterData.subCategories ?? []),
        selectedLocations: getLocationsFromIds(filterData.locationIds ?? []),
        includeMyAuctions: filterData.includeMyAuctions ?? true,
        minPrice: filterData.minPrice,
        maxPrice: filterData.maxPrice,
      })

      const filterToSave = new FilterItem({
        name: title,
        filterData,
        data: filterItemData,
      })

      return FilterController.create(filterToSave)
    }

    return (
      <>
        <div className="d-flex justify-content-end mt-10 save-filter-button-root">
          {filterIsActive &&
            (currentAccount?.id ? (
              <span onClick={openSaveFilterModal}>{t('home.filter.save_filter_title')}</span>
            ) : (
              <Link href="/auth/login">
                <span>{t('home.filter.save_filter_title')}</span>
              </Link>
            ))}
        </div>
        <SaveFilterModal
          isOpened={saveFilterModalOpened}
          close={toggleSaveFilterModal}
          onSubmit={handleSaveFilter}
        />
      </>
    )
  }
)
