import { router } from "@/server/trpc"
import { z } from "zod"
import { procedure } from "../trpc"
import { compareSync, genSaltSync, hashSync } from "bcrypt-ts"
import { SignJWT } from "jose"
import { nanoid } from "nanoid"
import { apiResponse, excludeFields, getJwtSecret } from "@/lib/utils"

export const authRouter = router({
  register: procedure
    .input(z.object({
      name: z.string(),
      username: z.string().min(3).trim().toLowerCase(),
      password: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      let { name, username, password } = input
      username = username.split(' ').join('')

      const existingUser = await ctx.prisma.user.findUnique({
        where: {
          username
        }
      })

      if (existingUser) return apiResponse({
        status: 403,
        message: "Username yang dipake buat daftar udah ada!"
      })

      const passwordHash = hashSync(password, genSaltSync(10))

      const createdUser = await ctx.prisma.user.create({
        data: {
          name, username, password: passwordHash
        }
      })

      if (!createdUser) return apiResponse({
        status: 400,
        message: "Registrasi yang barusan gagal bre"
      })

      return apiResponse({
        status: 201,
        message: "Selamat lu udah jadi bagian dari kita!"
      }, excludeFields(createdUser, ['password']))
    }),
  login: procedure
    .input(z.object({
      username: z.string().min(3).trim().toLowerCase(),
      password: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      let { username, password } = input
      username = username.split(' ').join('')

      const existingUser = await ctx.prisma.user.findUnique({
        where: {
          username,
        }
      })

      if (!existingUser) return apiResponse({
        status: 404,
        message: "Akun belum terdaftar"
      })

      const isValidPassword = compareSync(password, existingUser.password)

      if (!isValidPassword) return apiResponse({
        status: 403,
        message: "Username dan Password tidak cocok"
      })

      const token = await new SignJWT(excludeFields(existingUser, ['password']))
        .setProtectedHeader({ alg: 'HS256' })
        .setJti(nanoid())
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(new TextEncoder().encode(getJwtSecret()))

      return apiResponse({
        status: 200,
        message: "Sip bang, Selamat berdiskusi!"
      }, { token })
    })
})
