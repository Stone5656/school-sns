/*
  Warnings:

  - You are about to drop the `Blogs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TagBlogs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `blogId` on the `Comments` table. All the data in the column will be lost.
  - You are about to drop the column `blogId` on the `Mentions` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Scraps` table. All the data in the column will be lost.
  - You are about to drop the column `followedId` on the `UserRelationships` table. All the data in the column will be lost.
  - Added the required column `artifactId` to the `Comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `artifactId` to the `Mentions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `followeeId` to the `UserRelationships` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Blogs";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TagBlogs";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Artifacts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "summaryByAI" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Artifacts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TagArticles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "artifactId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TagArticles_artifactId_fkey" FOREIGN KEY ("artifactId") REFERENCES "Artifacts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TagArticles_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tags" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Comments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "artifactId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comments_artifactId_fkey" FOREIGN KEY ("artifactId") REFERENCES "Artifacts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Comments" ("body", "createdAt", "id", "updatedAt", "userId") SELECT "body", "createdAt", "id", "updatedAt", "userId" FROM "Comments";
DROP TABLE "Comments";
ALTER TABLE "new_Comments" RENAME TO "Comments";
CREATE TABLE "new_Mentions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "artifactId" TEXT NOT NULL,
    "mentionedUserId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Mentions_artifactId_fkey" FOREIGN KEY ("artifactId") REFERENCES "Artifacts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Mentions_mentionedUserId_fkey" FOREIGN KEY ("mentionedUserId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Mentions" ("createdAt", "id", "mentionedUserId") SELECT "createdAt", "id", "mentionedUserId" FROM "Mentions";
DROP TABLE "Mentions";
ALTER TABLE "new_Mentions" RENAME TO "Mentions";
CREATE TABLE "new_Scraps" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "parentId" TEXT,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Scraps_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Scraps" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Scraps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Scraps" ("body", "createdAt", "id", "parentId", "title", "updatedAt", "userId") SELECT "body", "createdAt", "id", "parentId", "title", "updatedAt", "userId" FROM "Scraps";
DROP TABLE "Scraps";
ALTER TABLE "new_Scraps" RENAME TO "Scraps";
CREATE TABLE "new_UserRelationships" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "followerId" TEXT NOT NULL,
    "followeeId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserRelationships_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserRelationships_followeeId_fkey" FOREIGN KEY ("followeeId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserRelationships" ("createdAt", "followerId", "id") SELECT "createdAt", "followerId", "id" FROM "UserRelationships";
DROP TABLE "UserRelationships";
ALTER TABLE "new_UserRelationships" RENAME TO "UserRelationships";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
