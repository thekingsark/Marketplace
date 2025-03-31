import Link from 'next/link'
import Image from 'next/image'
import logo from '../../../public/assets/logo.png'
import { APP_NAME } from '@/constants'
import useGlobalContext from '@/hooks/use-context'
import { memo } from 'react'

export const AppLogo = memo(() => {
  const globalContext = useGlobalContext()
  return (
    <Link className="logo" href="/">
      <Image width={42} height={42} src={logo} alt="logo-img" />
      {globalContext.appSettings.appName || APP_NAME}
    </Link>
  )
})

AppLogo.displayName = 'AppLogo'
