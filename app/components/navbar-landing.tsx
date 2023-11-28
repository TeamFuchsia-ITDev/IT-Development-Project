"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import serveease from "@/app/images/Serve-ease.svg";
import Xnav from "@/app/images/Xnav.svg";
import burger from "@/app/images/burger.svg";
import { navItems } from "@/app/libs/reusables";

export const NavbarLanding = () => {
  const [isNavbarOpen, setNavbarOpen] = useState(false);

  const toggleNavbar = () => {
    setNavbarOpen(!isNavbarOpen);
  };



  return (
    <main className="pt-4">
      <div className="flex flex-row justify-between items-center pr-4">
        <div>
          <img src={serveease.src} alt="Serve-Ease" width={200} />
        </div>
        <div className="hidden md:hidden lg:flex xl:flex justify-center flex items-center">
          {navItems.map((item, index) => (
            <Link key={index} href={item.link}>
              <h1 className="mr-4">{item.text}</h1>
            </Link>
          ))}
          <Link href="/login">
            <h1 className="mr-4">Sign in</h1>
          </Link>
          <Link href="/register">
            <button className="border-2 rounded-md w-32 h-8 bg-blue-500 text-white text-[12px] hover:font-bold  hover:bg-white hover:text-blue-500 hover:border-[2px] hover:border-blue-500 hover:ease-in-out duration-300">
              Join Now
            </button>
          </Link>
        </div>
        <div className="block md:block lg:hidden xl:hidden ">
          <img
            src={isNavbarOpen ? Xnav.src : burger.src}
            alt="burger"
            width={30}
            onClick={toggleNavbar}
            className=""
          />
        </div>
        <AnimatePresence>
          {isNavbarOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "100vh", backgroundColor: "#2E40AF" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-col items-center absolute w-full top-[60px] justify-center text-center gap-20"
            >
              {navItems.map((item, index) => (
                <Link key={index} href={item.link}>
                  <motion.h1
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={{ color: "#ffffff", fontSize: "20px" }}
                  >
                    {item.text}
                  </motion.h1>
                </Link>
              ))}
              <Link href="/login">
                <motion.h1
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{ color: "#ffffff", fontSize: "20px" }}
                >
                  Sign in
                </motion.h1>
              </Link>
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className=" rounded-md w-32 h-8 bg-yellow-500 font-bold text-white text-[20px] hover:font-bold hover:bg-white-400 hover:text-white hover:border-[2px] hover:border-yellow-400 hover:ease-in-out duration-300"
                >
                  Join Now
                </motion.button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};


