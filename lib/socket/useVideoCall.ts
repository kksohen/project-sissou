import { useEffect, useRef, useState, useCallback } from 'react';
import {io} from "socket.io-client";

interface IUser{
  socketId: string;
  userId: number;
  username: string;
  stream?: MediaStream;
};

export function useVideoCall(chatRoomId: string, userId: number, username: string){
  const [isCall, setIsCall] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<IUser[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const socketRef = useRef<any>(null);
  const peerConnectionRef = useRef<Map<string, RTCPeerConnection>>(new Map());

  useEffect(() => {
    if(stream && peerConnectionRef.current.size > 0){
      
      peerConnectionRef.current.forEach((pc) => {
        pc.getSenders().forEach(sender => { //기존 트랙 제거
          if(sender.track){
            pc.removeTrack(sender);
          }
        });

        stream.getTracks().forEach(track => { //새 트랙 추가
          pc.addTrack(track, stream);
        });
      });
    }
  }, [stream]);

  //P2P 연결 생성
  const createPeerConnection = useCallback((targetSocketId: string, isInit: boolean)=>{
    const pc = new RTCPeerConnection({ //스턴서버
      iceServers: [
        {
          urls: [
          "stun:stun.l.google.com:19302",
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
          "stun:stun3.l.google.com:19302",
          "stun:stun4.l.google.com:19302"
          ]
        }
      ]
    });

    if(stream){
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream)
      });
    };

    pc.ontrack = (e)=>{ //상대 정보 저장
      setRemoteUsers(prev=>prev.map(user=>user.socketId === targetSocketId ?
        {...user, stream: e.streams[0]} : user
      ));
    };

    pc.onicecandidate = (e) => { //네트워크 교환
      if(e.candidate && socketRef.current){
        socketRef.current.emit("ice", {
          candidate: e.candidate,
          targetSocketId
        });
      };
    };

    peerConnectionRef.current.set(targetSocketId, pc);

    if(isInit){
      pc.createOffer().then(offer => {
        pc.setLocalDescription(offer);
        socketRef.current.emit("offer", {
          offer,
          targetSocketId
        });
      });
    };

    return pc;
  }, [stream]);

  const handleOffer = useCallback(async(offer: RTCSessionDescriptionInit, fromSocketId: string)=>{
    const pc = createPeerConnection(fromSocketId, false);
    await pc.setRemoteDescription(offer);

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socketRef.current.emit("answer", {
      answer,
      targetSocketId: fromSocketId
    });
  }, [createPeerConnection]);

  const handleAnswer = useCallback(async(answer: RTCSessionDescriptionInit, fromSocketId: string)=>{
    const pc = peerConnectionRef.current.get(fromSocketId);
    
    if(pc){
      await pc.setRemoteDescription(answer);
    };
  }, []);

  const handleCandidate = useCallback(async(candidate: RTCIceCandidateInit, fromSocketId: string)=>{
    const pc = peerConnectionRef.current.get(fromSocketId);
    if(pc && candidate) await pc.addIceCandidate(candidate);
  }, []);

  useEffect(()=>{
    if(isCall){
      socketRef.current = io({
        path: "/api/videocall/socket"
      });

      const socket = socketRef.current;

      socket.on("user_join_video", ({
        userId: joinUserId,
        username: joinUsername,
        socketId
        }: {userId: number, username: string, socketId: string})=>{
        
        setRemoteUsers(prev => {
          const exist = prev.find(user => user.socketId === socketId);
          if(exist) return prev;

          return[...prev, {
            userId: joinUserId,
            username: joinUsername,
            socketId
          }];
        });

        setTimeout(()=>{
          createPeerConnection(socketId, true);
        }, 100);
      });

      socket.on("exist_user", (existUsers: IUser[])=>{

        existUsers.forEach((user, index) => {
          if(user && user.socketId !== socket.id){
            setRemoteUsers(prev => {
              const exist = prev.find(e => e.socketId === user.socketId);
              if(exist) return prev;

              return [...prev, {
                userId: user.userId,
                username: user.username,
                socketId: user.socketId
              }];
            });
            setTimeout(()=>{
              createPeerConnection(user.socketId, true);
            }, 1000 + (index * 500));
          }
        });
      });

      socket.on("offer", ({offer, fromSocketId}: {offer: RTCSessionDescriptionInit, fromSocketId: string})=>{
        handleOffer(offer, fromSocketId);
      });

      socket.on("answer", ({answer, fromSocketId}: {answer: RTCSessionDescriptionInit, fromSocketId: string})=>{
        handleAnswer(answer, fromSocketId);
      });

      socket.on("ice", ({candidate, fromSocketId}: {candidate: RTCIceCandidateInit, fromSocketId: string})=>{
        handleCandidate(candidate, fromSocketId);
      });

      socket.on("user_leave_video", ({socketId}: {socketId: string})=>{
        const pc = peerConnectionRef.current.get(socketId);
        if(pc){
          pc.close();
          peerConnectionRef.current.delete(socketId);
        }

        setRemoteUsers(prev => {
          const updatedUsers = prev.filter(user => user.socketId !== socketId);
          
          return updatedUsers;
        });
      });

      return()=>socket.disconnect();
    }
  }, [createPeerConnection, handleAnswer, handleCandidate, handleOffer, isCall]);

  //호스트 - 시작
  const startCall = async()=>{
    try{
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      setStream(stream);
      setIsCall(true);
      setStartTime(new Date());

      setTimeout(()=>{
        if(socketRef.current) {
          socketRef.current.emit("join_video_room", chatRoomId, userId, username);
        }
      }, 100);
    }catch(error){
      console.error(error);
      alert("카메라, 마이크에 접근할 수 없습니다.");
    }
  };

  //참여자 - 참가
  const joinCall = async()=>{
    try{
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      setStream(stream);
      setIsCall(true);

      setTimeout(()=>{
        if(socketRef.current) {
          socketRef.current.emit("join_video_room", chatRoomId, userId, username);
        }
      }, 100);
    }catch(error){
      console.error(error);
      alert("카메라, 마이크에 접근할 수 없습니다.");
    };
  };

  //퇴장, 종료
  const endCall = () => {

    if(stream){
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    };

    peerConnectionRef.current.forEach(pc => pc.close());
    peerConnectionRef.current.clear();

    if(socketRef.current){
      socketRef.current.emit("leave_video_room", chatRoomId, userId, username);
      socketRef.current.disconnect();
    };

    setIsCall(false);
    setRemoteUsers([]);
    setStartTime(null);
  };

  //audio
  const toggleMute = ()=>{
    if(stream){
    stream.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
    });

    setIsMuted(!isMuted);
    }
  };

  //camera
  const toggleCamera=()=>{
    if(stream){
      stream.getVideoTracks().forEach(track=>{
        track.enabled = !track.enabled;
      });

      setIsCameraOff(!isCameraOff);
    }
  };

  return{
    isCall,
    stream,
    remoteUsers,
    isMuted,
    isCameraOff,
    startCall,
    joinCall,
    endCall,
    toggleCamera,
    toggleMute,
    startTime
  };
}