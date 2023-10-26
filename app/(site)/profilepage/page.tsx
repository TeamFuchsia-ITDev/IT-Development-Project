"use client";

import { Navbar } from "@/app/components/navbar";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

const Profilepage = () => {
  const [mode, setMode] = useState(true);

  const searchParams = useSearchParams();

  let tab = searchParams.get("tab") ?? "Reviews";
  const [profilepage, setprofilepage] = useState(tab);
  

  const toggleMode = (newMode: boolean) => {
    setMode(newMode);
  };

  return (
    <main className="pl-24 pr-24">
      <Navbar />
      <div className="flex flex-row mt-12 gap-4">
        <div className="border-2 border-gray w-[600px] h-[400px] rounded-[5px]"></div>
        <div className="border-2 w-[100%] h-[600px] rounded-t-md">
          <div className="w-[100%]"></div>
          <button
            className={`${
              profilepage === "Reviews"
                ? " bg-white w-[50%] h-12 text-orange-500 font-bold border-t-4 border-orange-500 rounded-t-md"
                : "  w-[50%] text-gray-400  h-12 border-b-2 "
            }`}
            onClick={() => setprofilepage("Reviews")}
          >
            Reviews
          </button>
          <button
            className={`${
              profilepage === "analytics"
                ? " bg-white w-[50%] h-12 text-blue-500 font-bold border-t-4 border-blue-500 rounded-t-md"
                : "  w-[50%] text-gray-400  h-12 border-b-2 "
            }`}
            onClick={() => setprofilepage("analytics")}
            id="analytics"
          >
            Analytics
          </button>

          {profilepage === "Reviews" ? <></> : null}
          {profilepage === "analytics" ? <></> : null}
        </div>
      </div>
    </main>
  );
};

export default Profilepage;
