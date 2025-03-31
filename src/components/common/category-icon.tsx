import { Category } from '@/core/domain/category'
import Image from 'next/image'
import { Icon, ValidIconSize } from './icon'

export const CategoryIcon = (props: { category?: Category; size?: number }) => {
  const { category, size = 24 } = props
  if (!category) {
    return null
  }

  if (category.asset) {
    const serverURL = process.env.NEXT_PUBLIC_SERVER_URL
    return (
      <Image
        alt="Category image"
        src={`${serverURL}/${category.asset!.path}`}
        height={size}
        width={size}
      />
    )
  }

  if (category.remoteIconUrl) {
    return <Image alt="Category image" src={category.remoteIconUrl} height={size} width={size} />
  }

  if (category.icon) {
    return <Icon type={`categories/${category.icon}`} size={size as ValidIconSize} />
  }

  return null
}
