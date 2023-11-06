import React, { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

interface SocketReference {
  current: Socket | null;
}

const ChatComponent = () => {
  const socket: SocketReference = useRef<Socket | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
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
      socket.current?.emit("typing", room, username);
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
      socket.current?.emit("stopTyping", room, username);
      setIsTyping(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    sendTypingNotification();
  };

  useEffect(() => {
    socket.current = io("wss://serv-ease-app.vercel.app");

    const joinRoom = () => {
      if (room && username) {
        socket.current?.emit("join", room, username);
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

    if (room && username) {
      joinRoom();
    }

    return () => {
      socket.current?.disconnect();
    };
  }, [room, username]);

  return (
    <div>
      <label>
        Room:{" "}
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
      </label>
      <label>
        Username:{" "}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
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
