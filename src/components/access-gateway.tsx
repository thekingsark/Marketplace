'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import Preloader from './common/preloader'

export type MiddlewareFunction = (
  props?: MiddleWareProps,
  router?: AppRouterInstance
) => Promise<unknown>
export type MiddlewareFunctions = Array<MiddlewareFunction | MiddlewareAction>

export interface MiddlewareAction {
  exec: MiddlewareFunction
  cleanup?: () => void
}
export interface AccessGatewayProps extends MiddleWareProps {
  middlewares: MiddlewareFunctions
  children: React.ReactNode
  workInBackground?: boolean
}

export interface MiddleWareProps {
  data?: string
  allowAnonymous?: boolean
  serverWSUrl?: string
}

const executeAsyncMiddlewareChain = async (
  middlewares: MiddlewareFunctions,
  props?: MiddleWareProps,
  router?: AppRouterInstance
) => {
  for (let i = 0; i < middlewares.length; i += 1) {
    const middleware = middlewares[i]
    const shouldContinue =
      typeof middleware === 'function'
        ? await middleware(props, router)
        : await middleware.exec(props, router)

    if (!shouldContinue) {
      return false
    }
  }
  return true
}

export const AccessGateway: React.FC<AccessGatewayProps> = (props) => {
  const [chainExecuted, setChainExecuted] = useState(false)
  const middlewaresInExecution = useRef(false)
  const router = useRouter()

  useEffect(() => {
    if (!middlewaresInExecution.current) {
      middlewaresInExecution.current = true
      executeAsyncMiddlewareChain(props.middlewares, props, router).then((value) =>
        setChainExecuted(value)
      )
    }
  })

  if (props.workInBackground) {
    return props.children as React.ReactElement
  }

  if (!chainExecuted) {
    return <Preloader />
  }

  return props.children as React.ReactElement
}
