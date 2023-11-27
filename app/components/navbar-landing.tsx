"use client";

import Link from "next/link";
import { useState } from "react";
import serveease from "@/app/images/Serve-ease.svg";
import burger from "@/app/images/burger.svg";
import Xnav from "@/app/images/Xnav.svg";

export const NavbarLanding = () => {
  const [isNavbarOpen, setNavbarOpen] = useState(false);

  const toggleNavbar = () => {
    setNavbarOpen(!isNavbarOpen);
  };

  return (
    <main className="pt-4">
      <div className="flex flex-row justify-between items-center pr-4 ">
        <div>
          <img src={serveease.src} alt="Serve-Ease" width={200} />
        </div>
        <div className="sm:hidden md:hidden">
          {isNavbarOpen ? ( <img src={Xnav.src} alt="burger" width={30} onClick={toggleNavbar} className=""/>) : ( <img src={burger.src} alt="burger" width={30} onClick={toggleNavbar} className=""/>)}
         
        </div>
        <div
          className={`${
            isNavbarOpen ? "block flex flex-col bg-zinc-100 absolute w-[100%] h-[100%] top-[60px] pb-4 pt-4 pl-6" : "hidden  items-center"
          } sm:flex sm:flex-row gap-4  z-10 `}
        >
          <h1>Why Join</h1>
          <h1>How it works</h1>
          <Link href="/login">
            <h1>Sign in</h1>
          </Link>
          <Link href="/register">
            <button className="border-2 rounded-md w-32 h-8 bg-blue-500 text-white text-[12px] hover:font-bold  hover:bg-white hover:text-blue-500 hover:border-[2px] hover:border-blue-500 hover:ease-in-out duration-300">
              Join Now
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
};
