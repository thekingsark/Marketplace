import { useTranslation } from '@/app/i18n/client'
import { Account } from '@/core/domain/account'
import useGlobalContext from '@/hooks/use-context'
import { NoResultsAvailable } from '../../common/no-results'
import { useEffect, useRef, useState } from 'react'
import { FollowController } from '@/core/controllers/follow'
import { FollowerCardSkeleton } from '@/components/skeletons/follower'
import Link from 'next/link'
import { AccountInfo } from '@/components/account/info'
import { AccountSpecificActions } from '../specific-actions'
import ReactPaginate from 'react-paginate'
import { useScreenIsBig } from '@/hooks/use-screen-is-big'

const ITEMS_PER_PAGE = 10

export const AccountFollowingSection = (props: {
  account: Account
  handleFollowDone?: (accountId: string) => void
  handleUnfollowDone?: (accountId: string) => void
}) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)
  const { account, handleFollowDone, handleUnfollowDone } = props

  const [currentPage, setCurrentPage] = useState(0)
  const [followingsLoading, setFollowingsLoading] = useState(true)

  const [following, setFollowing] = useState<Record<string, Account[]>>({})
  const initDoneRef = useRef(false)
  const screenIsBig = useScreenIsBig()

  const followingRootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchFollowers = async () => {
      setFollowingsLoading(true)

      const followersData = await FollowController.getFollowing(account.id, 0, ITEMS_PER_PAGE)
      setFollowing({ 0: followersData })
      setCurrentPage(0)
      setFollowingsLoading(false)
      initDoneRef.current = true
    }

    fetchFollowers()
  }, [account])

  const handlePageChange = async (page: number) => {
    if (following[page]) {
      setCurrentPage(page)
      return
    }

    setFollowingsLoading(true)
    setCurrentPage(page)

    const newAuctions = await FollowController.getFollowing(account.id, page, ITEMS_PER_PAGE)

    setFollowing((prev) => ({ ...prev, [page]: newAuctions }))
    setFollowingsLoading(false)

    setTimeout(() => {
      if (followingRootRef.current) {
        followingRootRef.current.scrollIntoView({
          behavior: 'instant',
          block: 'start',
        })
      }
    }, 0)
  }

  if (!account.followingCount) {
    return <NoResultsAvailable title={t('profile.no_following', { name: account.name })} />
  }

  const maxPages = Math.ceil(account.followingCount / ITEMS_PER_PAGE)
  const minBetweenPerPageAndExisting = Math.min(ITEMS_PER_PAGE, account.followingCount)
  const arrayOfFollowing = Array.from({ length: minBetweenPerPageAndExisting }, (_, index) => index)

  return (
    <div ref={followingRootRef}>
      <div className="mb-10">
        <span>{t('info.you_see_page', { page: currentPage + 1, total: maxPages })}</span>
      </div>
      <div className="d-flex flex-column gap-2">
        {(!initDoneRef.current || followingsLoading) &&
          arrayOfFollowing.map((index) => {
            return <FollowerCardSkeleton key={index} />
          })}
        {following[currentPage]?.map((follower, index) => {
          return (
            <div key={index} className="account-follower-root">
              <Link href={`/account/${follower.id}`}>
                <AccountInfo account={follower} />
              </Link>
              <AccountSpecificActions
                fullWidth={!screenIsBig}
                account={follower}
                handleFollowDone={() => {
                  handleFollowDone?.(follower.id)
                }}
                handleUnfollowDone={() => {
                  handleUnfollowDone?.(follower.id)
                }}
              />
            </div>
          )
        })}
      </div>
      <div className="d-flex justify-content-center mt-20 mb-10">
        <ReactPaginate
          nextLabel=">"
          previousLabel="<"
          onPageChange={(page) => {
            handlePageChange(page.selected)
          }}
          pageRangeDisplayed={2}
          marginPagesDisplayed={1}
          pageCount={maxPages}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          renderOnZeroPageCount={null}
        />
      </div>
    </div>
  )
}
