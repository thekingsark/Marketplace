import { ChatMessage } from "@/core/domain/chat-message"

export const ChatLocationMessage = (params: { message: ChatMessage }) => {
  const { message } = params

  if (!message.latitude || !message.longitude) {
    return null
  }

  return <div>
    <iframe
      title="location"
      className="w-100 mt-10"
      style={{ borderRadius: 6 }}
      src={`https://www.google.com/maps?q=${message.latitude},${message.longitude}&z=15&output=embed`}
    ></iframe>
  </div>
}