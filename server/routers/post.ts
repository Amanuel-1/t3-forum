import { apiResponse } from "@/lib/utils"
import { procedure, router } from "@/server/trpc"
import { z } from 'zod'

export const postRouter = router({
  all: procedure
    .query(async ({ ctx }) => {
      const posts = await ctx.prisma.post.findMany({
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              username: true,
              id: true
            }
          },
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      if (!posts.length) return apiResponse({
        status: 404,
        message: 'Belum ada postingan sama sekali bre'
      })

      return apiResponse({
        status: 200,
        message: 'Semua postingan'
      }, posts)
    }),
  store: procedure
    .input(z.object({
      content: z.string().min(3).max(255),
      userId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { content, userId } = input
      const createdPost = await ctx.prisma.post.create({
        data: {
          content, userId
        }
      })

      if(!createdPost) return apiResponse({
        status: 400,
        message: 'Postingan lu gk bisa di buat sekarang bre'
      })

      return apiResponse({
        status: 201,
        message: 'Postingan lu berhasil gua buat'
      }, createdPost)
    })
})
