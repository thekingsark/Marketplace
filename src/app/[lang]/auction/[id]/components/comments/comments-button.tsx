import { useTranslation } from '@/app/i18n/client'
import { CommentsController } from '@/core/controllers/comments'
import useGlobalContext from '@/hooks/use-context'
import { useEffect, useState } from 'react'
import { AuctionCommentsModal } from './comments-list'
import { AppStore } from '@/core/store'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/navigation'

export const AuctionCommentsButton = observer((props: { auctionId: string; }) => {
  const { auctionId } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)
  const currentAccount = AppStore.accountData ?? undefined

  const router = useRouter()

  const [commentsCount, setCommentsCount] = useState(0)
  const [commentsModalOpened, setCommentsModalOpened] = useState(false)

  useEffect(() => {
    const count = async () => {
      const newCount = await CommentsController.countForAuction(auctionId)
      setCommentsCount(newCount)
    }

    count()
  }, [auctionId])

  const toggleCommentsModal = () => {
    if (!commentsModalOpened && !currentAccount) {
      router.push('/auth/login')

      return
    }
    setCommentsModalOpened(!commentsModalOpened)
  }

  const incrementCommentsCount = () => {
    setCommentsCount(commentsCount + 1)
  }

  return (
    <>
      <button className="inverted-btn" onClick={toggleCommentsModal}>
        {t('comments.count', { no: commentsCount })}
      </button>

      <AuctionCommentsModal
        key={auctionId}
        auctionId={auctionId}
        commentsCount={commentsCount}
        isOpened={commentsModalOpened}
        close={toggleCommentsModal}
        onCommentAdded={incrementCommentsCount}
      />
    </>
  )
})
