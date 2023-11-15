"use client";

import React, { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { ChatProps, SocketReference, ProfileData } from "@/app/libs/interfaces";
import send from "@/app/images/send.svg";
import { useSession } from "next-auth/react";
import axios from "axios";

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
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const [profiles, setProfiles] = useState<ProfileData[]>([]);


  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get("/api/user/profile");
        setProfiles(response.data.profiles);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    if (status === "authenticated") {
      fetchProfiles();
    }
  }, [session, status]);

  const handleEnterkey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    } 

  }

  const sendMessage = () => {
    if (inputValue) {
      socket.current?.emit(
        "roomMessage",
        room,
        inputValue + "+" + session?.user.email
      );
      setInputValue("");
      sendStopTypingNotification();
    } 
  };

  const sendTypingNotification = () => {
    const userEmail = session?.user.email;
    if (!isTyping) {
      const userInformation = `[${userRole}]${displayName}+${userEmail}`;
      socket.current?.emit("typing", room, userInformation);
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
    const userEmail = session?.user.email;
    if (isTyping) {
      socket.current?.emit(
        "stopTyping",
        room,
        `[${userRole}]${displayName}+${userEmail}`
      );
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

    socket.current?.on("typing", (user: string) => {
      // Exclude the local user from the typingUsers list
      const userInformation = `[${userRole}]${displayName}+${session?.user.email}`;
      if (userInformation !== user) {
        setTypingUsers((prevTypingUsers) => {
          if (!prevTypingUsers.includes(user)) {
            return [...prevTypingUsers, user];
          }
          return prevTypingUsers;
        });
      }
    });

    socket.current?.on("stopTyping", (user: string) => {
      // Exclude the local user from the typingUsers list
      const userInformation = `[${userRole}]${displayName}+${session?.user.email}`;
      if (userInformation !== user) {
        setTypingUsers((prevTypingUsers) =>
          prevTypingUsers.filter((u) => u !== user)
        );
      }
    });

    if (room && `[${userRole}]${displayName}`) {
      joinRoom();
    }

    return () => {
      socket.current?.disconnect();
    };
  }, [room, displayName, session]);


  return (
    <div className="flex flex-col">
      <div className="flex flex-col border-2 h-[500px] mb-4 overflow-auto">
        {/* {whojoined.map((message, index) => (
          <p key={index} className="text-center mt-4">
            {message}
          </p>
        ))} */}

        {messages.map((message, index) => {
          const messageParts = message.split("+");
          if (messageParts.length >= 2) {
            const email = message.split("+")[1].trim().toLowerCase();
            const lowerCasedSessionUserEmail = session?.user.email.trim().toLowerCase();

            return (
              <div
                key={index}
                className={`${
                  lowerCasedSessionUserEmail === email
                    ? "self-end mr-2 right-10"
                    : "self-start ml-2 left-10"
                }  max-w-xs relative mb-4 mt-2	flex flex-col ` }
              >
                <span
                  className={`relative text-xs text-zinc-400 whitespace-nowrap ${
                    lowerCasedSessionUserEmail === email ? "self-end" : "self-start"
                  }`}
                >
                  {message.split(":")[0]}
                </span>
                <img
                  src={
                    profiles.find(
                      (profile) => profile.userEmail === message.split("+")[1]
                    )?.image
                  }
                  className={`object-cover ml-3 w-[33px] h-[33px] rounded-full absolute ${
                    lowerCasedSessionUserEmail === email ? "top-6 -right-8" : "-left-14 top-7"
                  } `}
                  style={{
                    boxShadow: "4px 4px 10px rgba(153, 153, 153, 100%)",
                  }}
                />
                <div
                  className={`flex flex-col p-2 rounded-lg text-left ${lowerCasedSessionUserEmail === email ? "items-end" : "items-start"}` } 
                >
                  <div className={`${
                    lowerCasedSessionUserEmail === email ? "bg-green-200" : "bg-blue-200" 
                  } p-2 rounded-lg inline-block whitespace-normal max-w-xs break-words `}>{message.split("+")[0]!.split(": ")[1]}</div>
                </div>
              </div>
            );
          } else {
            console.error(`Unexpected message format: ${message}`);
            return null;
          }
        })}
        {typingUsers.map((user, index) => {
          const email = user.split("+")[1].trim().toLowerCase();
          const lowerCasedSessionUserEmail = session?.user.email.trim().toLowerCase();
          return (
            <div
              key={index}
              className={`${
                lowerCasedSessionUserEmail === email
                  ? "self-end mr-2 mt-2 right-10"
                  : "self-start ml-2 left-10"
              }  max-w-xs relative mb-4`}
            >
              <span
                className={`relative text-xs text-zinc-400 whitespace-nowrap ${
                  lowerCasedSessionUserEmail === email ? "" : ""
                }`}
              >
                {user.split("+")[0]}
              </span>
              <img
                src={
                  profiles.find((profile) => profile.userEmail === email)?.image
                }
                className={`object-cover ml-3 w-[33px] h-[33px] rounded-full absolute ${
                  lowerCasedSessionUserEmail === email ? "top-6 -right-10" : "-left-14"
                } `}
                style={{
                  boxShadow: "4px 4px 10px rgba(153, 153, 153, 100%)",
                }}
              />
              <div className="loader bg-main-color flex items-start justify-center z-50">
                <span className="loader__element border-2 border-point-color rounded-full m-4 animate-preloader-1"></span>
                <span className="loader__element border-2 border-point-color rounded-full m-4 animate-preloader-2"></span>
                <span className="loader__element border-2 border-point-color rounded-full m-4 animate-preloader-3"></span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex=row gap-2">
        <input
          type="text"
          className="w-full border-2 border-gray-300 rounded-lg hover:ring-2 focus:ring-0 focus: focus:outline-none pl-4"
          placeholder="Type a message..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleEnterkey}
        />
        <button
          onClick={sendMessage}
          className="flex items-center justify-center text-white font-bold bg-blue-500 w-[150px] gap-2 transition duration-300 ease-in-out hover:scale-105 rounded-md"
          style={{
            background: "linear-gradient(10deg, #5fb7ff, #47a1ff, #2f88ff)",
          }}
        >
          Send{" "}
          <span className="inline-block w-[15px]">
            <img src={send.src} alt="send" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
