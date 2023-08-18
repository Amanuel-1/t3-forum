import { apiResponse } from "@/lib/utils"
import { procedure, router } from "@/server/trpc"
import { z } from "zod"

export const commentRouter = router({
  byPostId: procedure
    .input(z.string())
    .query(async ({ ctx, input: postId }) => {
      const existingComments = await ctx.prisma.comment.findMany({
        where: {
          postId
        },
        select: {
          id: true,
          text: true,
          User: {
            select: {
              username: true,
              image: true
            }
          },
          createdAt: true
        }
      })

      if(!existingComments.length) return apiResponse({
        status: 404,
        message: 'Belom ada komentar'
      })

      return apiResponse({
        status: 200,
        message: 'Ada ni komentar nya'
      }, existingComments)
    }),
  store: procedure
    .input(z.object({
      postId: z.string(),
      userId: z.string(),
      commentText: z.string().min(1)
    }))
    .mutation(async ({ ctx, input: { postId, userId, commentText } }) => {
      const insertedComment = await ctx.prisma.comment.create({
        data: {
          postId, text: commentText, userId
        }
      })

      if(!insertedComment) return apiResponse({
        status: 400,
        message: 'Gagal komentarin postingan ini'
      })

      return apiResponse({
        status: 200,
        message: 'Berhasil berkomentar'
      }, insertedComment)
    })
})
