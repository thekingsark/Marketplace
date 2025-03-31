import { initializeControllers } from '@/middlewares/init-controllers'
import { AccessGateway } from './access-gateway'
import { BackToTop } from './common/back-to-top'
import { Footer } from './footer'
import { Header } from './header'
import { ReactNode } from 'react'
import { withSocketConnection } from '@/middlewares/socket-connection'
import { HeaderOffsetFixer } from './common/header-offset-fixer'

interface PageWrapperProps {
  children: ReactNode
}

export const PageWrapper = ({ children }: PageWrapperProps) => {
  return (
    <>
      {
        <>
          <AccessGateway
            middlewares={[initializeControllers, withSocketConnection]}
            allowAnonymous={true}
            workInBackground
            serverWSUrl={process.env.NEXT_PUBLIC_SERVER_WS_URL}
          >
            <BackToTop />
            <Header />
            <HeaderOffsetFixer />
            <div className="main-content">{children}</div>
            <Footer />
          </AccessGateway>
        </>
      }
    </>
  )
}
