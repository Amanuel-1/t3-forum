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
      email: z.string().email(),
      password: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      const { name, email, password } = input
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) return apiResponse({
        status: 403,
        message: "Email yang dipake buat daftar udah ada!"
      })

      const passwordHash = hashSync(password, genSaltSync(10))

      const createdUser = await ctx.prisma.user.create({
        data: {
          name, email, password: passwordHash
        }
      })

      if (!createdUser) return apiResponse({
        status: 400,
        message: "Registrasi yang barusan gagal bre"
      })

      return apiResponse({
        status: 201,
        message: "Selamat lu udah jadi bagian dari kita! Menuju halaman utama..."
      }, excludeFields(createdUser, ['password']))
    }),
  login: procedure
    .input(z.object({
      email: z.string().email(),
      password: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input
      const existingUser = await ctx.prisma.user.findUnique({
        where: {
          email
        }
      })

      if (!existingUser) return apiResponse({
        status: 404,
        message: "Akun belum terdaftar"
      })

      const isValidPassword = compareSync(password, existingUser.password)

      if (!isValidPassword) return apiResponse({
        status: 403,
        message: "Email dan Password tidak cocok"
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
