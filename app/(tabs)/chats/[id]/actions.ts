"use server";
import db from "@/lib/db";
import getSession from "@/lib/session/get-session";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const SUPABASE_URL = "https://bewkgqugqvgmhnqdgejh.supabase.co";

const server = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function getRoomJoin(chatRoomId: string){
  const session = await getSession();
  if(!session.id) return null;

  try{
    const result = await db.$transaction(async(tx)=>{
      const chatRoom = await db.chatRoom.findUnique({
        where: {
          id: chatRoomId
        },
        include: {
          chatRoomUsers: {
            include: {
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
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  avatar: true
                }
              }
            },
            orderBy: {
              created_at: "asc"
            }
          },
          _count: {
            select: {
              chatRoomUsers: true
            }
          }
        }
      });

      if(!chatRoom) return null;

      const isParticipating = await tx.chatRoomUser.findUnique({
        where: {
          chatRoomId_userId: {
            chatRoomId,
            userId: session.id!
          }
        }
      });

      if(isParticipating) return {chatRoom, joined: false};

      if(chatRoom._count.chatRoomUsers >= chatRoom.max_participants){
        return {chatRoom: {...chatRoom, isFull: true}, joined: false};
      };

      await tx.chatRoomUser.create({
        data: {
          chatRoomId,
          userId: session.id!,
          role: "MEMBER"
        }
      });

      if(chatRoom.type === "GROUP"){
        const user=  await tx.user.findUnique({
          where: {
            id: session.id
          },
          select: {
            username: true
          }
        });

        const joinMsg = await tx.message.create({
          data: {
            chatRoomId,
            payload: `${user?.username}님이 들어왔습니다.`,
            type: "JOIN",
            userId: null
          }
        });

        await tx.chatRoom.update({
          where: {
            id: chatRoomId
          },
          data: {
            updated_at: new Date()
          }
        });

        return {chatRoom, joined: true, joinMsg, user};
      }

      return {chatRoom, joined: true};
    });

    if(!result) return null;

    if(result.joined && result.joinMsg && result.user){
      const channel = server.channel(`room-${chatRoomId}`);
      await channel.send({
        type: "broadcast",
        event: "system-message",
        payload: {
          id: result.joinMsg.id,
          payload: `${result.user.username}님이 들어왔습니다.`,
          type: "JOIN",
          created_at: new Date(),
          userId: null,
          user: null
        }
      });

      setTimeout(()=>channel.unsubscribe(), 1000);
    }

    const updateChatRoom = await db.chatRoom.findUnique({
      where: {
        id: chatRoomId
      },
      include: {
        chatRoomUsers: {
          include: {
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
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true
              }
            }
          },
          orderBy: {
            created_at: "asc"
          }
        }
      }
    });

    return updateChatRoom;

  }catch(error){
    console.error(error);
    return null;
  };
}

export async function markMsgAsRead(messageId: number, userId: number){
  await db.messageRead.upsert({
    where: {
      messageId_userId: {
        messageId,
        userId
      }
    },
    update: {
      read_at: new Date()
    },
    create: {
      messageId,
      userId
    }
  });
}

export async function markAllMsgAsRead(chatRoomId: string, userId: number){
  const messages = await db.message.findMany({
    where: {
      chatRoomId,
      userId: {
        not: userId
      }
    },
    select: {
      id: true
    }
  });

  for(const message of messages){
    await markMsgAsRead(message.id, userId);
  };
}

export async function getMessages(chatRoomId: string, userId: number){
  await markAllMsgAsRead(chatRoomId, userId);

  const messages = await db.message.findMany({
    where: { 
      chatRoomId 
    },
    include: {
      user: {
        select: {
          avatar: true,
          username: true
        }
      },
      message_read: {
        select: {
          userId: true,
          read_at: true
        }
      }
    },
    orderBy: {
      created_at: "asc"
    }
  });

  const participants = await db.chatRoomUser.findMany({
    where: {
      chatRoomId
    },
    select: {
      userId: true
    }
  });

  const participantId = participants.map(p => p.userId);

  const msgUnreadCount = messages.map(message => {
    const readUserId = message.message_read.map(read => read.userId);

    const otherParticipants = participantId.filter(id => id !== message.userId);
    const unreadCount = otherParticipants.filter(id => !readUserId.includes(id)).length;

    return{
      id: message.id,
      payload: message.payload,
      is_read: unreadCount === 0,
      created_at: message.created_at,
      userId: message.userId,
      user: message.user,
      unreadCount,
      type: message.type
    }
  });
  
  return msgUnreadCount;
}

export async function saveMessage(payload: string, chatRoomId: string){
  const session=  await getSession();
  if(!session.id) return;

  const newMessage = await db.message.create({
    data: {
      payload,
      chatRoomId,
      userId: session.id!
    },
    select: {
      id: true
    }
  });

  await markMsgAsRead(newMessage.id, session.id!);

  await db.chatRoom.update({
    where: {
      id: chatRoomId,
    },
    data: {
      updated_at: new Date()
    }
  });

  revalidatePath("/community");

  return newMessage;
}

export async function updateMsgRead(chatRoomId: string, userId: number){
  await markAllMsgAsRead(chatRoomId, userId);
}

export async function getUserProfile() {
  const session = await getSession();
  const user = await db.user.findUnique({
    where: { 
      id: session.id! 
    },
    select: {
      id: true,
      username: true,
      avatar: true
    }
  });
  return user;
}

export async function leaveChatRoom(chatRoomId: string){
  const session = await getSession();
  if(!session.id) return false;

  try{
    const chatRoomUser = await db.chatRoomUser.findUnique({
      where: {
        chatRoomId_userId: {
          chatRoomId,
          userId: session.id
        }
      }
    });

    if(!chatRoomUser) return false;

    const [user, chatRoom] = await Promise.all([
      db.user.findUnique({
        where: {
          id: session.id
        },
        select: {
          username: true
        }
      }),
      db.chatRoom.findUnique({
        where: {
          id: chatRoomId
        },
        select: {
          type: true
        }
      })
    ]);
    
    await db.chatRoomUser.delete({
      where: {
        chatRoomId_userId: {
          chatRoomId,
          userId: session.id
        }
      }
    });

    const remainUser = await db.chatRoomUser.count({
      where: {
        chatRoomId
      }
    });

    if(remainUser === 0){
      await db.chatRoom.delete({
        where: {
          id: chatRoomId
        }
      });
    }else{
      if(chatRoom?.type === "GROUP"){
        const leaveMsg = await db.message.create({
          data: {
            chatRoomId,
            payload: `${user?.username}님이 떠났습니다.`,
            type: "LEAVE",
            userId: null
          }
        });

        await db.chatRoom.update({
          where: {
            id: chatRoomId
          },
          data: {
            updated_at: new Date()
          }
        });

        const channel = server.channel(`room-${chatRoomId}`);
        await channel.send({
          type: "broadcast",
          event: "system-message",
          payload: {
            id: leaveMsg.id,
            payload: `${user?.username}님이 떠났습니다.`,
            type: "LEAVE",
            created_at: new Date(),
            userId: null,
            user: null
          }
        });

        setTimeout(()=>channel.unsubscribe(), 1000);
      }
    }

    revalidatePath("/community");

  }catch(error){
    console.error(error);
    return false;
  };

  redirect("/community");
}

/* videoCall */
export async function createVideoCall(chatRoomId: string, hostId: number){
  const session = await getSession();
  if(!session.id) return null;

  try{
    const call = await db.videoCall.create({
      data:{
        chatRoomId,
        hostId,
        status: "ACTIVE"
      }
    });

    const users = await db.chatRoomUser.findMany({
      where: {
        chatRoomId,
        userId: {
          not: hostId
        }
      }
    });

    for(const user of users){
      await db.participant.create({
        data: {
          callId: call.id,
          userId: user.userId,
          status: "INVITED"
        }
      });
    }

    return call;
  }catch(error){
    console.error(error);
    return null;
  };
}

export async function joinVideoCall(callId: string, userId: number){
  try{
    await db.participant.update({
      where: {
        id: {
          callId,
          userId
        }
      },
      data: {
        status: "JOINED"
      }
    });

    return true;
  }catch(error){
    console.error(error);
    return false;
  };
}

export async function endVideoCall(callId: string){
  try{
    await db.videoCall.update({
      where: {
        id: callId
      },
      data: {
        status: "ENDED"
      }
    });

    await db.participant.updateMany({
      where: {
        callId
      },
      data: {
        status: "LEFT"
      }
    });

    return true;
  }catch(error){
    console.error(error);
    return false;
  };
}