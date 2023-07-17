import { z } from 'zod'
import { procedure, router } from '../trpc'
import { authRouter } from './auth'

export const appRouter = router({
  hello: procedure
  .input(z.string())
  .query(({ input }) => {
    return `Hello ${input}`
  }),
  auth: authRouter
})

export type AppRouter = typeof appRouter
