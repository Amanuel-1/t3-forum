import { createNextPageApiHandler } from 'uploadthing/next-legacy'
import { uploadFileRouter } from '@/server/uploadthing'

const handler = createNextPageApiHandler({
  router: uploadFileRouter
})

export default handler
