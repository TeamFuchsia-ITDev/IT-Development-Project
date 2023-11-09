"use client";

import Link from "next/link";
import serveease from "@/app/images/Serve-ease.svg";

export const NavbarLanding = () => {
  return (
    <main className="pt-4" >
      <div className="flex flex-row justify-between items-center pl-4 pr-4 pb-4">
        <div>
          <img src={serveease.src} alt="Serve-Ease" width={200} />
        </div>
        <div className="flex flex-row gap-4  items-center">
          <h1 >Why Join</h1>
          <h1>How it works</h1>
          <Link href="/login">
          <h1 >Sign in</h1>
            </Link>
            <Link href="/register">
          <button className="border-2 rounded-md w-32 h-8 bg-blue-500 text-white text-[12px]  hover:bg-white hover:text-blue-500 hover:border-[2px] hover:border-blue-500 hover:ease-in-out duration-300">
            {" "}
            Join Now
          </button>
            </Link>
        </div>
      </div>
    </main>
  );
};
