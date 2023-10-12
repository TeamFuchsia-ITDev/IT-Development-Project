"use client";

import { Navbar } from "@/app/components/navbar";
import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import gaming from "@/app/images/gaming.png";
import sports from "@/app/images/sports.png";
import technology from "@/app/images/technology.png";
import travel from "@/app/images/travel.png";
import shopping from "@/app/images/shopping.png";
import cooking from "@/app/images/cooking.png";
import Housecleaning from "@/app/images/HouseCleaning.png";
import groceries from "@/app/images/Groceries.png";

import Arts from "@/app/images/Arts.png";
import assistance from "@/app/images/Assistance.png";
import babysitting from "@/app/images/Babysitting.png";
import companionship from "@/app/images/Companionship.png";
import fitness from "@/app/images/Fitness.png";
import handyman from "@/app/images/Handyman.png";
import music from "@/app/images/Music.png";
import petcare from "@/app/images/PetCare.png";
import tutoring from "@/app/images/Tutoring.png";
import virtual from "@/app/images/Virtual.png";
import outdoor from "@/app/images/Outdoor.png";
import transportation from "@/app/images/Transportation.png";
import tech from "@/app/images/Techsupport.png";



import axios from "axios";
import toast from "react-hot-toast";
import { UserProps, ImageMapping } from "@/app/libs/interfaces";

export default function PostRequest() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<UserProps | undefined>(undefined);
  const [disabled, setDisabled] = useState(false);

  const [data, setData] = useState({
    taskname: "",
    category: "",
    amount: "",
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

  
  const CategoryOptions = [
    "Companionship", 
    "Assistance",
    "Outdoor Activities",  
   "Virtual Assistance", 
    "Gaming",
    "Travel",
    "Sports",
    "Technology",
    "Fitness",
    "Music",
    "House Cleaning",
    "Cooking",
    "Shopping",
    "Pet Care",
    "Babysitting",
    "Tutoring",
    "Transportation",
    "Tech Support",
    "Art & Design",
    "Handyman", 
    "Groceries",
  ];

  const imageMapping: ImageMapping = {
  
    Gaming: gaming.src,
    Travel: travel.src,
    Technology: technology.src, 
    Sports: sports.src,
    Shopping: shopping.src,
    Cooking: cooking.src,
    "House Cleaning": Housecleaning.src,
    Groceries: groceries.src,
    "Art & Design": Arts.src,
    Assistance: assistance.src,
    Babysitting: babysitting.src,
    Companionship: companionship.src,
    Fitness: fitness.src,
    Handyman: handyman.src,
    Music: music.src,
    "Pet Care": petcare.src,
    Tutoring: tutoring.src,
    "Virtual Assistance": virtual.src,
    "Outdoor Activities": outdoor.src,
    Transportation: transportation.src,
    "Tech Support": tech.src,

};

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
        router.push("/myrequest");
      }, 2000);
    }
    setTimeout(() => setDisabled(false), 4000);
  };

  return (
    <main className="ml-12 mr-12">
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
              <p className="text-[13px] mt-4">Task Name</p>
              <input
                type="text"
                placeholder=""
                className="border-2 border-gray-300 h-[45px]"
                id="taskname"
                name="taskname"
                value={data.taskname}
                onChange={(e) => setData({ ...data, taskname: e.target.value })}
              />
              <p className="text-[13px]">Category</p>
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
              <p className="text-[13px]">
                Amount (this is optional kindly input 0 if free)
              </p>
              <input
                type="text"
                placeholder=""
                className="border-2 border-gray-300 h-[45px] "
                id="amount"
                name="amount"
                value={data.amount}
                onChange={(e) => setData({ ...data, amount: e.target.value })}
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
                placeholder=""
                className="border-2 border-gray-300 h-[150px] resize-none "
                id="description"
                name="description"
                value={data.description}
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
              />
              <p className="text-[10px]">
                <a className="text-rose-600">Note:</a> Once request is posted,
                your profile details will be shown to the companions once they
                viewed the request.
              </p>
              <button
                className="text-center bg-rose-500 text-white font-bold mb-12 rounded h-[45px] hover:bg-white hover:text-rose-500 hover:border-[2px] hover:border-rose-500 hover:ease-in-out duration-300"
                onClick={postRequest}
                disabled={disabled}
              >
                Post Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
