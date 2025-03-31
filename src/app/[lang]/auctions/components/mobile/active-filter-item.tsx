import { Icon } from '@/components/common/icon'

interface ActiveFilterItemProps {
  icon?: React.ReactNode
  title: string
  onDelete: () => void
}

export const ActiveFilterItem = (props: ActiveFilterItemProps) => {
  const { icon, title, onDelete } = props

  return (
    <div className="active-filter-item gap-4">
      <div className="d-flex align-items-center justify-content-center gap-2">
        {icon}
        <span>{title}</span>
      </div>
      <button onClick={onDelete} className="d-flex align-items-center justify-content-center">
        <Icon type="generic/close-filled" size={18} />
      </button>
    </div>
  )
}
