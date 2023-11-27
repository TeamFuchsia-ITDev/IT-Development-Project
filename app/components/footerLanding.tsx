"use client";

import Link from "next/link";
import logo from "@/app/images/Serve-ease.svg";

export const FooterLanding = () => {
  return (
    <div className="flex flex-col h-[300px] border-t-2 mt-24">
      <div className="flex flex-col justify-center items-center text-center text-[17px]">
        <img src={logo.src} alt="Serve-Ease" width={300} className="pt-8" />
        <p className="pb-8 text-[10px] text-gray-500">Copyright 2023 Serv-ease CA, Angelo & Michael</p>
        <a href="https://storyset.com/work" className="text-[10px] text-gray-500 ">Illustration by Storyset</a>
        <p>
          " We may not have the power to change the world for everyone, but we
          each possess{" "}
          
            the potential to brighten someone's world so what are you waiting
            for? "
          
        </p>
      </div>

      <div className="flex flex-col justify-center items-center pt-8">
        <Link href="/register">
        <button className="bg-yellow-400 rounded-[10px] font-bold text-white text-[20px] w-[200px] h-[45px] hover:bg-white hover:text-yellow-400 hover:border-[2px] hover:border-yellow-400 hover:ease-in-out duration-300 mt-4 mb-8">
          Get Started
        </button>
        </Link>
       
      </div>
    </div>
  );
};
