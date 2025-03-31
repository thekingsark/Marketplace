import React from 'react'
import { useTranslation } from 'react-i18next'
import { Comment } from '@/core/domain/comment'
import Link from 'next/link'
import Image from 'next/image'
import { generateNameForAccount } from '@/utils'
import { FormattedDate } from '@/components/common/formatted-date'
import { CommentContent } from './content'
import { CommentReply } from './reply'

interface CommentItemProps {
  isSelected: boolean
  comment: Comment
  handleClick?: () => void
  handleReply: () => void
}

const CommentItem = (props: CommentItemProps) => {
  const { isSelected, comment, handleClick } = props
  const { t } = useTranslation()

  const renderMessageReplies = () => {
    return (
      <div>{comment.replies?.map((reply) => <CommentReply key={reply.id} reply={reply} />)}</div>
    )
  }

  const handleReply = (ev: React.MouseEvent) => {
    ev.stopPropagation()
    props.handleReply()
  }

  return (
    <div
      className={`w-100 p-2 comment-item ${isSelected ? 'selected-comment' : ''}`}
      onClick={() => { handleClick?.() }}
    >
      <div className="d-flex align-items-start gap-2">
        <Link href={`/account/${comment.account!.id}`}>
          <Image
            src={comment.account!.picture}
            height={40}
            width={40}
            alt="account picture"
            style={{ borderRadius: '50%' }}
          />
        </Link>
        <div className="w-100">
          <div className="d-flex align-items-center justify-content-between w-100">
            <Link href={`/account/${comment.account!.id}`}>
              <span className="message-sender-name">
                {generateNameForAccount(comment.account!)}
              </span>
            </Link>
            <span className="fw-light message-date-container">
              <FormattedDate date={comment!.createdAt!} format="D MMM, H:mm" />
            </span>
          </div>

          <CommentContent comment={comment} />

          {!comment.parentCommentId && (
            <div className="d-flex justify-content-between mt-2">
              <span className="cursor-pointer secondary-color" onClick={handleReply}>
                {t('comments.reply')}
              </span>
            </div>
          )}
          {comment.replies && comment.replies.length > 0 && renderMessageReplies()}
        </div>
      </div>
      <style jsx>{`
        .comment-item {
          padding: 16px !important;
        }
        .selected-comment {
          background: var(--background_1);
        }
      `}</style>
    </div>
  )
}

export default CommentItem
