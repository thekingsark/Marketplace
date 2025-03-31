import { RateLimiter } from 'limiter'

export const limiter = new RateLimiter({
  tokensPerInterval: 30,
  interval: 'second',
})
