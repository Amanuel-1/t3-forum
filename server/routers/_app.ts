import { z } from 'zod'
import { procedure, router } from '../trpc'

export const appRouter = router({
  hello: procedure
  .input(z.string())
  .query(({ input }) => {
    return `Hello ${input}`
  })
});

export type AppRouter = typeof appRouter
