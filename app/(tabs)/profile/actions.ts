"use server";
import db from "@/lib/db";
import { getImgPlaceholder } from "@/lib/Image/util-img";
import getSession from "@/lib/session/get-session";
import { getThumbnailImage } from "@/lib/utils";
import { redirect } from "next/navigation";

export async function getUser(id: number){
  const user = await db.user.findUnique({
    where: {
      id
    },
    select: {
      avatar: true,
      username: true,
      email: true,
      // password: true,
      phone: true,
      id: true,
    }
  });

  return user;
}

export async function logOutAction(){
  const session = await getSession();
  session.destroy();
  redirect("/");
};

//사용자가 좋아요를 누른 게시글
export async function getUserLikedPosts(userId: number, page: number){
  const liked = await db.like.findMany({
    where: {
      userId
    },
    select: {
      created_at: true,
      post: {
        select: {
          id: true,
          photo: true
        }
      }
    },
    skip: page * 9,
    take: 9,
    orderBy: {
      created_at: "desc"
    }
  });

  const likedWithBlur = await Promise.all(
    liked.map(async (like)=>{
      const thumbnailUrl = `${getThumbnailImage(like.post.photo)}/public`;

      return{
        id: like.post.id,
        photo: like.post.photo,
        liked_at: like.created_at,
        photoBlur: await getImgPlaceholder(thumbnailUrl)
      };
    })
  );

  return likedWithBlur;
}

//사용자가 댓글을 남긴 게시글
export async function getUserCommentedPosts(userId: number, page: number){
  const commented = await db.comment.findMany({
    where: {
      userId
    },
    select: {
      id: true,
      payload: true,
      created_at: true,
      post: {
        select: {
          id: true,
          title: true,
          photo: true
        }
      }
    },
    skip: page * 9,
    take: 9,
    orderBy: {
      created_at: "desc"
    }
  });

  const commentedWithBlur = await Promise.all(
    commented.map(async (comment)=>{
      const thumbnailUrl = `${getThumbnailImage(comment.post.photo)}/public`;

      return{
        id: comment.post.id,
        title: comment.post.title,
        photo: comment.post.photo,
        payload: comment.payload,
        commented_at: comment.created_at,
        photoBlur: await getImgPlaceholder(thumbnailUrl)
      };
    })
  );

  return commentedWithBlur;
}

export async function getInitUserChats(){
  const session = await getSession();
  if(!session.id) return [];

  const chats = await db.chatRoom.findMany({
    where: {
      chatRoomUsers: {
        some: {
          userId: session.id
        }
      }
    },
    select: {
      id: true,
      name: true,
      type: true,
      updated_at: true,
      chatRoomUsers: {
        select: {
          role: true,
          user: {
            select: {
              id: true,
              username: true,
              avatar: true
            }
          }
        }
      },
      messages: {
        where: {
          type: "USER"
        },
        select: {
          id: true,
          payload: true,
          created_at: true,
          userId: true,
          type: true,
          message_read: {
            where: {
              userId: session.id
            },
          }
        },
        orderBy: {
          created_at: "desc"
        },
        take: 1 //가장 최신 메시지만
      },
      _count: {
        select: {
          chatRoomUsers: true,
          messages: {
            where: {
              AND: [
                {
                  type: "USER"
                },
                {
                  userId: {
                    not: session.id
                  }
                },
                {
                  message_read: {
                    none: {
                      userId: session.id
                    }
                  }
                }
              ]
            }
          }
        }
      }
    },
    take: 9,
    orderBy: {
      updated_at: "desc"
    }
  });

  const chatWithBlur = await Promise.all(
    chats.map(async room =>{
      const isGroupChat = room.type === "GROUP";
      const participants = room.chatRoomUsers.map(user=>user.user);

      //group chat
      const host = isGroupChat ? room.chatRoomUsers.find(p => p.role === "HOST")?.user : null;
      //1:1 chat
      const otherUser = !isGroupChat ? participants.find(p => p.id !== session.id) : null;

      let title = room.name || "Circle";
      if(room.type === "DIRECT"){
        const otherUser = participants.find(p => p.id !== session.id);
        title = otherUser?.username || "Unknown";
      };

      const lastMsg = room.messages[0]||null;
      const lastMsgText = lastMsg?.payload || "";
      const lastMsgTime = lastMsg?.created_at || room.updated_at;

      const unreadCount = room._count.messages;

      const [avatarBlur, otherAvatarBlur] = await Promise.all([
        host?.avatar ? getImgPlaceholder(host.avatar) : Promise.resolve(""),
        otherUser?.avatar ? getImgPlaceholder(otherUser.avatar) : Promise.resolve("")
      ]);

      return{
        id: room.id,
        title,
        isGroupChat,
        participants,
        host,
        otherUser,
        participantCount: room._count.chatRoomUsers,
        messageCount: room._count.messages,
        updated_at: room.updated_at,
        lastMsg: lastMsgText,
        lastMsgTime,
        unreadCount,
        isParticipating: true,
        avatarBlur,
        otherAvatarBlur
      };
    })
  );

  return chatWithBlur;
}

export async function getMoreUserChats(page: number){
  const session = await getSession();
  if(!session.id) return [];

  const chats = await db.chatRoom.findMany({
    where: {
      chatRoomUsers: {
        some: {
          userId: session.id
        }
      }
    },
    select: {
      id: true,
      name: true,
      type: true,
      updated_at: true,
      chatRoomUsers: {
        select: {
          role: true,
          user: {
            select: {
              id: true,
              username: true,
              avatar: true
            }
          }
        }
      },
      messages: {
        where: {
          type: "USER"
        },
        select: {
          id: true,
          payload: true,
          created_at: true,
          userId: true,
          type: true,
          message_read: {
            where: {
              userId: session.id
            },
          }
        },
        orderBy: {
          created_at: "desc"
        },
        take: 1 //가장 최신 메시지만
      },
      _count: {
        select: {
          chatRoomUsers: true,
          messages: {
            where: {
              AND: [
                {
                  type: "USER"
                },
                {
                  userId: {
                    not: session.id
                  }
                },
                {
                  message_read: {
                    none: {
                      userId: session.id
                    }
                  }
                }
              ]
            }
          }
        }
      }
    },
    skip: page * 9,
    take: 9,
    orderBy: {
      updated_at: "desc"
    }
  });

  const chatWithBlur = await Promise.all(
    chats.map(async room =>{
      const isGroupChat = room.type === "GROUP";
      const participants = room.chatRoomUsers.map(user=>user.user);

      //group chat
      const host = isGroupChat ? room.chatRoomUsers.find(p => p.role === "HOST")?.user : null;
      //1:1 chat
      const otherUser = !isGroupChat ? participants.find(p => p.id !== session.id) : null;

      let title = room.name || "Circle";
      if(room.type === "DIRECT"){
        const otherUser = participants.find(p => p.id !== session.id);
        title = otherUser?.username || "Unknown";
      };

      const lastMsg = room.messages[0]||null;
      const lastMsgText = lastMsg?.payload || "";
      const lastMsgTime = lastMsg?.created_at || room.updated_at;

      const unreadCount = room._count.messages;

      const [avatarBlur, otherAvatarBlur] = await Promise.all([
        host?.avatar ? getImgPlaceholder(host.avatar) : Promise.resolve(""),
        otherUser?.avatar ? getImgPlaceholder(otherUser.avatar) : Promise.resolve("")
      ]);

      return{
        id: room.id,
        title,
        isGroupChat,
        participants,
        host,
        otherUser,
        participantCount: room._count.chatRoomUsers,
        messageCount: room._count.messages,
        updated_at: room.updated_at,
        lastMsg: lastMsgText,
        lastMsgTime,
        unreadCount,
        isParticipating: true,
        avatarBlur,
        otherAvatarBlur
      };
    })
  );

  return chatWithBlur;
}