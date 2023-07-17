import { prisma } from '@/prisma/db'
import { initTRPC } from '@trpc/server'
import { CreateNextContextOptions } from '@trpc/server/adapters/next'

export const createContext = async (opts: CreateNextContextOptions) => {
  return {
    prisma
  };
};

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<typeof createContext>().create()

// Base router and procedure helpers
export const router = t.router
export const procedure = t.procedure
