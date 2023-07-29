import { z } from 'zod'
import { procedure, router } from '../trpc'
import { authRouter } from './auth'
import { postRouter } from './post'
import { userRouter } from './user'

export const appRouter = router({
  hello: procedure
  .input(z.string())
  .query(({ input }) => {
    return `Hello ${input}`
  }),
  auth: authRouter,
  post: postRouter,
  user: userRouter
})

export type AppRouter = typeof appRouter
