import { Auction } from '@/core/domain/auction'
import useGlobalContext from '@/hooks/use-context'
import Image from 'next/image'
import DefaultAssetImage from '@/../public/assets/img/default-item.jpeg'
import { useRouter } from 'next/navigation'

export const ChatAuctionInfo = (props: { auction: Auction }) => {
  const { auction } = props
  const globalContext = useGlobalContext()
  const categories = globalContext.appCategories
  const currentLanguage = globalContext.currentLanguage

  const router = useRouter()

  const goToAuction = () => {
    router.push(`/auction/${auction.id}`)
    router.refresh()
  }

  const getSubCategoryName = () => {
    const auctionCategory = categories.find((category) => category.id === auction.mainCategoryId)
    const auctionSubCategory = auctionCategory!.subcategories!.find(
      (category) => category.id === auction.subCategoryId
    )
    return auctionSubCategory?.name[currentLanguage] ?? ''
  }

  const renderAuctionAsset = () => {
    const assets = auction.assets
    const serverBaseURL = process.env.NEXT_PUBLIC_SERVER_URL

    if (!assets?.length) {
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

    const firstAsset = assets[0]
    return (
      <Image
        alt="auction asset"
        fill
        src={`${serverBaseURL}/assets/${firstAsset.path}`}
        style={{ objectFit: 'cover', borderRadius: 4 }}
      />
    )
  }

  return (
    <div className="chat-auction-info-root" onClick={goToAuction}>
      <div className="pos-rel" style={{ height: 45, width: 45 }}>
        {renderAuctionAsset()}
      </div>
      <div className='chat-auction-texts-wrapper'>
        <span className='chat-auction-text'>{auction.title}</span>
        <p className="m-0 secondary-color chat-auction-text">{getSubCategoryName()}</p>
      </div>

      <style jsx>{`
        .chat-auction-info-root {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--background_2);
          padding: 8px;
          border-radius: 6px;
          max-width: 80%;
          cursor: pointer;
        }
        .chat-auction-texts-wrapper {
          overflow: hidden;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: start;
          justify-content: center;
        }
        .chat-auction-text {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      `}</style>
    </div>
  )
}
