import { Icon } from './icon'

export const NoDataCard = (props: { title: string; description?: string; background?: string }) => {
  const { title, description, background } = props
  return (
    <div className="no-data-card-root w-100" style={{ ...(background ? { background } : {}) }}>
      <div className="no-data-title-root">
        <Icon type="logo" size={32} />
        <span>{title}</span>
      </div>
      {description && <span>{description}</span>}
    </div>
  )
}
