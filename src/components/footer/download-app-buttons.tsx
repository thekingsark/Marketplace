import { MOBILE_APP_LINKS } from '@/constants'
import useGlobalContext from '@/hooks/use-context'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'

export const DownloadAppButtons = observer((props: { asRow?: boolean }) => {
  const globalContext = useGlobalContext()

  const { asRow = false } = props
  return (
    <ul className={`${asRow ? 'd-flex gap-2' : ''}`}>
      <li className={`${asRow ? 'w-100' : ''}`}>
        <Link
          target="_blank"
          href={globalContext.appSettings.googlePlayLink ?? MOBILE_APP_LINKS.GOOGLE_PLAY_LINK}
        >
          <button
            aria-label="Google play button"
            className="mobile-store-btn w-100 gap-2"
            style={{ display: 'flex' }}
          >
            <span className="mr-[10px] d-flex align-items-center justify-content-center">
              <svg
                width={34}
                height={34}
                viewBox="0 0 34 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 28.9958V4.9125C4 4.07667 4.48167 3.34 5.19 3L19.1442 16.9542L5.19 30.9083C4.48167 30.5542 4 29.8317 4 28.9958ZM23.5642 21.3742L8.32083 30.1858L20.3483 18.1583L23.5642 21.3742ZM28.31 15.2683C28.7917 15.6508 29.1458 16.2458 29.1458 16.9542C29.1458 17.6625 28.8342 18.2292 28.3383 18.6258L25.0942 20.4958L21.5525 16.9542L25.0942 13.4125L28.31 15.2683ZM8.32083 3.7225L23.5642 12.5342L20.3483 15.75L8.32083 3.7225Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span className="text-left ">
              <span>Google Play</span>
            </span>
          </button>
        </Link>
      </li>
      <li className={`${asRow ? 'w-100' : ''}`}>
        <Link
          target="_blank"
          href={globalContext.appSettings.appStoreLink ?? MOBILE_APP_LINKS.APP_STORE_LINK}
        >
          <button
            aria-label="App store button"
            className="mobile-store-btn w-100 gap-2"
            style={{ display: 'flex' }}
          >
            <span className="mr-[10px] d-flex align-items-center justify-content-center">
              <svg
                width={34}
                height={34}
                viewBox="0 0 34 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M26.5058 27.625C25.33 29.3817 24.0833 31.0959 22.185 31.1242C20.2867 31.1667 19.6775 30.005 17.5242 30.005C15.3567 30.005 14.6908 31.0959 12.8917 31.1667C11.0358 31.2375 9.63333 29.2967 8.44333 27.5825C6.02083 24.0834 4.165 17.6375 6.65833 13.3025C7.89083 11.1492 10.1008 9.78921 12.495 9.74671C14.3083 9.71837 16.0367 10.9792 17.1558 10.9792C18.2608 10.9792 20.3575 9.46337 22.5533 9.69004C23.4742 9.73254 26.0525 10.0584 27.71 12.495C27.5825 12.58 24.6358 14.3084 24.6642 17.8925C24.7067 22.1709 28.4183 23.6017 28.4608 23.6159C28.4183 23.715 27.8658 25.6559 26.5058 27.625ZM18.4167 4.95837C19.4508 3.78254 21.165 2.89004 22.5817 2.83337C22.7658 4.49087 22.1 6.16254 21.1083 7.35254C20.1308 8.55671 18.5158 9.49171 16.9292 9.36421C16.7167 7.73504 17.51 6.03504 18.4167 4.95837Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span className="text-left">
              <span>App Store</span>
            </span>
          </button>
        </Link>
      </li>
    </ul>
  )
})
