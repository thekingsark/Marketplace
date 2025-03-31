'use client'

import { createSession, removeSession } from '@/app/actions/auth-actions'
import { AuthController } from '@/core/controllers/auth'
import { RequestMaker } from '@/core/services/request-maker'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

// This page is only created for the purpose of
// refreshing the auth token when it expires and it is
// needed on server side.

const RefreshAuthTokenComponent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const authUser = await AuthController.getAuthUserAsync()
        console.log('am auth user')

        if (!authUser) {
          throw new Error('No auth user')
        }

        const newAccessToken = await authUser.getIdToken()
        if (!newAccessToken) {
          throw new Error('No auth token')
        }

        await removeSession()
        await createSession(newAccessToken)
        RequestMaker.setAuthToken(newAccessToken)

        const redirectUrl = searchParams.get('redirect') as string
        const decodedPath = decodeURIComponent(redirectUrl)
        router.replace(`/${decodedPath}`)
      } catch (error) {
        console.log('Could not refresh auth token', error)
        router.replace('/')
      }
    }
    refreshToken()
  }, [])

  return <div></div>
}

const RefreshTokenPage = () => (
  <Suspense>
    <RefreshAuthTokenComponent />
  </Suspense>
)

export default RefreshTokenPage
