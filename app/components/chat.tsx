import React, { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

interface SocketReference {
  current: Socket | null;
}

const ChatComponent = () => {
  const socket: SocketReference = useRef<Socket | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const sendMessage = () => {
    if (inputValue) {
      socket.current?.emit("message", inputValue);
      setInputValue("");
    }
  };

  useEffect(() => {
    socket.current = io("ws://localhost:3001");

    socket.current?.on("message", (data: string) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.current?.disconnect();
    };
  }, []);

  return (
    <div>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatComponent;
