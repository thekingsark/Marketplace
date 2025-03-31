'use client'
import { EmojiClickData, EmojiStyle, Theme } from 'emoji-picker-react'
import React, { Suspense } from 'react'

const Picker = React.lazy(() => import('emoji-picker-react'))

interface EmojiPickerProps {
  onSelect: (emoji: EmojiClickData) => void
}

export const EmojiPicker = (props: EmojiPickerProps) => {
  const { onSelect } = props

  return (
    <Suspense fallback={<div>...</div>}>
      <Picker onEmojiClick={onSelect} theme={Theme.DARK} emojiStyle={EmojiStyle.NATIVE} />
    </Suspense>
  )
}

export default EmojiPicker
