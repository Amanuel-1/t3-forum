import { router } from "@/server/trpc"
import { z } from "zod"
import { procedure } from "../trpc"
import { genSaltSync, hashSync } from "bcrypt-ts"

export const authRouter = router({
  register: procedure
    .input(z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string()
    }))
    .query(async ({ input, ctx }) => {
      const { name, email, password } = input
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) return "Sudah ada"

      const passwordHash = hashSync(password, genSaltSync(10))

      const createdUser = await ctx.prisma.user.create({
        data: {
          name, email, password: passwordHash
        }
      })

      if(!createdUser) return "Gagal Registrasi"

      return "Berhasil Registrasi"
    })
})
