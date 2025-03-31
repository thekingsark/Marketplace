import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { BaseRating } from '../reviews/rating'

export const ReviewCardSkeleton = () => {
  return (
    <SkeletonTheme
      baseColor="var(--background_1)"
      highlightColor="var(--background_4)"
      borderRadius="0.5rem"
      duration={2}
    >
      <div
        className="d-flex flex-column align-items-center justify-content-between p-16"
        style={{ background: 'var(--background_4)', borderRadius: 6 }}
      >
        <div className="d-flex justify-content-between w-100 review-item">
          <div className="d-flex align-items-center gap-2">
            <Skeleton circle height={40} width={40}></Skeleton>
            <Skeleton width={220} height={24} />
          </div>
          <div className="mt-10 text-center" style={{ width: 200 }}>
            <BaseRating initialValue={0} inactiveColor="var(--background_1)" readonly />
          </div>
        </div>
        <div className="w-100">
          <Skeleton height={24} />
        </div>
        <div className="mt-10">
          <Skeleton width={170} height={24} />
        </div>
      </div>
    </SkeletonTheme>
  )
}
