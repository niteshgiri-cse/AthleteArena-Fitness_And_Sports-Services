import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const WS_URL = "ws://localhost:8080/ws";
const ICE = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    {
      urls: "turn:openrelay.metered.ca:80",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
    {
      urls: "turn:openrelay.metered.ca:443",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
  ],
  iceCandidatePoolSize: 10,
};

// Icons (same as before)
const Icon = ({ children, className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const MicIcon = ({ muted }) => (
  <Icon>
    {muted ? (
      <>
        <line x1="1" y1="1" x2="23" y2="23" />
        <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
        <path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23" />
      </>
    ) : (
      <>
        <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
        <path d="M19 10v2a7 7 0 01-14 0v-2" />
      </>
    )}
  </Icon>
);

const CamIcon = ({ off }) => (
  <Icon>
    {off ? (
      <>
        <path d="M16 16v1a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h2m5.66 0H14a2 2 0 012 2v3.34" />
        <path d="M23 7l-7 5 7 5V7z" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ) : (
      <>
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </>
    )}
  </Icon>
);

const ScreenIcon = ({ active }) => (
  <Icon>
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
    {active ? <polyline points="7 9 12 5 17 9" /> : <line x1="8" y1="9" x2="16" y2="9" />}
    {active && <line x1="12" y1="5" x2="12" y2="14" />}
  </Icon>
);

const EndIcon = () => (
  <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.58.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.29 21 3 13.71 3 4.5c0-.55.45-1 1-1H7.5c.55 0 1 .45 1 1 0 1.25.2 2.46.57 3.58.11.35.03.74-.24 1.02L6.6 10.8z" transform="rotate(135,12,12)" />
  </svg>
);

const ChatIcon = () => (
  <Icon>
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </Icon>
);

const PeopleIcon = () => (
  <Icon>
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </Icon>
);

const SendIcon = () => (
  <Icon>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </Icon>
);

// MAIN COMPONENT
export default function GoLive() {
  const { roomId } = useParams();
  const ROOM = roomId;
  const USER_ID = useRef(Math.random().toString(36).substring(2, 9)).current;
  const targetUserRef = useRef(null);
  const isCallerRef = useRef(false);
  const connectionMadeRef = useRef(false);
  
  const localVidRef = useRef(null);
  const remoteVidRef = useRef(null);
  const pcRef = useRef(null);
  const wsRef = useRef(null);
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const chatEndRef = useRef(null);
  const pendingCandidatesRef = useRef([]);
  
  const [micMuted, setMicMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [screenOn, setScreenOn] = useState(false);
  const [remoteScreen, setRemoteScreen] = useState(false);
  const [wsStatus, setWsStatus] = useState("connecting");
  const [peerUp, setPeerUp] = useState(false);
  const [callSecs, setCallSecs] = useState(0);
  const [panel, setPanel] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [chatVal, setChatVal] = useState("");
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [deviceError, setDeviceError] = useState(null);
  const [participantCount, setParticipantCount] = useState(1);

  // Timer
  useEffect(() => {
    let timer;
    if (peerUp) timer = setInterval(() => setCallSecs(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, [peerUp]);

  // Video elements
  useEffect(() => {
    if (remoteVidRef.current && remoteStream) {
      remoteVidRef.current.srcObject = remoteStream;
      console.log("✅ Remote video attached");
    }
    if (localVidRef.current && localStream) {
      localVidRef.current.srcObject = localStream;
      console.log("✅ Local video attached");
    }
  }, [remoteStream, localStream]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const wsSend = (obj) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(obj));
      console.log("📤 Sent:", obj.type);
    }
  };

  const addMsg = (text, self) => setMsgs(prev => [...prev, { text, self, time: new Date() }]);

  const sendChat = () => {
    if (!chatVal.trim()) return;
    wsSend({ type: "chat", text: chatVal.trim(), room: ROOM });
    addMsg(chatVal.trim(), true);
    setChatVal("");
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(t => t.enabled = micMuted);
      setMicMuted(!micMuted);
    }
  };

  const toggleCam = () => {
    if (localStreamRef.current?.getVideoTracks().length) {
      localStreamRef.current.getVideoTracks().forEach(t => t.enabled = camOff);
      setCamOff(!camOff);
    }
  };

  const toggleScreen = async () => {
    if (!pcRef.current) return;
    
    if (screenOn) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(t => t.stop());
        screenStreamRef.current = null;
      }
      const videoTrack = localStreamRef.current?.getVideoTracks()[0];
      if (videoTrack) {
        const sender = pcRef.current.getSenders().find(s => s.track?.kind === "video");
        if (sender) await sender.replaceTrack(videoTrack);
      }
      setScreenOn(false);
      wsSend({ type: "screen-stop", room: ROOM });
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = screenStream;
        const screenTrack = screenStream.getVideoTracks()[0];
        const sender = pcRef.current.getSenders().find(s => s.track?.kind === "video");
        if (sender) await sender.replaceTrack(screenTrack);
        setLocalStream(screenStream);
        setScreenOn(true);
        wsSend({ type: "screen-start", room: ROOM });
        screenTrack.onended = () => toggleScreen();
      } catch (err) {
        console.warn("Screen share cancelled:", err);
      }
    }
  };

  const endCall = () => {
    if (pcRef.current) pcRef.current.close();
    if (wsRef.current) wsRef.current.close();
    if (localStreamRef.current) localStreamRef.current.getTracks().forEach(t => t.stop());
    if (screenStreamRef.current) screenStreamRef.current.getTracks().forEach(t => t.stop());
    window.location.reload();
  };

  const initMediaStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      console.log("✅ Media stream acquired");
      return stream;
    } catch (err) {
      console.error("Media stream error:", err);
      setDeviceError(`${err.name}: ${err.message}`);
      return null;
    }
  };

  // Process pending ICE candidates
  const flushPendingCandidates = async () => {
    if (pendingCandidatesRef.current.length > 0 && pcRef.current?.remoteDescription) {
      console.log(`Flushing ${pendingCandidatesRef.current.length} pending ICE candidates`);
      for (const candidate of pendingCandidatesRef.current) {
        try {
          await pcRef.current.addIceCandidate(candidate);
        } catch (err) {
          console.error("Error adding candidate:", err);
        }
      }
      pendingCandidatesRef.current = [];
    }
  };

  // MAIN WebRTC Setup
  useEffect(() => {
    let isMounted = true;
    const JOIN_KEY = `joined_${ROOM}`;
    sessionStorage.removeItem(JOIN_KEY);
    
    const start = async () => {
      // 1. Create PeerConnection
      const pc = new RTCPeerConnection(ICE);
      pcRef.current = pc;
      
      // 2. Handle remote track
      pc.ontrack = (event) => {
        console.log("🎥 ontrack! Streams:", event.streams.length);
        if (event.streams && event.streams[0]) {
          setRemoteStream(event.streams[0]);
          setPeerUp(true);
          setParticipantCount(2);
          connectionMadeRef.current = true;
        }
      };
      
      // 3. Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && targetUserRef.current) {
          wsSend({
            type: "candidate",
            candidate: event.candidate,
            room: ROOM,
            target: targetUserRef.current,
          });
        }
      };
      
      // 4. Monitor ICE state
      pc.oniceconnectionstatechange = () => {
        console.log("ICE state:", pc.iceConnectionState);
        if (pc.iceConnectionState === "connected") {
          setPeerUp(true);
          setParticipantCount(2);
        }
      };
      
      // 5. Monitor connection state
      pc.onconnectionstatechange = () => {
        console.log("Connection state:", pc.connectionState);
        if (pc.connectionState === "connected") {
          setPeerUp(true);
          setParticipantCount(2);
          flushPendingCandidates();
        }
      };
      
      // 6. Get local media stream
      const stream = await initMediaStream();
      if (stream && isMounted) {
        localStreamRef.current = stream;
        setLocalStream(stream);
        stream.getTracks().forEach(track => {
          pc.addTrack(track, stream);
          console.log(`Added ${track.kind} track`);
        });
      }
      
      // 7. WebSocket connection
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;
      
      ws.onopen = () => {
        console.log("WebSocket connected");
        setWsStatus("connected");
        
        if (!sessionStorage.getItem(JOIN_KEY)) {
          sessionStorage.setItem(JOIN_KEY, "true");
          wsSend({ type: "join", room: ROOM, userId: USER_ID });
        }
      };
      
      ws.onclose = () => {
        console.log("WebSocket closed");
        setWsStatus("disconnected");
      };
      
      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        setWsStatus("error");
      };
      
      // 8. Handle incoming messages
      ws.onmessage = async (raw) => {
        const msg = JSON.parse(raw.data);
        console.log("📨 Received:", msg.type);
        
        switch(msg.type) {
          case "wait":
            console.log("Waiting for peer...");
            break;
            
          case "ready":
            console.log("Ready! Target:", msg.target);
            targetUserRef.current = msg.target;
            setParticipantCount(2);
            
            // CRITICAL FIX: Only ONE peer creates offer
            if (USER_ID < msg.target && !connectionMadeRef.current) {
              isCallerRef.current = true;
              console.log("I am CALLER - creating offer");
              
              // Create data channel
              const dc = pc.createDataChannel("chat");
              dc.onmessage = (e) => {
                try {
                  const data = JSON.parse(e.data);
                  if (data.type === "chat") addMsg(data.text, false);
                } catch (err) {}
              };
              
              // Create offer
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              wsSend({
                type: "offer",
                offer: offer,
                room: ROOM,
                target: targetUserRef.current,
              });
            } else {
              console.log("I am CALLEE - waiting for offer");
            }
            break;
            
          case "offer":
            console.log("Received offer from:", msg.target);
            if (!connectionMadeRef.current) {
              targetUserRef.current = msg.target;
              setParticipantCount(2);
              isCallerRef.current = false;
              
              // Handle incoming data channel
              pc.ondatachannel = (event) => {
                console.log("Data channel received");
                event.channel.onmessage = (e) => {
                  try {
                    const data = JSON.parse(e.data);
                    if (data.type === "chat") addMsg(data.text, false);
                  } catch (err) {}
                };
              };
              
              // Set remote description and create answer
              await pc.setRemoteDescription(new RTCSessionDescription(msg.offer));
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              wsSend({
                type: "answer",
                answer: answer,
                room: ROOM,
                target: targetUserRef.current,
              });
              flushPendingCandidates();
            }
            break;
            
          case "answer":
            console.log("Received answer");
            if (pc.signalingState === "have-local-offer") {
              await pc.setRemoteDescription(new RTCSessionDescription(msg.answer));
              flushPendingCandidates();
            }
            break;
            
          case "candidate":
            const candidate = new RTCIceCandidate(msg.candidate);
            if (pc.remoteDescription) {
              await pc.addIceCandidate(candidate);
            } else {
              pendingCandidatesRef.current.push(candidate);
            }
            break;
            
          case "chat":
            addMsg(msg.text, false);
            break;
            
          case "screen-start":
            setRemoteScreen(true);
            break;
            
          case "screen-stop":
            setRemoteScreen(false);
            break;
        }
      };
    };
    
    start();
    
    return () => {
      isMounted = false;
      if (pcRef.current) pcRef.current.close();
      if (wsRef.current) wsRef.current.close();
      if (localStreamRef.current) localStreamRef.current.getTracks().forEach(t => t.stop());
      if (screenStreamRef.current) screenStreamRef.current.getTracks().forEach(t => t.stop());
    };
  }, [ROOM, USER_ID]);
  
  const formatTime = (secs) => `${Math.floor(secs / 60).toString().padStart(2, "0")}:${(secs % 60).toString().padStart(2, "0")}`;
  const formatTimeHM = (date) => date?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  
  return (
    <div className="h-screen flex flex-col bg-[#0c0e14] text-[#e2e5f0] select-none">
      {/* Top Bar */}
      <div className="h-13 bg-[#141720] border-b border-white/6 flex items-center justify-between px-5 shrink-0 z-20">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-sm font-medium text-[#4f8ef7] tracking-wide">vcall</span>
          <div className="w-px h-4.5 bg-white/11" />
          <span className="text-xs text-[#8b92a8] bg-[#1c2030] border border-white/6 px-2.5 py-0.5 rounded-full font-mono">#{ROOM}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${wsStatus !== "connected" ? "bg-[#f87171] shadow-[0_0_6px_#f87171]" : peerUp ? "bg-[#34d399] shadow-[0_0_6px_#34d399] animate-pulse" : "bg-[#fbbf24] shadow-[0_0_6px_#fbbf24]"}`} />
          <span className="text-xs text-[#8b92a8]">
            {wsStatus !== "connected" ? (wsStatus === "connecting" ? "Connecting…" : "Server offline") : peerUp ? "In Call" : "Waiting for peer…"}
          </span>
          {peerUp && <span className="font-mono text-xs text-[#525870] bg-[#1c2030] border border-white/6 px-2 py-0.5 rounded">{formatTime(callSecs)}</span>}
        </div>
        <div className="flex gap-1.5">
          {["people", "chat"].map(p => (
            <button key={p} onClick={() => setPanel(panel === p ? null : p)} className={`w-8.5 h-8.5 rounded-lg bg-[#1c2030] border border-white/6 text-[#8b92a8] cursor-pointer flex items-center justify-center transition-all duration-150 hover:bg-[#252a3d] hover:text-[#e2e5f0] hover:border-white/11 ${panel === p ? "!bg-[#4f8ef7] text-white! border-[#4f8ef7]" : ""}`}>
              {p === "people" ? <PeopleIcon /> : <ChatIcon />}
            </button>
          ))}
        </div>
      </div>
      
      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 relative bg-[#070910] overflow-hidden">
          <video 
            ref={remoteVidRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover bg-black" 
          />
          
          {!peerUp && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#141930] to-[#070910]">
              <div className="relative w-22 h-22 rounded-full bg-[#1c2030] border border-white/11 flex items-center justify-center text-3.5">
                <div className="absolute -inset-2 rounded-full border border-[#4f8ef7] opacity-25 animate-ping" />
                👤
              </div>
              <span className="text-[#8b92a8]">Waiting for someone to join…</span>
              <span className="text-xs text-[#525870] font-mono bg-[#1c2030] border border-white/11 px-3.5 py-1 rounded-lg">Share room: {ROOM}</span>
            </div>
          )}
          
          {(peerUp && (screenOn || remoteScreen)) && (
            <div className="absolute top-3.5 left-1/2 -translate-x-1/2 bg-[#4f8ef7]/20 border border-[#4f8ef7]/40 text-[#4f8ef7] text-xs px-3.5 py-1 rounded-full backdrop-blur-sm flex items-center gap-1.5">
              <ScreenIcon active={screenOn || remoteScreen} />
              {remoteScreen ? "Remote is sharing screen" : "You are sharing screen"}
            </div>
          )}
          
          {wsStatus !== "connected" && (
            <div className="absolute top-3.5 left-1/2 -translate-x-1/2 bg-[#0c0e14]/90 border border-white/11 text-[#8b92a8] text-xs px-3.5 py-1 rounded-full font-mono backdrop-blur-sm">
              {wsStatus === "connecting" ? "⏳ Connecting to server…" : "❌ Server offline"}
            </div>
          )}
          
          {deviceError && !peerUp && (
            <div className="absolute bottom-25 left-1/2 -translate-x-1/2 bg-[#f87171]/90 border border-[#f87171] text-white text-xs px-4 py-2 rounded-full backdrop-blur-sm z-20 whitespace-nowrap">
              ⚠️ {deviceError}
            </div>
          )}
          
          {/* PIP Video */}
          <div className="absolute bottom-22 right-4.5 w-44 h-29 rounded-xl overflow-hidden border border-white/15 shadow-2xl bg-black transition-transform duration-180 hover:scale-105 z-5">
            {(camOff && !screenOn) && <div className="absolute inset-0 bg-[#1c2030] flex items-center justify-center text-2xl">🙈</div>}
            <video ref={localVidRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            <span className="absolute bottom-1.5 left-2 text-[10px] font-semibold text-white drop-shadow-lg">{screenOn ? "Screen" : "You"}</span>
          </div>
          
          {/* Controls */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#141720]/90 backdrop-blur-xl border border-white/11 px-4 py-2 rounded-full shadow-2xl z-10">
            {[
              { icon: <MicIcon muted={micMuted} />, active: !micMuted, onClick: toggleMic, tooltip: micMuted ? "Unmute" : "Mute" },
              { icon: <CamIcon off={camOff} />, active: !camOff, onClick: toggleCam, tooltip: camOff ? "Start Camera" : "Stop Camera" },
              { icon: <ScreenIcon active={screenOn} />, active: screenOn, onClick: toggleScreen, tooltip: screenOn ? "Stop Sharing" : "Share Screen", className: screenOn ? "bg-[#4f8ef7]/20 text-[#4f8ef7] border-[#4f8ef7]/40" : "" },
            ].map((btn, i) => (
              <div key={i} className="relative group">
                <button onClick={btn.onClick} className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-160 ${btn.active ? "bg-[#252a3d] text-[#e2e5f0] border border-white/11 hover:bg-[#4f8ef7] hover:text-white hover:border-[#4f8ef7]" : "bg-[#f87171]/15 text-[#f87171] border border-[#f87171]/30 hover:bg-[#f87171] hover:text-white"} ${btn.className || ""}`}>
                  {btn.icon}
                </button>
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#252a3d] text-[#e2e5f0] border border-white/11 text-[11px] whitespace-nowrap px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none translate-y-1 group-hover:translate-y-0">
                  {btn.tooltip}
                </span>
              </div>
            ))}
            <div className="w-px h-6.5 bg-white/11 mx-0.5" />
            <div className="relative group">
              <button onClick={endCall} className="w-12.5 h-12.5 rounded-full bg-[#f87171] text-white flex items-center justify-center transition-all duration-160 hover:bg-[#ef4444] hover:scale-105 shadow-[0_4px_18px_rgba(248,113,113,0.38)]">
                <EndIcon />
              </button>
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#252a3d] text-[#e2e5f0] border border-white/11 text-[11px] whitespace-nowrap px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none translate-y-1 group-hover:translate-y-0">End Call</span>
            </div>
          </div>
        </div>
        
        {/* Side Panel */}
        <div className={`w-75 bg-[#10131a] border-l border-white/6 flex flex-col overflow-hidden transition-all duration-220 shrink-0 ${!panel ? "!w-0" : ""}`}>
          {panel === "chat" && (
            <>
              <div className="px-4.5 py-3.5 border-b border-white/6 flex justify-between items-center shrink-0">
                <span className="font-semibold text-sm">💬 Chat</span>
                <button onClick={() => setPanel(null)} className="bg-none border-none text-[#525870] cursor-pointer text-xl leading-5 px-1 py-0.5 rounded transition-colors duration-130 hover:text-[#e2e5f0]">×</button>
              </div>
              <div className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-2.5">
                {msgs.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center gap-2 text-[#525870] text-xs">
                    <span className="text-2xl">💬</span>
                    <span>No messages yet</span>
                    <span className="text-[11px]">Say hello!</span>
                  </div>
                )}
                {msgs.map((m, i) => (
                  <div key={i} className={`flex flex-col gap-0.5 ${m.self ? "items-end" : ""}`}>
                    <div className={`max-w-[82%] px-3 py-2 rounded-xl text-sm leading-relaxed break-words ${m.self ? "bg-[#4f8ef7] text-white rounded-br-md" : "bg-[#1c2030] text-[#e2e5f0] rounded-bl-md"}`}>{m.text}</div>
                    <span className="text-[10.5px] text-[#525870] px-0.5">{formatTimeHM(m.time)}</span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="p-3 border-t border-white/6 flex gap-2 items-center shrink-0">
                <input className="flex-1 bg-[#1c2030] border border-white/6 text-[#e2e5f0] text-sm px-3 py-2 rounded-lg outline-none transition-colors duration-140 focus:border-[#4f8ef7]" placeholder="Type a message…" value={chatVal} onChange={(e) => setChatVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendChat()} />
                <button onClick={sendChat} disabled={!chatVal.trim()} className="w-9 h-9 bg-[#4f8ef7] border-none rounded-lg text-white cursor-pointer flex items-center justify-center transition-all duration-160 hover:bg-[#3b7de8] hover:scale-105 disabled:bg-[#1c2030] disabled:text-[#525870] disabled:cursor-default disabled:transform-none shrink-0">
                  <SendIcon />
                </button>
              </div>
            </>
          )}
          
          {panel === "people" && (
            <>
              <div className="px-4.5 py-3.5 border-b border-white/6 flex justify-between items-center shrink-0">
                <span className="font-semibold text-sm">👥 Participants ({participantCount})</span>
                <button onClick={() => setPanel(null)} className="bg-none border-none text-[#525870] cursor-pointer text-xl leading-5 px-1 py-0.5 rounded transition-colors duration-130 hover:text-[#e2e5f0]">×</button>
              </div>
              <div className="flex-1 p-3.5 flex flex-col gap-2">
                <div className="flex items-center gap-2.5 p-2.5 bg-[#1c2030] rounded-xl border border-white/6">
                  <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#4f8ef7] to-[#a78bfa] flex items-center justify-center text-sm font-bold shrink-0">Y</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">You</div>
                    <div className="text-[11.5px] text-[#525870] mt-0.5">{screenOn ? "🖥 Sharing Screen" : micMuted ? "🔇 Muted" : "🎙 Active"}</div>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#34d399]" />
                </div>
                {peerUp && (
                  <div className="flex items-center gap-2.5 p-2.5 bg-[#1c2030] rounded-xl border border-white/6">
                    <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#34d399] to-[#06b6d4] flex items-center justify-center text-sm font-bold shrink-0">R</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Remote Peer</div>
                      <div className="text-[11.5px] text-[#525870] mt-0.5">{remoteScreen ? "🖥 Sharing Screen" : "🎙 Connected"}</div>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#34d399]" />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}