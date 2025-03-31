import { ChatMessage, ChatMessageStatus } from "@/core/domain/chat-message";
import { observer } from "mobx-react-lite";
import { Icon } from "../common/icon";

export const ChatMessageStatusIcon = observer((props: { message: ChatMessage }) => {
  const { message } = props
  return <div>
    {message.status === ChatMessageStatus.pending ? <div className="loader-wrapper">
      <Icon type="loading" size={12} />
    </div> : message.status === ChatMessageStatus.error ? <Icon type='chat/error' size={12} /> :
      <Icon type='chat/tick' size={12} />
    }
  </div>
})