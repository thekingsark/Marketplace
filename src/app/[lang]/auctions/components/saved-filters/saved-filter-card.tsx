import { Icon } from '@/components/common/icon'
import { FilterItem } from '@/core/domain/filter'
import React from 'react'

interface FilterItemCardProps {
  item: FilterItem
  onClick?: () => void
  handleDelete?: () => void
}

export const FilterItemCard = (props: FilterItemCardProps) => {
  const { item, onClick, handleDelete } = props

  return (
    <div className="saved-filter-item-card d-inline-flex align-items-center" onClick={onClick}>
      <span>{item.name}</span>
      <button
        className="ml-20 d-flex"
        onClick={(ev) => {
          ev.stopPropagation()
          ev.preventDefault()
          handleDelete?.()
        }}
        aria-label={'Delete filter'}
      >
        <Icon type={'generic/close-filled'} size={16} />
      </button>
    </div>
  )
}
