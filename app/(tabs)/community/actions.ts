"use server";

import db from "@/lib/db";
import getSession from "@/lib/session/get-session";

export async function getInitChats(){
  const session = await getSession();
  if(!session.id) return [];

  const chats = await db.chatRoom.findMany({
    where: {
      type: "GROUP" //그룹채팅방만 출력
    },
    select: {
      id: true,
      name: true,
      type: true,
      updated_at: true,
      chatRoomUsers: {
        select: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true
            }
          }
        }
      },
      _count: {
        select: {
          chatRoomUsers: true, //참여자 수
          messages: {
            where: {
              type: "USER"
            }
          }
        }
      }
    },
    take: 1,
    orderBy: {
      updated_at: "desc"
    }
  });

  return chats.map(room => {
    const isGroupChat = room.type === "GROUP";

    const participants = room.chatRoomUsers.map(user=>({
      id: user.user.id,
      username: user.user.username,
      avatar: user.user.avatar
    }));

    const title = room.name || "Circle";

    //채팅방 참여 여부
    const isParticipating = participants.some(p => p.id === session.id);

    return{
      id: room.id,
      title,
      isGroupChat,
      participants,
      participantCount: room._count.chatRoomUsers,
      messageCount: room._count.messages,
      updated_at: room.updated_at,
      isParticipating
    }
  });
}

export async function getMoreChats(page: number){
  const session = await getSession();
  if(!session.id) return [];

  const chats = await db.chatRoom.findMany({
    where: {
      type: "GROUP" //그룹채팅방만 출력
    },
    select: {
      id: true,
      name: true,
      type: true,
      updated_at: true,
      chatRoomUsers: {
        select: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true
            }
          }
        }
      },
      _count: {
        select: {
          chatRoomUsers: true,
          messages: {
            where: {
              type: "USER"
            }
          }
        }
      }
    },
    skip: page * 1,
    take: 1,
    orderBy: {
      updated_at: "desc"
    }
  });

  return chats.map(room => {
    const isGroupChat = room.type === "GROUP";

    const participants = room.chatRoomUsers.map(user=>({
      id: user.user.id,
      username: user.user.username,
      avatar: user.user.avatar
    }));

    const title = room.name || "Circle";

    //채팅방 참여 여부
    const isParticipating = participants.some(p => p.id === session.id);

    return{
      id: room.id,
      title,
      isGroupChat,
      participants,
      participantCount: room._count.chatRoomUsers,
      messageCount: room._count.messages,
      updated_at: room.updated_at,
      isParticipating
    }
  });
}

export async function getInitPosts(){
  const posts = await db.post.findMany({
    select:{
      id: true,
      title: true,
      description: true,
      views: true,
      photo: true,
      created_at: true,
      user: {
        select: {
          id: true,
          username: true,
          avatar: true
        }
      },
      _count: {//좋아요, 댓글 갯수 가져오기
        select: {
          comments: true,
          likes: true
        }
      }
    },
    take: 1,
    orderBy:{
      created_at: 'desc'
    }
  });
  return posts;
};

export async function getMorePosts(page: number){
  const posts = await db.post.findMany({
    select:{
      id: true,
      title: true,
      description: true,
      views: true,
      photo: true,
      created_at: true,
      user: {
        select: {
          id: true,
          username: true,
          avatar: true
        }
      },
      _count: {//좋아요, 댓글 갯수 가져오기
        select: {
          comments: true,
          likes: true
        }
      }
    },
    skip: page * 1,
    take: 1,
    orderBy:{
      created_at: 'desc'
    }
  });
  return posts;
};