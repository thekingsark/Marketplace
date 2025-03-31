import { useTranslation } from '@/app/i18n/client'
import useGlobalContext from '@/hooks/use-context'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Scrollbar } from 'swiper/modules'
import { useEffect, useState } from 'react'
import { Asset } from '@/core/domain/asset'
import { Icon } from '@/components/common/icon'

export const UploadedAssetsList = (props: {
  assets: File[] | Asset[] | (File | Asset)[]
  assetsType?: 'bid' | 'auction'
  handleRemoveAsset?: (index: number) => void
  handleClick: (index: number) => void
}) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const { assets, handleRemoveAsset, handleClick } = props

  const [assetsLen, setAssetsLen] = useState(assets.length)

  useEffect(() => {
    setAssetsLen(props.assets.length)
  }, [props.assets])

  const renderRightArrow = () => {
    return (
      <div className={`right-arrow-root uploaded-assets-next-button`}>
        <div className=" d-flex align-items-center justify-content-center">
          <Icon type="arrows/arrow-right-filled" />
        </div>
        <style jsx>{`
          .right-arrow {
            font-weight: 600;
          }
          .right-arrow-root {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 10;
            right: -20px;
            cursor: pointer;
          }
        `}</style>
      </div>
    )
  }

  const renderLeftArrow = () => {
    return (
      <div className={`arrow-root uploaded-assets-prev-button`}>
        <div className=" d-flex align-items-center justify-content-center">
          <Icon type="arrows/arrow-left-filled" />
        </div>
        <style jsx>{`
          .left-arrow {
            font-weight: 600;
          }
          .arrow-root {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 10;
            left: -20px;
            cursor: pointer;
          }
        `}</style>
      </div>
    )
  }

  const renderAssetItem = (asset: File | Asset, index: number) => {
    const serverBaseURL = process.env.NEXT_PUBLIC_SERVER_URL

    const url = asset.hasOwnProperty('id')
      ? `${serverBaseURL}/assets/${(asset as Asset).path}`
      : URL.createObjectURL(asset as File)

    return (
      <div
        style={{ backgroundImage: `url(${url})` }}
        className="uploaded-image"
        onClick={() => handleClick(index)}
      >
        {!!handleRemoveAsset && (
          <button
            className="fill-btn remove-asset-button"
            onClick={(e) => {
              handleRemoveAsset(index)
              e.stopPropagation()
            }}
          >
            <span> {t('generic.remove')}</span>
          </button>
        )}

        <style jsx>{`
          .uploaded-image {
            height: 150px;
            width: 130px;
            border-radius: 6px;
            border: 1px solid var(--separator);
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center center;
            transition: all 0.3s ease-in-out;
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
            cursor: pointer;
            display: flex;
            align-items: end;
            justify-content: center;
          }
          .uploaded-image:hover {
            transform: scale(1.03);
          }
          .remove-asset-button {
            display: none;
            margin-bottom: 8px;
            padding: 4px 8px;
            align-items: center;
            justify-content: center;
            height: 40px;
            font-size: 14px;
            font-weight: 400;
          }
          .uploaded-image:hover .remove-asset-button {
            display: flex;
          }
        `}</style>
      </div>
    )
  }

  if (!assetsLen) {
    return null
  }

  return (
    <div className="d-flex assets-root">
      {assetsLen <= 2 ? (
        <div className="few-assets-list d-flex">
          {assets.map((file, index) => {
            return (
              <div key={index} className="mr-20">
                {renderAssetItem(file, index)}
              </div>
            )
          })}
        </div>
      ) : (
        <Swiper
          modules={[Navigation, Scrollbar]}
          spaceBetween={20}
          slidesPerView={'auto'}
          style={{ padding: '4px 4px' }}
          loop={false}
          navigation={{
            nextEl: '.uploaded-assets-next-button',
            prevEl: '.uploaded-assets-prev-button',
          }}
        >
          {assets.map((file, index) => {
            return (
              <SwiperSlide
                key={index}
                className="uploaded-assets-slide"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                {renderAssetItem(file, index)}
              </SwiperSlide>
            )
          })}
        </Swiper>
      )}
      {assetsLen > 2 && (
        <div className="">
          {renderLeftArrow()}
          {renderRightArrow()}
        </div>
      )}
    </div>
  )
}
