import { useTranslation } from '@/app/i18n/client'
import useGlobalContext from '@/hooks/use-context'
import React, { useState } from 'react'
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { CustomModal } from '@/components/common/custom-modal'
import { IntroFirstStep } from './steps/1'
import { IntroSecondStep } from './steps/2'
import { IntroThirdStep } from './steps/3'
import { IntroFourthStep } from './steps/4'
import { IntroFifthStep } from './steps/5'
import { Icon } from '@/components/common/icon'

interface HowItWorksProps {
  isOpened: boolean
  skip: () => void
  finish: () => void
}

export const HowItWorksModal = (props: HowItWorksProps) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)
  const { isOpened, finish, skip } = props

  const [currentStep, setCurrentStep] = useState(0)
  const [swiper, setSwiper] = useState<SwiperClass | null>(null)

  const handleContinue = () => {
    if (currentStep === 4) {
      finish()
      return
    }

    if (!swiper) {
      return
    }

    swiper.slideTo(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep === 0) {
      skip()
      return
    }

    if (!swiper) {
      return
    }

    swiper.slideTo(currentStep - 1)
  }

  return (
    <CustomModal
      open={isOpened}
      onClose={skip}
      styles={{
        modal: {
          maxWidth: '550px',
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
      closeIcon={<Icon type="generic/close-filled" />}
      closeOnOverlayClick={false}
      closeOnEsc={false}
      center
    >
      <h4 className="mb-20">{t('intro.how_it_works')}</h4>

      <div className="intro-swiper">
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          freeMode={true}
          modules={[Navigation]}
          watchSlidesProgress={true}
          onSwiper={(swiper: SwiperClass) => {
            setSwiper(swiper)
          }}
          onSlideChange={(swiper) => {
            setCurrentStep(swiper.activeIndex)
          }}
          style={{ padding: 8, alignItems: 'center' }}
        >
          <SwiperSlide key={1}>
            <IntroFirstStep />
          </SwiperSlide>
          <SwiperSlide key={2}>
            <IntroSecondStep />
          </SwiperSlide>
          <SwiperSlide key={3}>
            <IntroThirdStep />
          </SwiperSlide>
          <SwiperSlide key={4}>
            <IntroFourthStep />
          </SwiperSlide>
          <SwiperSlide key={5}>
            <IntroFifthStep />
          </SwiperSlide>
        </Swiper>
      </div>

      <div className="mt-10 mb-20 d-flex align-items-center justify-content-center">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <div
            key={index}
            className="slide-indicator"
            style={{
              background: currentStep === index ? 'var(--font_1)' : 'var(--separator)',
            }}
            onClick={() => {
              if (!swiper) {
                return
              }
              swiper.slideTo(index)
            }}
          ></div>
        ))}
      </div>

      <div className="d-flex align-items-center mt-20">
        <button
          className="no-btn w-100 d-flex align-items-center justify-content-center"
          onClick={handleBack}
        >
          {currentStep === 0 ? t('generic.skip') : t('generic.back')}
        </button>
        <button
          className="yes-btn fill-btn w-100 d-flex align-items-center justify-content-center"
          onClick={handleContinue}
        >
          {currentStep === 4 ? t('generic.finish') : t('generic.continue')}
        </button>
      </div>

      <style jsx>{`
        .step-overflow {
          overflow-y: auto;
        }

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
      `}</style>
    </CustomModal>
  )
}
