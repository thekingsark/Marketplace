import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

export const AccountCardSkeleton = () => {
  return (
    <SkeletonTheme
      baseColor="var(--background_1)"
      highlightColor="var(--background_4)"
      borderRadius="0.5rem"
      duration={2}
    >
      <div className="d-flex flex-column justify-content-center w-100">
        <div className="d-flex align-items-center gap-2">
          <Skeleton circle height={60} width={60}></Skeleton>
          <div>
            <Skeleton width={220} height={24} />
            <Skeleton width={180} height={24} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  )
}
