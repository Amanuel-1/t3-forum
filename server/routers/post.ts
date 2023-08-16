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
          User: {
            select: {
              name: true,
              username: true,
              image: true,
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
  byId: procedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const postId = input

      const existingPost = await ctx.prisma.post.findUnique({
        where: { id: postId },
        select: {
          id: true,
          content: true,
          createdAt: true,
          User: {
            select: {
              id: true,
              name: true,
              image: true,
              username: true
            }
          },
          Anonymous: {
            select: {
              id: true,
              username: true
            }
          }
        }
      })

      if (!existingPost) return apiResponse({
        status: 404,
        message: 'Postingan gk ada'
      })

      return apiResponse({
        status: 200,
        message: 'Postingan ada ni'
      }, existingPost)
    }),
  byCategory: procedure
    .input(z.enum(["1", "2"]))
    .query(async ({ ctx, input }) => {
      const categoryId = input
      const existingPost = await ctx.prisma.post.findMany({
        where: {
          categoryId: +categoryId
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          User: {
            select: {
              id: true,
              name: true,
              image: true,
              username: true
            }
          },
          Anonymous: {
            select: {
              id: true,
              username: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      if (!existingPost) return apiResponse({
        status: 404,
        message: 'Duh g ada bre'
      }, [])

      return apiResponse({
        status: 200,
        message: 'Ada ni post nya'
      }, existingPost)
    }),
  store: procedure
    .input(z.object({
      content: z.string().min(3).max(255),
      userId: z.string(),
      isAnonymPost: z.boolean(),
      categoryId: z.enum(['1', '2']).default('1')
    }))
    .mutation(async ({ ctx, input }) => {
      const { content, userId, isAnonymPost, categoryId } = input

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
                create: {
                  content,
                  categoryId: +categoryId
                }
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
            categoryId: +categoryId
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
          content,
          userId,
          categoryId: +categoryId
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
      username: z.string(),
      includeAnonymous: z.boolean().default(false),
    }))
    .query(async ({ input, ctx }) => {
      const { username, includeAnonymous } = input

      const existingPost = await ctx.prisma.post.findMany({
        where: {
          User: { username },
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          User: {
            select: {
              name: true,
              username: true,
              image: true,
              id: true
            }
          },
        }
      })

      const data = []

      if (!existingPost) return apiResponse({
        status: 404,
        message: 'Orang ini belom bikin postingan'
      })

      if (includeAnonymous) {
        const existingAnonymousPost = await ctx.prisma.post.findMany({
          where: {
            Anonymous: {
              userId: existingPost[0].User?.id
            }
          },
          select: {
            id: true,
            content: true,
            createdAt: true,
            Anonymous: {
              select: {
                username: true,
                id: true
              }
            },
          }
        })

        if (!existingAnonymousPost) return apiResponse({
          status: 404,
          message: 'Orang ini belom bikin postingan'
        })

        data.push(...existingAnonymousPost)
      }

      data.push(...existingPost)

      return apiResponse({
        status: 200,
        message: 'Ada ni bre'
      }, data)
    }),
  edit: procedure
    .input(z.object({
      content: z.string().min(3).max(255),
      userId: z.string().nullable(),
      postId: z.string(),
      isAnonymPost: z.boolean(),
      categoryId: z.enum(['1', '2']).default('1')
    }))
    .mutation(async ({ ctx, input }) => {
      const { content, userId, postId, isAnonymPost, categoryId } = input

      // Jika pengen switch ke mode anonym
      if (isAnonymPost) {
        const anonymousPost = await ctx.prisma.post.findUnique({
          where: {
            id: postId
          }
        })

        // Kita cek apakah post tersebut udah anonym apa belom
        if (anonymousPost && !anonymousPost.anonymousId && anonymousPost.userId) { // Jika Belum anonym

          // Jika udah punya akun anonym
          let existingAnonymousUser = await ctx.prisma.anonymous.findUnique({
            where: {
              userId: anonymousPost.userId
            }
          })

          // Jika belom punya akun anonym
          if (!existingAnonymousUser) {
            const createdAnonymousUser = await ctx.prisma.anonymous.create({
              data: {
                userId: anonymousPost?.userId,
                username: 'si-' + generateRandomStr(4),
              },
            })

            if (!createdAnonymousUser) return apiResponse({
              status: 400,
              message: 'Gagal update postingan anonym bre :('
            })

            existingAnonymousUser = createdAnonymousUser
          }

          const updatedAnonymousPost = await ctx.prisma.post.update({
            where: { id: postId },
            data: {
              userId: null,
              anonymousId: existingAnonymousUser?.id,
              content,
              categoryId: +categoryId
            }
          })

          if (!updatedAnonymousPost) return apiResponse({
            status: 400,
            message: 'Gagal update postingan anonym bre :('
          })

          return apiResponse({
            status: 201,
            message: 'Berhasil meng-update postingan anonym!'
          }, updatedAnonymousPost)
        }

        // Jika sudah anonym
        const updatedAnonymousPost = await ctx.prisma.post.update({
          where: { id: postId },
          data: {
            userId: null,
            anonymousId: anonymousPost?.anonymousId,
            content,
            categoryId: +categoryId
          }
        })

        if (!updatedAnonymousPost) return apiResponse({
          status: 400,
          message: 'Gagal update postingan anonym bre :('
        })

        return apiResponse({
          status: 201,
          message: 'Berhasil meng-update postingan anonym!'
        }, updatedAnonymousPost)
      }

      // Update Post Publically
      let updatedPost = null

      // Jika userId nya gk null
      if (userId) {
        updatedPost = await ctx.prisma.post.update({
          where: { id: postId },
          data: {
            userId: userId,
            anonymousId: null, // Buat pastiin bakal jadi post public
            content,
            categoryId: +categoryId
          }
        })
      }

      // Jika userId nya null
      if (!userId) {
        const existingAnonymousPost = await ctx.prisma.post.findUnique({
          where: { id: postId },
          select: {
            Anonymous: {
              select: { userId: true }
            }
          }
        })

        if (!existingAnonymousPost) return apiResponse({
          status: 400,
          message: 'Gagal update postingan anonym bre :('
        })

        updatedPost = await ctx.prisma.post.update({
          where: { id: postId },
          data: {
            userId: existingAnonymousPost.Anonymous?.userId,
            anonymousId: null, // Buat pastiin bakal jadi post public
            content,
            categoryId: +categoryId
          }
        })
      }

      if (!updatedPost) return apiResponse({
        status: 400,
        message: 'Postingan lu gk bisa di update sekarang bre'
      })

      return apiResponse({
        status: 201,
        message: 'Postingan lu berhasil gua update'
      }, updatedPost)
    }),
  delete: procedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const postId = input

      const deletedPost = await ctx.prisma.post.delete({
        where: {
          id: postId
        }
      })

      if (!deletedPost) return apiResponse({
        status: 400,
        message: 'Post nya gk bisa di delete :('
      })

      return apiResponse({
        status: 200,
        message: 'Berhasil meng-delete postingan lu'
      }, deletedPost)
    })
})
