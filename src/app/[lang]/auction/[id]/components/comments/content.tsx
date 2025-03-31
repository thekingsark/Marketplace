import { useTranslation } from '@/app/i18n/client'
import { Icon } from '@/components/common/icon'
import { CommentsController } from '@/core/controllers/comments'
import { Comment } from '@/core/domain/comment'
import useGlobalContext from '@/hooks/use-context'
import { useState } from 'react'

export const CommentContent = (props: { comment: Comment }) => {
  const { comment } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const [translationInProgress, setTranslationInProgress] = useState(false)
  const [showTranslatedContent, setShowTranslatedContent] = useState(false)
  const [translatedContent, setTranslatedContent] = useState('')

  const handleTranslate = async () => {
    if (translationInProgress) {
      return
    }

    if (showTranslatedContent) {
      setShowTranslatedContent(false)
      return
    }

    if (!showTranslatedContent && translatedContent?.length) {
      setShowTranslatedContent(true);
      return;
    }

    setTranslationInProgress(true)

    try {
      const translatedContent = await CommentsController.translate(comment.id, currentLanguage)
      if (!translatedContent) {
        return
      }

      setTranslatedContent(translatedContent)
      setShowTranslatedContent(true)
    } catch (error) {
      console.error('Error translating comment:', error)
    } finally {
      setTranslationInProgress(false)
    }

  }

  return (
    <div className="content-root">
      <span>{showTranslatedContent ? translatedContent : comment.content} </span>

      <span className="translate" onClick={handleTranslate}>{translationInProgress ? <Icon type="generic/loading" /> : t(showTranslatedContent ? 'generic.see_original' : 'generic.translate')}</span>
      <style jsx>{`
        .content-root {
          padding: 16px;
          background: var(--background_2);
          border-radius: 0px 16px 16px;
          display: inline-flex;
          flex-direction: column;
        }
        .translate {
          font-size: 14px;
          font-weight: 300;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
