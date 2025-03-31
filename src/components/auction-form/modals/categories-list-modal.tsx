import { useTranslation } from '@/app/i18n/client'
import { CustomAccordion } from '@/components/common/custom-accordion'
import { CategoryIcon } from '@/components/common/category-icon'
import { CustomModal } from '@/components/common/custom-modal'
import { Icon } from '@/components/common/icon'
import { Category } from '@/core/domain/category'
import useGlobalContext from '@/hooks/use-context'

interface CreateAuctionCategoriesListModalProps {
  categories: Category[]
  isOpened: boolean
  close: () => void
  handleSubmit: (mainCategoryId: string, subCategoryId: string) => void
}

export const CreateAuctionCategoriesListModal = (props: CreateAuctionCategoriesListModalProps) => {
  const { categories, isOpened, close, handleSubmit } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const renderCategoryItem = (category: Category, index: number) => {
    return (
      <div
        className="main-category-item-root d-flex align-items-center flex-col justify-content-center mb-1"
        key={index}
      >
        <div className=" w-100 mr-1 ml-1">
          <div className=" w-100 m-10 d-flex text-center align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <CategoryIcon category={category} size={40} />
              <span className="mb-0 m-0">{category.name[currentLanguage]}</span>
            </div>
          </div>
        </div>
        <style jsx>{`
          .main-category-item-root {
            cursor: pointer;
            border-radius: 6px;
          }
        `}</style>
      </div>
    )
  }

  const accordionData = categories
    .map((category, rootIndex) => {
      const subCategories = category.subcategories?.map((subcategory) => {
        return {
          id: subcategory.id,
          collapsedId: subcategory.id + 'collapsed',
          title: <div className="sub-category-item">{subcategory.name[currentLanguage]}</div>,
        }
      })

      return {
        id: category.id,
        collapsedId: category.id + 'collapsed',
        title: renderCategoryItem(category, rootIndex),
        items: subCategories || [],
      }
    })
    .flat()

  return (
    <CustomModal
      open={isOpened}
      onClose={close}
      styles={{
        modal: {
          height: '70vh',
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
      <div className="d-flex align-items-center justify-content-between">
        <h4 className="m-0">{t('create_auction.select_category')}</h4>
        <div></div>
      </div>
      <div className="mt-20 modal-body-content">
        <CustomAccordion data={accordionData} onSelectSubItem={handleSubmit} />
      </div>
      <style jsx>{`
        .back-button {
          cursor: pointer;
        }
        .categories-list {
          height: 60vh;
          overflow-y: auto;
          padding-top: 16px;
        }
        .subcategories-list {
          display: block;
          width: 100%;
        }
        .modal-body-content {
          height: calc(100% - 50px);
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          touch-action: auto;
        }
      `}</style>
    </CustomModal>
  )
}
