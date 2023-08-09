import { getAuthUser } from '@/lib/utils'
import { createUploadthing, type FileRouter } from 'uploadthing/next-legacy'

const f = createUploadthing()
export const uploadFileRouter = {
  imageUploader: f({ image: { maxFileSize: '2MB' } })
    .middleware(async (ctx) => {
      // const user = await getAuthUser(ctx.req.cookies.token!)
      //
      // if(!user) throw new Error('Lu belom login bre')

      return {
        userId: 'hehe'
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload file buat user ' + metadata.userId)
      console.log('File Url ' + file.url)
    })
} satisfies FileRouter

export type uploadFileRouter = typeof uploadFileRouter
