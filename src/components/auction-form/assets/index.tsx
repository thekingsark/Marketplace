import { AssetsGlobalUploader } from '@/components/common/assets-global-uploader'
import { AssetsGalleryModal } from './assets-gallery'
import { FilePickerButton } from './file-picker'
import { UploadedAssetsList } from './uploaded-assets'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'
import { useState } from 'react'
import { Asset } from '@/core/domain/asset'

interface CreateAuctionAssetsSectionProps {
  uploadedAssets: (File | Asset)[]
  setUploadedAssets: (files: (Asset | File)[]) => void
}

export const CreateAuctionAssetsSection = (props: CreateAuctionAssetsSectionProps) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const [uploadedAssets, setUploadedAssets] = useState<(Asset | File)[]>(props.uploadedAssets)
  const [assetsGalleryOpened, setAssetsGalleryOpened] = useState(false)

  const handleAssetsPick = (files: (Asset | File)[]) => {
    const newAssets = [...uploadedAssets, ...files]
    setUploadedAssets(newAssets)
    props.setUploadedAssets(newAssets)
  }

  const removeUploadedAsset = (index: number) => {
    setUploadedAssets([...uploadedAssets.filter((_, i) => i !== index)])
    props.setUploadedAssets([...uploadedAssets.filter((_, i) => i !== index)])
  }

  return (
    <>
      <FilePickerButton
        multiple
        onFilesPick={handleAssetsPick}
        accept="image/jpeg, image/png, image/webp, image/tiff, image/heic, image/heif"
      >
        <span>+ {t('assets.add_images')}</span>
      </FilePickerButton>
      <UploadedAssetsList
        assets={uploadedAssets}
        handleRemoveAsset={removeUploadedAsset}
        handleClick={() => {
          setAssetsGalleryOpened(true)
        }}
      />
      <AssetsGlobalUploader
        onUpload={(files) => {
          handleAssetsPick([...uploadedAssets, ...files])
        }}
      />
      <AssetsGalleryModal
        isOpened={assetsGalleryOpened}
        setOpened={setAssetsGalleryOpened}
        assets={uploadedAssets}
      />
    </>
  )
}
