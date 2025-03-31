import { Comment } from "@/core/domain/comment";
import Link from "next/link";
import Image from "next/image";
import { FormattedDate } from "@/components/common/formatted-date";
import { generateNameForAccount } from "@/utils";
import { CommentContent } from "./content";

export const CommentReply = (props: { reply: Comment }) => {
  const { reply } = props

  return <div className="d-flex align-items-start gap-2 mt-20">
    <Link href={`/account/${reply.account!.id}`}>
      <Image
        src={reply.account!.picture}
        height={40}
        width={40}
        alt="account picture"
        style={{ borderRadius: '50%' }}
      />
    </Link>

    <div className="w-100">
      <div className="d-flex align-items-center justify-content-between w-100">
        <Link href={`/account/${reply.account!.id}`}>
          <span className="message-sender-name">{generateNameForAccount(reply.account!)}</span>
        </Link>
        <span className="fw-light message-date-container">
          <FormattedDate date={reply!.createdAt!} format="D MMM, H:mm" />
        </span>
      </div>
      <CommentContent comment={reply} />
    </div>
  </div>
}