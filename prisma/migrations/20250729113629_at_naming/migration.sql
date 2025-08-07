/*
  Warnings:

  - You are about to drop the column `joinedAt` on the `ChatRoomUser` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChatRoomUser" (
    "chatRoomId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "joined_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',

    PRIMARY KEY ("chatRoomId", "userId"),
    CONSTRAINT "ChatRoomUser_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ChatRoomUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ChatRoomUser" ("chatRoomId", "role", "userId") SELECT "chatRoomId", "role", "userId" FROM "ChatRoomUser";
DROP TABLE "ChatRoomUser";
ALTER TABLE "new_ChatRoomUser" RENAME TO "ChatRoomUser";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
