"use client";

import React, { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { ChatProps, SocketReference } from "@/app/libs/interfaces";

const ChatComponent: React.FC<ChatProps> = ({
  requestid,
  username,
  userType,
}) => {
  const socket: SocketReference = useRef<Socket | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [room, setRoom] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

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
    setDisplayName(username);
    setRoom(requestid);
    setUserRole(userType);
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
    <div>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
        {typingUsers.map((user, index) => (
          <li key={index}>{user} is typing...</li>
        ))}
      </ul>
      <input type="text" value={inputValue} onChange={handleInputChange} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatComponent;
