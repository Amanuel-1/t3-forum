import { router } from "@/server/trpc"
import { z } from "zod"
import { procedure } from "../trpc"
import { compareSync, genSaltSync, hashSync } from "bcrypt-ts"
import jwt from 'jsonwebtoken'
import { excludeFields } from "@/lib/utils"

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

      if (existingUser) return "Email yang dipake buat daftar udah ada!"

      const passwordHash = hashSync(password, genSaltSync(10))

      const createdUser = await ctx.prisma.user.create({
        data: {
          name, email, password: passwordHash
        }
      })

      if (!createdUser) return "Registrasi yang barusan gagal bre"

      return "Selamat lu udah jadi bagian dari kita! Bentar..."
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

      if (!existingUser) return "Akun belum terdaftar"

      const isValidPassword = compareSync(password, existingUser.password)

      if (!isValidPassword) return "Email dan Password tidak cocok"

      const token = jwt.sign(excludeFields(existingUser, ['password']), process.env.JWT_SECRET!, {
        expiresIn: 60 * 60 * 24
      })

      return "Berhasil Login"
    })
})
