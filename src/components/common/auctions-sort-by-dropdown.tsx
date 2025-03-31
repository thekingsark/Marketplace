import { useTranslation } from '@/app/i18n/client'
import CustomSelect from '@/components/common/custom-select'
import { Icon } from '@/components/common/icon'
import { AuctionsSortBy } from '@/core/repositories/auction'
import useGlobalContext from '@/hooks/use-context'
import { memo } from 'react'

interface AuctionsSortByDropdownProps {
  selected?: AuctionsSortBy
  withLabel?: boolean
  hideOnSmallerScreens?: boolean
  handleSelect: (options: AuctionsSortBy) => void
}

export const AuctionsSortByDropdown = memo((props: AuctionsSortByDropdownProps) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)
  const { selected, withLabel = true, hideOnSmallerScreens = false, handleSelect } = props

  return (
    <div
      className={`d-none d-lg-block auctions-filter-item ${
        hideOnSmallerScreens ? 'd-none d-lg-block' : ''
      }`}
    >
      {withLabel && <span className="secondary-color">{t('info.sort_auctions')}</span>}
      <CustomSelect
        options={[
          {
            id: 0,
            option: t('generic.newest'),
            icon: <Icon type="sort/hourglass-top" />,
          },
          {
            id: 1,
            option: t('generic.oldest'),
            icon: <Icon type="sort/hourglass-bottom" />,
          },
          {
            id: 2,
            option: t('generic.ascending_price'),
            icon: <Icon type="sort/sort-ascending" />,
          },
          {
            id: 3,
            option: t('generic.descending_price'),
            icon: <Icon type="sort/sort-descending" />,
          },
        ]}
        defaultCurrent={selected ?? 0}
        onChange={(item) => {
          handleSelect(item.id as AuctionsSortBy)
        }}
        name="sort auctions"
        className="w-100"
      />
    </div>
  )
})

AuctionsSortByDropdown.displayName = 'AuctionsSortByDropdown'
