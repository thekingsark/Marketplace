import { NextResponse, NextRequest } from 'next/server'
import acceptLanguage from 'accept-language'
import { fallbackLng, languages } from './app/i18n/settings'
import { SESSION_COOKIE_NAME } from './constants'

acceptLanguage.languages(languages)

export const config = {
  matcher: '/:lang*',
}

const cookieName = 'i18next'
const revalidatePath = '/api/revalidate'

const SIGN_IN_PROTECTED_ROUTES = [
  'auction-create',
  'auction-update',
  'profile',
  'recommendations',
  'last-seen',
]

export function middleware(req: NextRequest) {
  const session = req.cookies.get(SESSION_COOKIE_NAME)?.value || ''

  const routeNeedsToBeProtected = SIGN_IN_PROTECTED_ROUTES.some((route) => {
    return req.nextUrl.pathname.includes(route)
  })
  if (!session && routeNeedsToBeProtected) {
    const absoluteURL = new URL('/', req.nextUrl.origin)
    return NextResponse.redirect(absoluteURL.toString())
  }

  if (req.nextUrl.pathname.startsWith('/notifications-sw.')) {
    return NextResponse.next()
  }

  if (req.nextUrl.pathname.endsWith('sitemap.xml')) {
    return NextResponse.next()
  }

  if (req.nextUrl.pathname.startsWith(`/api`)) {
    if (
      !req.headers.get('referer')?.includes(process.env.APP_URL || '') &&
      req.nextUrl.pathname !== revalidatePath
    ) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.next()
  }

  if (req.nextUrl.pathname.indexOf('icon') > -1 || req.nextUrl.pathname.indexOf('chrome') > -1) {
    return NextResponse.next()
  }

  if (req.nextUrl.pathname.indexOf('well-known') > -1) {
    return NextResponse.next()
  }

  const searchParams = new URLSearchParams(req.nextUrl.search)

  let lng
  const response = NextResponse.next()

  if (searchParams.has('lang')) {
    lng = searchParams.get('lang')
    if (lng) {
      response.cookies.set(cookieName, lng)
    }
  }

  if (!lng && req.cookies.has(cookieName)) {
    lng = req.cookies.get(cookieName)?.value
  }

  // Fallback to Accept-Language header or default language
  if (!lng) {
    lng = acceptLanguage.get(req.headers.get('Accept-Language')) || fallbackLng
    if (lng) {
      response.cookies.set(cookieName, lng)
    }
  }

  if (!lng && req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer') || '')
    const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`))

    if (lngInReferer) {
      lng = lngInReferer
    }
  }

  if (!lng) {
    lng = fallbackLng
  }

  response.cookies.set(cookieName, lng)

  // Redirect if lng in path is not supported
  if (
    !languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith('/_next') &&
    !req.nextUrl.pathname.startsWith('/api') &&
    !req.nextUrl.pathname.startsWith('/images')
  ) {
    const queryParams = new URLSearchParams(req.nextUrl.search)

    const redirectUrl = new URL(`/${lng}${req.nextUrl.pathname}`, req.url)
    redirectUrl.search = queryParams.toString()
    return NextResponse.redirect(redirectUrl)
  }

  return response
}
