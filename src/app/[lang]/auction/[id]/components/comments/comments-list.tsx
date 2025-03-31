import { useTranslation } from '@/app/i18n/client'
import { CustomModal } from '@/components/common/custom-modal'
import { Icon } from '@/components/common/icon'
import useGlobalContext from '@/hooks/use-context'
import { Comment } from '@/core/domain/comment'
import { useEffect, useRef, useState } from 'react'
import { NoResultsAvailable } from '@/components/common/no-results'
import { CommentsController } from '@/core/controllers/comments'
import CommentItem from './comment'
import { generateNameForAccount } from '@/utils'

export const AuctionCommentsModal = (props: {
  isOpened: boolean
  auctionId: string
  commentsCount: number
  close: () => void
  onCommentAdded?: () => void
}) => {
  const { isOpened, commentsCount, auctionId, close } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const [replyingComment, setReplyingComment] = useState<Comment | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [sendInProgress, setSendInProgress] = useState(false)
  const [comment, setComment] = useState('')

  const [initialCommentsLoaded, setInitialCommentsLoaded] = useState(false)

  const commentTextareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    const container = document.querySelector('.comments-root')
    if (!container) {
      return
    }

    container.scrollTop = container.scrollHeight
  }

  useEffect(() => {
    scrollToBottom()
  }, [isOpened])

  useEffect(() => {
    const fetchInitialComments = async () => {
      try {
        const fetched = await CommentsController.getComments(auctionId)
        const sortedAsceding = fetched.sort((a, b) => {
          return (
            new Date(a.createdAt ?? new Date()).getTime() -
            new Date(b.createdAt ?? new Date()).getTime()
          )
        })

        setComments(sortedAsceding)
      } catch (error) {
        console.error('Error getting comments:', error)
      } finally {
        setInitialCommentsLoaded(true)
      }
    }
    fetchInitialComments()
  }, [auctionId])

  const handleSendComment = async () => {
    if (!comment?.length || sendInProgress) {
      return
    }
    setSendInProgress(true)

    try {
      const createdComment = await CommentsController.create(
        comment,
        auctionId,
        replyingComment?.id
      )
      if (!createdComment) {
        return
      }

      if (!replyingComment?.id) {
        setComments([...comments, createdComment])
      } else {
        const newComments = comments.map((c) => {
          if (c.id === replyingComment.id) {
            c.replies = c.replies ? [...c.replies, createdComment] : [createdComment]
          }
          return c
        })
        setComments(newComments)
      }

      setComment('')

      props.onCommentAdded?.()
    } catch (error) {
      console.error('Error creating comment:', error)
    } finally {
      setSendInProgress(false)

      if (!replyingComment?.id) {
        setTimeout(() => {
          scrollToBottom()
        }, 100)
      }
    }
  }

  const renderFooter = () => {
    return (
      <>
        {replyingComment && (
          <p className='mb-10 secondary-color'>
            {t('comments.replying_to', { name: generateNameForAccount(replyingComment.account!) })}
          </p>
        )}
        <div className="footer d-flex align-items-center gap-2">
          <div className="position-relative d-flex flex-grow-1">
            <textarea
              name="description"
              id="description"
              ref={commentTextareaRef}
              className="send-comment-textarea"
              value={comment}
              maxLength={2000}
              disabled={sendInProgress}
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  e.stopPropagation()
                  handleSendComment()
                  setComment('')
                  if (commentTextareaRef.current) {
                    commentTextareaRef.current.style.height = 'auto'
                  }
                }
              }}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t('comments.leave_message')}
            />
          </div>
          <button
            className="btn fill-btn send-comment-btn"
            onClick={handleSendComment}
            disabled={!comment?.length || sendInProgress}
          >
            {sendInProgress ? <Icon type="generic/loading" /> : <Icon type="chat/send-message" />}
          </button>
          <style jsx>{`
            .send-comment-textarea {
              width: 100%;
              height: auto;
              border: 1px solid var(--font_1);
              border-radius: 6px;
              background: var(--background_4);
              color: var(--font_1);
              font-size: 16px;
              padding: 8px 20px;
              padding-right: 80px;
              outline: none;
              resize: none;
              border: 1px solid var(--separator);
              box-shadow: none;
              min-height: 45px;
              max-height: 90px;
            }
            .send-comment-btn {
              height: 45px;
              width: 45px;
              padding: 0;
              margin: 0;
              display: flex;
              transition: all 0s;
              align-items: center;
              justify-content: center;
              border: 1px solid var(--separator);
            }
          `}</style>
        </div>
      </>
    )
  }

  return (
    <CustomModal
      open={isOpened}
      onClose={close}
      styles={{
        modal: {
          maxWidth: '850px',
          maxHeight: '85vh',
          minWidth: '40vw',
          backgroundColor: 'var(--background_2)',
        },
        overlay: {
          background: 'rgba(0, 0, 0, 0.5)',
        },
      }}
      classNames={{
      }}
      closeIcon={<Icon type="generic/close-filled" />}
      center
    >
      <h4>{t('comments.count', { no: commentsCount })}</h4>

      <div className="d-flex flex-column gap-2" style={{ maxHeight: '75vh', overflow: 'auto' }}>
        {!initialCommentsLoaded && (
          <div className="loading-container">
            <Icon type="generic/loading" />{' '}
          </div>
        )}

        {comments.length > 0 && (
          <div className="comments-root mt-20">
            {comments.map((comment) => {
              return (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  isSelected={replyingComment?.id === comment.id}
                  handleClick={() => {
                    if (replyingComment?.id === comment.id) {
                      return
                    }
                    setReplyingComment(null)
                  }}
                  handleReply={() => {
                    if (replyingComment?.id === comment.id) {
                      setReplyingComment(null)
                      return
                    }
                    setReplyingComment(comment)
                    commentTextareaRef.current?.focus()
                  }}
                />
              )
            })}
          </div>
        )}

        {initialCommentsLoaded && !comments.length && (
          <div className="mt-30">
            <NoResultsAvailable title={t('comments.be_the_first')} />
          </div>
        )}

        <div className="p-16 rounded" style={{ background: 'var(--background_4)' }}>
          {renderFooter()}
        </div>
      </div>
      <style jsx>{`
        .comments-root {
          padding: 16px 0;
          border-radius: 6px;
          background: var(--background_4);
          max-height: 70vh;
          overflow: auto;
        }
        .loading-container {
          width: 100%;
          height: 300px;
          background: var(--background_4);
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </CustomModal>
  )
}
