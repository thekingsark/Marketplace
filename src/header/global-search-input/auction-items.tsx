import { Auction } from '@/core/domain/auction'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import DefaultAssetImage from '@/../public/assets/img/default-item.jpeg'
import Image from 'next/image'
import { observer } from 'mobx-react-lite'
import useGlobalContext from '@/hooks/use-context'

export const GlobalSearchAuctionItem = observer(
  (props: { auction: Auction; onClick?: () => void }) => {
    const { auction } = props
    const router = useRouter()
    const globalContext = useGlobalContext()

    const handleClick = () => {
      if (props.onClick) {
        props.onClick()
      }

      router.push(`/auction/${auction.id}`)
    }

    const auctionCategory = globalContext.appCategories.find(
      (category) => category.id === auction.mainCategoryId
    )

    const renderAuctionAsset = () => {
      if (!auction.assets?.length) {
        const { defaultProductImageUrl } = globalContext.appSettings

        return (
          <Image
            alt="auction asset"
            fill
            src={defaultProductImageUrl?.length ? defaultProductImageUrl : DefaultAssetImage.src}
            style={{ objectFit: 'cover', borderRadius: 4 }}
          />
        )
      }
      const serverBaseURL = process.env.NEXT_PUBLIC_SERVER_URL
      const firstAsset = auction.assets[0]

      return (
        <Image
          alt="auction asset"
          fill
          src={`${serverBaseURL}/assets/${firstAsset.path}`}
          style={{ objectFit: 'cover', borderRadius: 4 }}
        />
      )
    }

    const renderAuction = () => {
      return (
        <div className="global-search-item-root gap-2">
          <div className="pos-rel" style={{ height: 50, width: 50 }}>
            {renderAuctionAsset()}
          </div>
          <div>
            <p className="m-0">
              {auction.title.length > 45 ? auction.title.substring(0, 45) + '...' : auction.title}
            </p>
            <span className="secondary-color lw-light">{auctionCategory?.name['en']}</span>
          </div>
        </div>
      )
    }

    if (props.onClick) {
      return <div onClick={handleClick}>{renderAuction()}</div>
    }

    return <Link href={`/auction/${auction.id}`}>{renderAuction()}</Link>
  }
)
