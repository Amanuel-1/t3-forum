import { apiResponse, excludeFields } from '@/lib/utils'
import { procedure, router } from '@/server/trpc'
import { z } from 'zod'

export const userRouter = router({
  profile: procedure
    .input(z.object({
      username: z.string()
    }))
    .query(async ({ input, ctx }) => {
      const { username } = input
      const userExist = await ctx.prisma.user.findUnique({
        where: { username }
      })

      if (!userExist) return apiResponse({
        status: 404,
        message: 'Profil lu ilang bre!'
      })

      return apiResponse({
        status: 200,
        message: 'Ada nih'
      }, excludeFields(userExist, ['password']))
    })
})
