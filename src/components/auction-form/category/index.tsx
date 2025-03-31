import { useTranslation } from '@/app/i18n/client'
import { Icon } from '@/components/common/icon'
import useGlobalContext from '@/hooks/use-context'
import { useState } from 'react'
import { FormErrorMessage } from '../form-error-message'
import { CreateAuctionCategoriesListModal } from '../modals/categories-list-modal'
import { Category } from '@/core/domain/category'
import { CategoryIcon } from '@/components/common/category-icon'

interface AuctionFormCategorySectionProps {
  categories: Category[]
  buttonRef: React.RefObject<HTMLDivElement>
  formIsValid: boolean
  initialData: { mainCategoryId: string | null; subCategoryId: string | null }
  formSubmitTries: number
  setCurrentCategory: (mainCategoryId: string | null, subCategoryId: string | null) => void
}

export const AuctionFormCategorySection = (props: AuctionFormCategorySectionProps) => {
  const { categories, buttonRef, formIsValid, formSubmitTries, initialData, setCurrentCategory } =
    props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const [mainCategoryId, setMainCategoryId] = useState<string | null>(
    initialData.mainCategoryId ?? null
  )
  const [subCategoryId, setSubCategoryId] = useState<string | null>(
    initialData.subCategoryId ?? null
  )
  const [categoryModalIsOpened, setCategoryModalIsOpened] = useState(false)

  const toggleCategoryModal = () => {
    setCategoryModalIsOpened(!categoryModalIsOpened)
  }

  const handleSelect = (mainCategoryId: string, subCategoryId: string) => {
    setMainCategoryId(mainCategoryId)
    setSubCategoryId(subCategoryId)
    setCurrentCategory(mainCategoryId, subCategoryId)
    toggleCategoryModal()
  }

  const clearSelectedCategory = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    setMainCategoryId(null)
    setSubCategoryId(null)
    setCurrentCategory(null, null)
  }

  const getCategoryById = (id: string) => {
    return categories.find((category) => category.id === id)
  }

  const renderSelectedCategoryInfo = () => {
    if (!mainCategoryId || !subCategoryId) {
      return null
    }

    const mainCategory = getCategoryById(mainCategoryId)
    const subCategory = mainCategory?.subcategories?.find(
      (category) => category.id === subCategoryId
    )

    return (
      <div className="d-flex align-items-center justify-content-between w-100">
        <div className="d-flex align-items-center gap-4">
          <CategoryIcon category={getCategoryById(mainCategoryId)} size={50} />
          <div className="d-flex flex-column">
            <span className="fw-bold primary-color">{mainCategory?.name[currentLanguage]}</span>
            <span className="fw-light">{subCategory?.name[currentLanguage]}</span>
          </div>
        </div>

        <div
          className="clear-selected-category-button d-flex align-items-center"
          onClick={clearSelectedCategory}
        >
          <Icon type="generic/close-filled" />
        </div>
      </div>
    )
  }

  return (
    <div className="mt-40">
      <div className="d-flex flex-row justify-content-between align-items-center mb-10">
        <label className="mb-0 create-auction-label">{t('create_auction.category')}</label>
      </div>

      <div
        ref={buttonRef}
        className="create-auction-category-trigger"
        onClick={toggleCategoryModal}
      >
        {mainCategoryId ? (
          renderSelectedCategoryInfo()
        ) : (
          <>
            <div className="select-category-generic-icon">
              <Icon type="generic/category" />
            </div>
            <span>{t('create_auction.select_category')}</span>
          </>
        )}
      </div>

      {!formIsValid && (!mainCategoryId || !subCategoryId) && !!formSubmitTries && (
        <div className="mt-10">
          <FormErrorMessage
            key={formSubmitTries}
            message={t('create_auction.category_required')}
            isError
          />
        </div>
      )}

      <CreateAuctionCategoriesListModal
        categories={categories}
        isOpened={categoryModalIsOpened}
        close={toggleCategoryModal}
        handleSubmit={handleSelect}
      />
    </div>
  )
}
