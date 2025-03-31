import { Icon } from '@/components/common/icon'

export const NoResultsAvailable = (props: { title: string; height?: number }) => {
  const { title, height } = props
  return (
    <div className="no-results-container gap-4" style={{ ...(height ? { height } : {}) }}>
      <Icon type="logo" size={80} />
      <span>{title}</span>
    </div>
  )
}
