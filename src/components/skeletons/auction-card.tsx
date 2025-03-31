import { useScreenIsBig } from '@/hooks/use-screen-is-big'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

export const AuctionCardSkeleton = () => {
  const screenIsBig = useScreenIsBig()

  return (
    <SkeletonTheme
      baseColor="var(--background_4)"
      highlightColor="var(--background_1)"
      borderRadius="0.5rem"
      duration={2}
    >
      <div>
        <div className="d-flex flex-column justify-content-center w-100">
          <Skeleton height={screenIsBig ? 240 : 140} width={'100%'}></Skeleton>
          <Skeleton width={'100%'} height={screenIsBig ? 28 : 24} />
          <Skeleton width={'100%'} height={screenIsBig ? 28 : 24} />
          <div className={`${screenIsBig ? 'm-0' : 'mt-10'}`}></div>
          <Skeleton width={100} height={screenIsBig ? 28 : 24} />
          <Skeleton width={'100%'} height={screenIsBig ? 30 : 28} />
        </div>
      </div>
    </SkeletonTheme>
  )
}
