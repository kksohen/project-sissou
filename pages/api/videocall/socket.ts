import {NextApiRequest, NextApiResponse} from "next";
import { Server as IOServer } from "socket.io";
import { Server as NetServer } from "http";
import { Socket } from "net";

interface NextApiResponseIO extends NextApiResponse{
  socket: Socket & {
    server: NetServer & {
      io: IOServer;
    };
  };
}

const SocKetHandler = (req: NextApiRequest, res: NextApiResponseIO)=>{
  if(res.socket.server.io){ //중복 생성 방지
    res.end();
    return;
  };

  const io = new IOServer(res.socket.server, {
    path: "/api/videocall/socket",
    addTrailingSlash: false,
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  res.socket.server.io = io;

  io.on("connection", (socket)=>{
    // console.log(`연결 시작: ${socket.id}`);
    socket.on("join_video_room", (chatRoomId: string, userId: number, username: string)=>{
      // console.log(`${username}참여: ${chatRoomId}`);
      const existUsers = Array.from(io.sockets.adapter.rooms.get(chatRoomId) || []).map(socketId => {
        const existSocket = io.sockets.sockets.get(socketId);

        return existSocket ? {
          socketId,
          userId: existSocket.data?.userId,
          username: existSocket.data?.username
        } : null
      }).filter(Boolean);

      socket.emit("exist_user", existUsers); //새 참여자에게 기존 참여자 정보 전송

      socket.data = {userId, username};

      socket.join(chatRoomId);

      socket.to(chatRoomId).emit("user_join_video", { //기존 참여자에게 새 참여자 정보 전송
        userId,
        username,
        socketId: socket.id
      });
    });

    socket.on("offer", ({offer, targetSocketId}: {offer: RTCSessionDescriptionInit, targetSocketId: string})=>{
      socket.to(targetSocketId).emit("offer", {
        offer,
        fromSocketId: socket.id
      });
    });

    socket.on("answer", ({answer, targetSocketId}: {answer: RTCSessionDescriptionInit, targetSocketId: string})=>{
      socket.to(targetSocketId).emit("answer", {
        answer,
        fromSocketId: socket.id
      });
    });

    socket.on("ice", ({candidate, targetSocketId}: {candidate: RTCIceCandidateInit, targetSocketId: string})=>{
      socket.to(targetSocketId).emit("ice", {
        candidate,
        fromSocketId: socket.id
      });
    });

    //퇴장, 종료
    socket.on("leave_video_room", (chatRoomId: string, userId: number, username: string)=>{
      // console.log(`${username}종료: ${chatRoomId}`);
      socket.leave(chatRoomId);

      socket.to(chatRoomId).emit("user_leave_video", { //퇴장 알림
        userId,
        username,
        socketId: socket.id
      });
    });

    socket.on("disconnect", ()=>{
      // console.log(`연결 해제: ${socket.id}`);
    });
  });

  res.end();
}

export default SocKetHandler;