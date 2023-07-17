import * as trpcNext from '@trpc/server/adapters/next'
import { appRouter } from '@/server/routers/_app'
import { prisma } from '@/prisma/db';

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({
    prisma
  })
});
