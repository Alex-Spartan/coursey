-- DropForeignKey
ALTER TABLE `userprogress` DROP FOREIGN KEY `UserProgress_chapterId_fkey`;

-- AddForeignKey
ALTER TABLE `UserProgress` ADD CONSTRAINT `UserProgress_chapterId_fkey` FOREIGN KEY (`chapterId`) REFERENCES `Chapter`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
