/*
  Warnings:

  - You are about to drop the `_ChatRoomToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "_ChatRoomToUser_B_index";

-- DropIndex
DROP INDEX "_ChatRoomToUser_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ChatRoomToUser";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ChatRoomUser" (
    "chatRoomId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',

    PRIMARY KEY ("chatRoomId", "userId"),
    CONSTRAINT "ChatRoomUser_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ChatRoomUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChatRoomInvitation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "chatRoomId" TEXT NOT NULL,
    "inviterId" INTEGER NOT NULL,
    "inviteeId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChatRoomInvitation_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ChatRoomInvitation_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ChatRoomInvitation_inviteeId_fkey" FOREIGN KEY ("inviteeId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChatRoom" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "type" TEXT NOT NULL DEFAULT 'DIRECT',
    "max_participants" INTEGER NOT NULL DEFAULT 2,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_ChatRoom" ("created_at", "id", "status", "updated_at") SELECT "created_at", "id", "status", "updated_at" FROM "ChatRoom";
DROP TABLE "ChatRoom";
ALTER TABLE "new_ChatRoom" RENAME TO "ChatRoom";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ChatRoomInvitation_chatRoomId_inviteeId_key" ON "ChatRoomInvitation"("chatRoomId", "inviteeId");
