import db from "@/lib/db";
import getSession from "@/lib/session/get-session";
import { NextRequest, NextResponse } from "next/server";

//modal chatBtn
export async function POST(req: NextRequest){
  try{
    const session = await getSession();
    if(!session.id){
      return NextResponse.json({
        error: "Unauthorized"
      }, {
        status: 401
      });
    }

    const {targetUserId} = await req.json();

    if(!targetUserId || targetUserId === session.id){
      return NextResponse.json({
        error: "대상을 확인해주세요."
      },{
        status: 400
      });
    }

    const getExistChatRoom = await db.chatRoom.findFirst({
      where: {
        type: "DIRECT",
        chatRoomUsers: {
          every: {
            userId: {
              in: [session.id, targetUserId]
            }
          }
        }
      },
      include: {
        chatRoomUsers: {
          select: {
            userId: true
          }
        }
      }
    });

    if(getExistChatRoom && getExistChatRoom.chatRoomUsers.length === 2){
      return NextResponse.json({
        chatRoomId: getExistChatRoom.id,
        isExisting: true
      });
    }

    const createChatroom = await db.chatRoom.create({
      data: {
        type: "DIRECT",
        max_participants: 2,
        chatRoomUsers: {
          create: [
            {
              userId: session.id, 
              role: "HOST"
            }, {
              userId: targetUserId,
              role: "MEMBER"
            }
          ]
        }
      },
      select: {
        id: true
      }
    });

    return NextResponse.json({
      chatRoomId: createChatroom.id,
      isExisting: false
    });
  }catch(error){
    console.error(error);

    return NextResponse.json(
      {
        error: "Internal Server Error"
      }, {
        status: 500
      }
    );
  }
}