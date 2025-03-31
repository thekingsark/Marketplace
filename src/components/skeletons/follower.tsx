import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { AccountCardSkeleton } from './account-info'

export const FollowerCardSkeleton = (props: { smallScreen?: boolean }) => {
  const { smallScreen = false } = props
  return (
    <SkeletonTheme
      baseColor="var(--background_1)"
      highlightColor="var(--background_4)"
      borderRadius="0.5rem"
      duration={2}
    >
      <div
        className="d-flex account-follower-root"
        style={{
          height: smallScreen ? 179 : 92,
          padding: '16px 24px',
          background: 'var(--background_4)',
          borderRadius: 6,
        }}
      >
        <AccountCardSkeleton />

        <div className="d-flex justify-content-end gap-2 w-100">
          <div style={{ width: smallScreen ? '100%' : 112 }}>
            <Skeleton height={45} />
          </div>
          <div style={{ width: smallScreen ? '100%' : 170 }}>
            <Skeleton height={45} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  )
}
