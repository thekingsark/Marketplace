'use client'

import { useEffect, useState } from 'react'
import { IntroCategoriesPreferencesModal } from './preferences'
import { HowItWorksModal } from './how-it-works'
import { WouldYouLikeToSeeHowTheAppWorksModal } from './how-it-works/would-you-like-to-see-modal'
import { observer } from 'mobx-react-lite'
import { AppStore } from '@/core/store'
import { AccountController } from '@/core/controllers/account'
import { Category } from '@/core/domain/category'

export const AppIntro = observer(() => {
  const [setupModalOpened, setSetupModalOpened] = useState(false)
  const [wouldYouLikeToSeeModalOpened, setWouldYouLikeToSeeModalOpened] = useState(false)
  const [howItWorksModalOpened, setHowItWorksModalOpened] = useState(false)

  const openHowItWorksModal = () => {
    setWouldYouLikeToSeeModalOpened(false)
    setHowItWorksModalOpened(true)
  }

  useEffect(() => {
    const currentAccount = AppStore.accountData
    if (!currentAccount?.id) {
      return
    }

    if (!currentAccount.categoriesSetupDone) {
      setSetupModalOpened(true)
      return
    }

    if (!currentAccount.introDone && !currentAccount.introSkipped) {
      setWouldYouLikeToSeeModalOpened(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [AppStore.accountData])

  const handleFinishCategoriesSetup = (categories: Category[]) => {
    setSetupModalOpened(false)
    setWouldYouLikeToSeeModalOpened(true)
    AccountController.finishCategoriesSetup(categories)
  }

  const skipIntro = () => {
    setWouldYouLikeToSeeModalOpened(false)
    setHowItWorksModalOpened(false)
    AccountController.skipIntro()
  }

  const finishIntro = () => {
    setHowItWorksModalOpened(false)
    AccountController.finishInto()
  }

  if (!AppStore.accountData?.id) {
    return null
  }

  return (
    <>
      <IntroCategoriesPreferencesModal
        isOpened={setupModalOpened}
        handleFinish={handleFinishCategoriesSetup}
        close={() => setSetupModalOpened(false)}
      />

      <WouldYouLikeToSeeHowTheAppWorksModal
        isOpened={wouldYouLikeToSeeModalOpened}
        close={skipIntro}
        onSubmit={openHowItWorksModal}
      />

      <HowItWorksModal isOpened={howItWorksModalOpened} skip={skipIntro} finish={finishIntro} />
    </>
  )
})
