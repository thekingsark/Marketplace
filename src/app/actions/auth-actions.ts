'use server'

import { SESSION_COOKIE_NAME } from '@/constants'
import { cookies } from 'next/headers'

export async function createSession(uid: string) {
  const loadedCookies = await cookies()
  loadedCookies.set(SESSION_COOKIE_NAME, uid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // One day
    path: '/',
  })
}

export async function removeSession() {
  const loadedCookies = await cookies()
  loadedCookies.delete(SESSION_COOKIE_NAME)
}
