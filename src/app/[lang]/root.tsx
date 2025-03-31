'use client'

import { ThemeProvider } from 'next-themes'
import NextTopLoader from 'nextjs-toploader'

export const RootApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider defaultTheme="dark">
      {children}
      <NextTopLoader
        color="#2785ff"
        initialPosition={0.08}
        crawlSpeed={200}
        height={2}
        crawl={true}
        showSpinner={false}
        easing="ease"
        speed={200}
        shadow="0 0 10px #2299DD,0 0 5px #2299DD"
        template='<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
        zIndex={1600}
        showAtBottom={false}
      />
    </ThemeProvider>
  )
}
