"use client";

// ModeContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { ModeContextType } from "@/app/libs/interfaces";

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider = ({ children }: { children: React.ReactNode }) => {
  //   const [mode, setMode] = useState(() => {
  //     if (typeof localStorage !== "undefined") {
  //       const storedMode = localStorage.getItem("mode");
  //       return storedMode === "true";
  //     } else {
  //       return false;
  //     }
  //   });

  //   useEffect(() => {
  //     localStorage.setItem("mode", mode.toString());
  //   }, [mode]);

  const [mode, setMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedMode = localStorage.getItem("mode");
      if (storedMode === "" || storedMode === "true") {
        setMode(true);
      }
    }
  }, []);

  console.log("Context Mode", mode);

  useEffect(() => {
    localStorage.setItem("mode", mode.toString());
  }, [mode]);
  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
};
export const useMode = () => {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error("useMode must be used within a ModeProvider");
  }
  return context;
};
