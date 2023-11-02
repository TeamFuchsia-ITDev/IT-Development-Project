"use client";

import { Navbar } from "@/app/components/navbar";
import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { UserProps } from "@/app/libs/interfaces";
import { imageMapping, CategoryOptions, numberofCompanion  } from "@/app/libs/reusables";

export default function PostRequest() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<UserProps | undefined>(undefined);
  const [disabled, setDisabled] = useState(false);
  const [mode, setMode] = useState(true);

  const toggleMode = (newMode: boolean) => {
    setMode(newMode);
  };

  const [data, setData] = useState({
    taskname: "",
    category: "",
	compNeeded: "",
    datetime: "",
    description: "",
  });

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`/api/user/profile/${session?.user.email}`);
      const data = await response.json();
      setUser(data);
    };
    if (session?.user?.email) getUser();
  }, [session?.user?.emai]); 

  const postRequest = async (e: FormEvent) => {
    setDisabled(true);
    e.preventDefault();
    toast.loading("Creating Request...", {
      duration: 4000,
    });

    const response = await axios.post(`api/user/request`, data);
    if (response.data.status !== 200) {
      const errorMessage = response.data?.error || "An error occurred";
      toast.error(errorMessage);
    } else {
      toast.success("Request Creation successful!");
      setTimeout(
        () =>
          toast.loading("Redirecting now to the your request page...", {
            duration: 4000,
          }),
        1000
      );
      setTimeout(() => {
        toast.dismiss();
        router.push("/dashboard");
      }, 2000);
    }
    setTimeout(() => setDisabled(false), 4000);
  };

  return (
    <main className="pl-24 pr-24">
      <Navbar />
      <div className="ml-4 mr-4 mt-24">
        <div className="ml-4 mr-4 text-center">
          <p className="text-[40px]">Welcome to your Post page</p>
          <p className="text-[20px]  ">
            In here you will be able to fill up and post requests you need help
            with
          </p>
        </div>

        <div className="flex flex-col items-center mt-4">
          <div className="flex flex-col w-[700px] border-2 mt-4 items-center mb-12 shadow-lg ">
            <img src={imageMapping[data.category]} className="" />

            <div className="flex flex-col w-[400px] gap-4 ">
              {" "}
              <p className="text-center underline underline-offset-8 decoration-rose-500 decoration-2 mt-12">
                Request Form
              </p>
              
              <p className="text-[13px] mt-4">Category</p>
              <select
                className="border-2 border-gray-300  h-[45px] "
                id="categories"
                name="categories"
                value={data.category}
                onChange={(e) => setData({ ...data, category: e.target.value })}
              >
                <option value="" disabled>
                  Select Category
                </option>
                {CategoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>


              <p className="text-[13px] ">Companion Needed</p>
              <select
                className="border-2 border-gray-300  h-[45px] "
                id="companionCount"
                name="companionCount"
				value={data.compNeeded}
				onChange={(e) => setData({ ...data, compNeeded: e.target.value })}
              >
                <option value="" disabled>
                  Select Number of Companion Needed
                </option>
                {numberofCompanion.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>


              <p className="text-[13px] ">Task Name</p>
              <input
                type="text"
                placeholder="Playing basketball, walking my dog, etc."
                className="border-2 border-gray-300 h-[45px]"
                id="taskname"
                name="taskname"
                value={data.taskname}
                onChange={(e) => setData({ ...data, taskname: e.target.value })}
              />              
              <p className="text-[13px]">Date</p>
              <input
                type="Datetime-local"
                placeholder=""
                className="border-2 border-gray-300 h-[45px] "
                id="datetime"
                name="datetime"
                value={data.datetime}
                onChange={(e) => setData({ ...data, datetime: e.target.value })}
              />
              <p className="text-[13px]">Brief Description of the task</p>
              <textarea
                placeholder="what the goal of the task is, etc."
                className="border-2 border-gray-300 h-[150px] resize-none "
                id="description"
                name="description"
                value={data.description}
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
              />
              <p className="text-[10px] text-[13px]">
                <a className="text-rose-600 text-[13px]">Note:</a> Once request is posted,
                your profile details will be shown to the companions once they
                viewed the request.
              </p>
              <button
                className={`${disabled ? " text-center bg-rose-500 opacity-50 text-white font-bold mb-12 rounded h-[45px]" : "text-center bg-rose-500 text-white font-bold mb-12 rounded h-[45px] hover:bg-white hover:text-rose-500 hover:border-[2px] hover:border-rose-500 hover:ease-in-out duration-300"} ${disabled && "cursor-not-allowed"}`}
                onClick={postRequest}
                disabled={disabled}
              >
                Create Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
