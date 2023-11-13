"use client";

import React, { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { ChatProps, SocketReference } from "@/app/libs/interfaces";
import send from "@/app/images/send.svg";
import { useSession } from "next-auth/react";

const ChatComponent: React.FC<ChatProps> = ({
  requestid,
  username,
  userType,
}) => {
  const socket: SocketReference = useRef<Socket | null>(null);
  const { data: session, status } = useSession();
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [room, setRoom] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [whojoined, setWhoJoined] = useState<string[]>([]);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const sendMessage = () => {
    if (inputValue) {
      socket.current?.emit("roomMessage", room, inputValue);
      setInputValue("");
      sendStopTypingNotification();
    }
  };

  const sendTypingNotification = () => {
    if (!isTyping) {
      socket.current?.emit("typing", room, `[${userRole}]${displayName}`);
      setIsTyping(true);
    }

    // Clear any existing typing timeout
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    // Set a new typing timeout
    typingTimeout.current = setTimeout(() => {
      sendStopTypingNotification();
    }, 2000); // Adjust the timeout as needed
  };

  const sendStopTypingNotification = () => {
    if (isTyping) {
      socket.current?.emit("stopTyping", room, `[${userRole}]${displayName}`);
      setIsTyping(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    sendTypingNotification();
  };

  useEffect(() => {
    setDisplayName(username!);
    setRoom(requestid!);
    setUserRole(userType!);
  }, [requestid, username, userType]);

  useEffect(() => {
    // Define the WebSocket server URL with a default value
    const wsServerUrl =
      process.env.NEXT_PUBLIC_WS_SERVER ||
      "ws://serve-ease-websocket-server-1b42068c72f6.herokuapp.com";
    socket.current = io(wsServerUrl);

    const joinRoom = () => {
      if (room && displayName) {
        socket.current?.emit("join", room, `[${userRole}]${displayName}`);
      }
    };

    socket.current?.on("message", (data: string) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.current?.on("joinroom", (data: string) => {
      setWhoJoined((prevMessages) => [...prevMessages, data]);
    });

    socket.current?.on("typing", (user: string) => {
      setTypingUsers((prevTypingUsers) => {
        if (!prevTypingUsers.includes(user)) {
          return [...prevTypingUsers, user];
        }
        return prevTypingUsers;
      });
    });

    socket.current?.on("stopTyping", (user: string) => {
      setTypingUsers((prevTypingUsers) =>
        prevTypingUsers.filter((u) => u !== user)
      );
    });

    if (room && `[${userRole}]${displayName}`) {
      joinRoom();
    }

    return () => {
      socket.current?.disconnect();
    };
  }, [room, displayName]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col border-2 h-[500px] mb-4">
      {whojoined.map((message, index) => (
          <p key={index} className="text-center mt-4">{message}</p>
        ))}
        
        {messages.map((message, index) => (
          <p key={index} className={`${session?.user.name === displayName ? "self-end mt-4 mr-2": "self-start"}`}><span className="bg-green-200 p-2 rounded-full">{message}</span></p>
        ))}
        {typingUsers.map((user, index) => (
          <p key={index}>{user} is typing...</p>
        ))}
      </div>
      <div className="flex flex=row gap-2">
        <input
          type="text"
          className="w-full border-2 border-gray-300 rounded-lg hover:ring-2 focus:ring-0 focus: focus:outline-none pl-4"
          placeholder="Type a message..."
          value={inputValue}
          onChange={handleInputChange}
        />
        <button onClick={sendMessage} className="flex items-center justify-center text-white font-bold bg-blue-500 w-[150px] gap-2 transition duration-300 ease-in-out hover:scale-105 rounded-md" style={{background: 'linear-gradient(150deg, #5fb7ff, #47a1ff, #2f88ff)'}}>Send <span className="inline-block w-[15px]"><img src={send.src} alt="send"/></span></button>
      </div>
    </div>
  );
};

export default ChatComponent;
