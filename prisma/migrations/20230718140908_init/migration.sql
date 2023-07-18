-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_anonymousId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_userId_fkey";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_anonymousId_fkey" FOREIGN KEY ("anonymousId") REFERENCES "Anonymous"("id") ON DELETE CASCADE ON UPDATE CASCADE;
