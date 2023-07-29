import { apiResponse, generateRandomStr } from "@/lib/utils"
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
          Anonymous: {
            select: {
              username: true,
              id: true
            }
          }
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
      isAnonymPost: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { content, userId, isAnonymPost } = input

      // Create Post anonymous-ly
      if (isAnonymPost) {
        const anonymousUserExist = await ctx.prisma.anonymous.findUnique({
          where: {
            userId
          }
        })

        if (!anonymousUserExist) {
          const createdAnonymousPost = await ctx.prisma.anonymous.create({
            data: {
              userId,
              username: 'si-' + generateRandomStr(4),
              Post: {
                create: { content }
              }
            },
          })

          if (!createdAnonymousPost) return apiResponse({
            status: 400,
            message: 'Gagal membuat postingan anonym bre :('
          })

          return apiResponse({
            status: 201,
            message: 'Berhasil membuat postingan anonym!'
          }, createdAnonymousPost)
        }

        const createdAnonymousPost = await ctx.prisma.post.create({
          data: {
            anonymousId: anonymousUserExist.id,
            content,
          }
        })

        if (!createdAnonymousPost) return apiResponse({
          status: 400,
          message: 'Gagal membuat postingan anonym bre :('
        })

        return apiResponse({
          status: 201,
          message: 'Berhasil membuat postingan anonym!'
        }, createdAnonymousPost)
      }

      // Create Post Publically
      const createdPost = await ctx.prisma.post.create({
        data: {
          content, userId
        }
      })

      if (!createdPost) return apiResponse({
        status: 400,
        message: 'Postingan lu gk bisa di buat sekarang bre'
      })

      return apiResponse({
        status: 201,
        message: 'Postingan lu berhasil gua buat'
      }, createdPost)
    }),
  user: procedure
    .input(z.object({
      username: z.string()
    }))
    .query(async ({ input, ctx }) => {
      const { username } = input
      const existingPost = await ctx.prisma.post.findMany({
        where: {
          user: { username }
        },
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
        }
      })

      if (!existingPost) return apiResponse({
        status: 404,
        message: 'Orang ini belom bikin postingan'
      })

      return apiResponse({
        status: 200,
        message: 'Ada ni bre'
      }, existingPost)
    })
})
