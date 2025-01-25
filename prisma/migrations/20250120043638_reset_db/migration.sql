/*
  Warnings:

  - A unique constraint covering the columns `[userId,chapterId]` on the table `userprogress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `UserProgress_userId_chapterId_key` ON `userprogress`(`userId`, `chapterId`);
