/*
  Warnings:

  - You are about to drop the column `postId` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `like` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `like` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `savedpost` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `savedpost` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `user` table. All the data in the column will be lost.
  - You are about to alter the column `role` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to drop the `account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verificationtoken` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id,post_id]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,post_id]` on the table `SavedPost` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `author_id` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `post_id` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `post_id` to the `Like` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Like` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author_id` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Made the column `tags` on table `post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `category` on table `post` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `post_id` to the `SavedPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `SavedPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `account` DROP FOREIGN KEY `Account_userId_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_postId_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_userId_fkey`;

-- DropForeignKey
ALTER TABLE `like` DROP FOREIGN KEY `Like_postId_fkey`;

-- DropForeignKey
ALTER TABLE `like` DROP FOREIGN KEY `Like_userId_fkey`;

-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `savedpost` DROP FOREIGN KEY `SavedPost_postId_fkey`;

-- DropForeignKey
ALTER TABLE `savedpost` DROP FOREIGN KEY `SavedPost_userId_fkey`;

-- DropForeignKey
ALTER TABLE `session` DROP FOREIGN KEY `Session_userId_fkey`;

-- DropIndex
DROP INDEX `Like_userId_postId_key` ON `like`;

-- DropIndex
DROP INDEX `SavedPost_userId_postId_key` ON `savedpost`;

-- AlterTable
ALTER TABLE `comment` DROP COLUMN `postId`,
    DROP COLUMN `userId`,
    ADD COLUMN `author_id` INTEGER NOT NULL,
    ADD COLUMN `post_id` INTEGER NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `like` DROP COLUMN `postId`,
    DROP COLUMN `userId`,
    ADD COLUMN `post_id` INTEGER NOT NULL,
    ADD COLUMN `user_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `post` DROP COLUMN `authorId`,
    ADD COLUMN `author_id` INTEGER NOT NULL,
    ADD COLUMN `published` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `tags` JSON NOT NULL,
    MODIFY `category` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `savedpost` DROP COLUMN `postId`,
    DROP COLUMN `userId`,
    ADD COLUMN `post_id` INTEGER NOT NULL,
    ADD COLUMN `user_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `emailVerified`,
    DROP COLUMN `image`,
    ADD COLUMN `password` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `role` ENUM('ADMIN', 'EDITOR', 'READER') NOT NULL DEFAULT 'READER';

-- DropTable
DROP TABLE `account`;

-- DropTable
DROP TABLE `session`;

-- DropTable
DROP TABLE `verificationtoken`;

-- CreateIndex
CREATE UNIQUE INDEX `Like_user_id_post_id_key` ON `Like`(`user_id`, `post_id`);

-- CreateIndex
CREATE UNIQUE INDEX `SavedPost_user_id_post_id_key` ON `SavedPost`(`user_id`, `post_id`);

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SavedPost` ADD CONSTRAINT `SavedPost_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SavedPost` ADD CONSTRAINT `SavedPost_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
