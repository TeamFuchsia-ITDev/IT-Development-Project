"use client";

import { Navbar } from "../../components/navbar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { UserProps } from "@/app/libs/interfaces";

export default function MyJobs() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserProps | undefined>(undefined);
  const [mode, setMode] = useState(true);

  const toggleMode = (newMode: boolean) => {
    setMode(newMode);
  };

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`/api/user/profile/${session?.user.email}`);
      const data = await response.json();
      setUser(data);
    };
    if (session?.user.email) getUser();
  }, [session?.user.email]);

  return (
    <main className="ml-12 mr-12">
      <Navbar mode={mode} toggleMode={toggleMode} />
      <div className="ml-4 mr-4 mt-24">
        <div className="flex flex-col items-center mt-4">
          <div className="flex flex-col w-[500px] border-2 mt-4 items-center mb-12 shadow-lg ">
            <p className="text-center underline underline-offset-8 decoration-rose-500 decoration-2 mt-6">
              Application Form
            </p>
            <div className="ml-4 mr-4 text-center ">
              <h1 className="text-[13.5px] mt-4">
                You are now applying for (Requester name)'s (task name) at
                (Datetime).{" "}
              </h1>
              <p className="text-[13px]">
                to let the requester know more about you fill up the form below
              </p>
            </div>

            <div className="">
              <p className="text-[13px] mt-8 mb-4">
                <a className="text-green-500">Amount</a> ( the amount you want
                for your service, input 0 if free)
              </p>
              <input
                type="text"
                placeholder="$ CAD"
                className="border-2 border-gray-300 h-[45px] w-[400px]"
              />
              <p className="text-[13px] mt-4 mb-4">
                <a className="text-rose-500">Explain</a> Why are you a good fit
                to apply?
              </p>
              <textarea
                placeholder="experience, skills, etc."
                className="border-2 border-gray-300 h-[150px] resize-none w-[400px] mb-4"
                id="description"
                name="description"
              />
            </div>
            <button className="text-center bg-rose-500 text-white font-bold mb-8 rounded h-[45px] w-[400px] hover:bg-white hover:text-rose-500 hover:border-[2px] hover:border-rose-500 hover:ease-in-out duration-300">
              Apply
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
