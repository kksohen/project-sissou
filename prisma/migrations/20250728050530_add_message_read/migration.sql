/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ChatRoomInvitation` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "MessageRead" (
    "messageId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "read_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("messageId", "userId"),
    CONSTRAINT "MessageRead_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MessageRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChatRoomInvitation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "chatRoomId" TEXT NOT NULL,
    "inviterId" INTEGER NOT NULL,
    "inviteeId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChatRoomInvitation_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ChatRoomInvitation_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ChatRoomInvitation_inviteeId_fkey" FOREIGN KEY ("inviteeId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ChatRoomInvitation" ("chatRoomId", "id", "inviteeId", "inviterId", "status") SELECT "chatRoomId", "id", "inviteeId", "inviterId", "status" FROM "ChatRoomInvitation";
DROP TABLE "ChatRoomInvitation";
ALTER TABLE "new_ChatRoomInvitation" RENAME TO "ChatRoomInvitation";
CREATE UNIQUE INDEX "ChatRoomInvitation_chatRoomId_inviteeId_key" ON "ChatRoomInvitation"("chatRoomId", "inviteeId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
