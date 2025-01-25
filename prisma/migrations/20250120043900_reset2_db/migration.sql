/*
  Warnings:

  - A unique constraint covering the columns `[userId,courseId]` on the table `purchase` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Purchase_userId_courseId_key` ON `purchase`(`userId`, `courseId`);
