import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation, Thumbs } from 'swiper/modules'

import { useState } from 'react'

interface GalleryAsset {
  url: string
}

export default function AssetsGallery(props: { assets: GalleryAsset[] }) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null)

  const { assets } = props
  return (
    <>
      <Swiper
        modules={[Navigation, Thumbs]}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        className="big-swiper"
      >
        {assets.map((asset, index) => {
          return (
            <SwiperSlide key={index} className="assets-swiper-slide">
              <div className="w-100 d-flex align-items-center justify-content-center image-root">
                <img src={asset.url} key={index} />
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
      <Swiper
        onSwiper={(s) => setThumbsSwiper(s)}
        // onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        className="thumb-swiper"
      >
        {assets.map((asset, index) => {
          return (
            <SwiperSlide key={index} className="thumb-assets-swiper-slide">
              <img src={asset.url} key={index + 'thumb'} />
            </SwiperSlide>
          )
        })}
      </Swiper>

      <style jsx>{`
        .image-root {
          background-color: var(--clr-bg-gray);
        }

        :global(.assets-swiper-slide, .thumb-assets-swiper-slide) {
          text-align: center;
          font-size: 18px;
          display: -webkit-box;
          display: -ms-flexbox;
          display: -webkit-flex;
          display: flex;
          -webkit-box-pack: center;
          -ms-flex-pack: center;
          -webkit-justify-content: center;
          justify-content: center;
          -webkit-box-align: center;
          -ms-flex-align: center;
          -webkit-align-items: center;
          align-items: center;
          border-radius: 6px;
          background: transparent;
          border: 1px solid transparent;
        }

        :global(.assets-swiper-slide img) {
          display: block;
          width: 100%;
          height: 60vh;
          object-fit: contain;
          border-radius: 6px;
        }

        :global(.thumb-assets-swiper-slide img) {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 6px;
        }

        :global(.big-swiper) {
          height: 80%;
          width: 100%;
        }

        :global(.thumb-swiper) {
          height: 20%;
          box-sizing: border-box;
          padding: 10px 0;
        }

        :global(.thumb-swiper .swiper-slide) {
          width: 112px !important;
          height: 112px;
          opacity: 0.4;
        }

        :global(.thumb-swiper .swiper-slide-thumb-active) {
          opacity: 1;
          border: 1px solid var(--separator);
          border-radius: 6px;
        }
      `}</style>
    </>
  )
}
