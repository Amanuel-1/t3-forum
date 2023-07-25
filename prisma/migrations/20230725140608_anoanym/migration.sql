/*
  Warnings:

  - You are about to drop the column `isAnonymous` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "isAnonymous",
ADD COLUMN     "anonymousId" TEXT;

-- CreateTable
CREATE TABLE "Anonymous" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "Anonymous_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Anonymous_userId_key" ON "Anonymous"("userId");

-- AddForeignKey
ALTER TABLE "Anonymous" ADD CONSTRAINT "Anonymous_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_anonymousId_fkey" FOREIGN KEY ("anonymousId") REFERENCES "Anonymous"("id") ON DELETE SET NULL ON UPDATE CASCADE;
