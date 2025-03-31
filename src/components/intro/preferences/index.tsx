import { useTranslation } from '@/app/i18n/client'
import { CustomModal } from '@/components/common/custom-modal'
import { Category } from '@/core/domain/category'
import useGlobalContext from '@/hooks/use-context'
import { useCallback, useState } from 'react'
import { PreferencesCategoryItem } from './category-item'
import { Icon } from '@/components/common/icon'

export const IntroCategoriesPreferencesModal = (props: {
  isOpened: boolean
  initialPreferredCategories?: string[]
  withSkip?: boolean
  close: () => void
  handleFinish: (categories: Category[]) => void
}) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)
  const { isOpened, close, withSkip = true, handleFinish: handleFinishSetup } = props

  const categories = globalContext.appCategories
  const initialPreferredCategories = (props.initialPreferredCategories || [])
    .map((id) => categories.find((c) => c.id === id))
    .filter((c) => c) as Category[]

  const [preferredCategories, setPreferredCategories] = useState<Category[]>(
    initialPreferredCategories
  )

  const handleToggleCategory = (category: Category) => {
    if (preferredCategories.includes(category)) {
      setPreferredCategories(preferredCategories.filter((g) => g.id !== category.id))
    } else {
      setPreferredCategories([...preferredCategories, category])
    }
    return true
  }

  const handleFinish = useCallback(() => {
    handleFinishSetup(preferredCategories)
  }, [preferredCategories, handleFinishSetup])

  return (
    <CustomModal
      open={isOpened}
      onClose={close}
      closeOnEsc={false}
      closeOnOverlayClick={false}
      styles={{
        modal: {
          maxWidth: '90%',
          minHeight: '200px',
          backgroundColor: 'var(--background_2)',
        },
        overlay: {
          background: 'rgba(0, 0, 0, 0.5)',
        },
      }}
      classNames={{
        modal: 'info-modal',
      }}
      center
      closeIcon={<Icon type="generic/close-filled" />}
    >
      <h4 className="mb-20">{t('home.preferred_categories.title')}</h4>
      <div className="mt-10 mb-20 d-flex align-items-center justify-content-center text-center">
        <span>{t('home.preferred_categories.info')}</span>
      </div>
      <div className="choose-preferred-categories-root">
        {categories.map((category, index) => {
          const isSelected = preferredCategories.some((el) => el.id === category.id)
          return (
            <PreferencesCategoryItem
              key={index}
              category={category}
              selected={isSelected}
              onClick={() => handleToggleCategory(category)}
            />
          )
        })}
      </div>

      <div className="d-flex align-items-center mt-20">
        {withSkip && (
          <button
            className="no-btn flex-grow-1 d-flex align-items-center justify-content-center"
            onClick={close}
          >
            {t('generic.skip')}
          </button>
        )}

        <button
          className="yes-btn fill-btn flex-grow-1 d-flex align-items-center justify-content-center"
          onClick={handleFinish}
        >
          {t('generic.finish')}
        </button>
      </div>

      <style jsx>{`
        .yes-btn,
        .no-btn {
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          margin: 0;
        }
        .slide-indicator {
          height: 14px;
          width: 14px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 4px;
          cursor: pointer;
        }
        .intro-swiper {
          padding: 0 16px;
        }
        .grid-container {
          padding: 4px;
          margin: 0 16px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          max-height: 500px;
          overflow-y: auto;
          scrollbar-width: thin;
        }
      `}</style>
    </CustomModal>
  )
}
