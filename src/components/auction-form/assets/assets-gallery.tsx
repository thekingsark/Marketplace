import { useTranslation } from '@/app/i18n/client'
import { CustomModal } from '@/components/common/custom-modal'
import { Icon } from '@/components/common/icon'
import { Asset } from '@/core/domain/asset'
import useGlobalContext from '@/hooks/use-context'
import dynamic from 'next/dynamic'

const AssetsGallery = dynamic(() => import('@/components/common/assets-gallery'), {
  ssr: false,
  loading: () => (
    <div className="loader-wrapper">
      <Icon type="loading" color={'var(--font_1)'} size={40} />
    </div>
  ),
})

export const AssetsGalleryModal = (props: {
  isOpened: boolean
  setOpened: (value: boolean) => void
  assets: string[] | File[] | Asset[] | (File | Asset)[]
  title?: string
}) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const { isOpened, setOpened, assets, title } = props
  const serverBaseURL = process.env.NEXT_PUBLIC_SERVER_URL

  const assetsToDisplay = assets.map((asset) => ({
    url:
      typeof asset === 'string'
        ? asset
        : asset.hasOwnProperty('id')
          ? `${serverBaseURL}/assets/${(asset as Asset).path}`
          : URL.createObjectURL(asset as File),
  }))

  return (
    <CustomModal
      closeOnOverlayClick={false}
      closeOnEsc={false}
      open={isOpened}
      onClose={() => {
        setOpened(false)
      }}
      styles={{
        modal: {
          maxWidth: '90%',
          width: '90%',
          backgroundColor: 'var(--background_2)',
        },
        overlay: {
          background: 'rgba(0, 0, 0, 0.5)',
        },
      }}
      classNames={
        {
          // modal: 'info-modal'
        }
      }
      closeIcon={<Icon type="generic/close-filled" />}
      center
    >
      <div className="d-flex align-items-center justify-content-between mt-10 mb-20">
        <h4>{title ?? t('assets.selected_images')}</h4>
        <span>
          {assetsToDisplay.length === 1
            ? t('assets.image_singular', { no: assetsToDisplay.length })
            : t('assets.image_plural', { no: assetsToDisplay.length })}
        </span>
      </div>
      <AssetsGallery assets={assetsToDisplay} />
    </CustomModal>
  )
}
