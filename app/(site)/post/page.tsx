"use client";
import { Navbar } from "../../components/navbar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import gaming from "../../images/gaming.png";
import blankprofile from "../../images/blank-profile.jpg";

interface UserProps {
  id: string;
  name: string;
  ethnicity: string;
  gender: string;
  birthday: string;
  phonenumber: string;
  image: string;
  userEmail: string;
  location: {
    lng: number;
    lat: number;
    address: {
      fullAddress: string;
      pointOfInterest: string;
      city: string;
      country: string;
    };
  };
}

export default function PostRequest() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<UserProps | undefined>(undefined);

  useEffect(() => {
    if (status === "loading") {
      return; // Return early to prevent rendering more hooks
    }

    // If there is no session, redirect to the login page
    if (session) {
      router.replace("/"); // Use router.replace to avoid extra rendering
      return; // Return early to prevent rendering more hooks
    }
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`/api/user/profile/${session?.user.email}`);
      const data = await response.json();
      setUser(data);
    };
    if (session?.user?.email) getUser();
  }, [session?.user?.emai]);

  const Categoryoptions = [
    "Gaming",
    "Travel",
    "Technology",
    "Sports",
    "Workout",
  ];

  return (
    <>
      <Navbar />
      <div className="ml-4 mr-4 mt-24">
        <div className="ml-4 mr-4">
          <p className="text-[60px]">Welcome to your Post page</p>
          <p className="text-[20px] w-[900px] ">
            In here you will be able to fill up and post requests you need help
            with{" "}
          </p>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-center underline underline-offset-8 decoration-rose-500 decoration-2 mt-24">
            Request Form
          </p>

          <div className="flex flex-col w-[700px] border-2 mt-4 items-center mb-12 shadow-lg">
            <img src={gaming.src} className="" />
            <div className="flex flex-col">
              <img
                src={blankprofile.src}
                className=" object-cover w-[150px] h-[150px] rounded-full border-4 mt-[-80px] border-white"
              />
              <p className="flex items-center text-[20px] justify-center mb-12">
                Name
              </p>
            </div>

            <div className="flex flex-col w-[400px] gap-4 ">
              <p className="text-[13px]">Task Name</p>
              <input
                type="text"
                placeholder=""
                className="border-2 border-gray-300 h-[45px]  "
              />

              <p className="text-[13px]">Category</p>
              <select
                className="border-2 border-gray-300  h-[45px] "
                id="categories"
                name="categories"
              >
                <option value="" disabled>
                  Select Category
                </option>
                {/* Map through the array to generate options */}
                {Categoryoptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <p className="text-[13px]">Date</p>
              <input
                type="Datetime-local"
                placeholder=""
                className="border-2 border-gray-300 h-[45px] "
              />

              <p className="text-[13px]">Brief Description of the task</p>
              <textarea
                placeholder=""
                className="border-2 border-gray-300 h-[150px] resize-none "
              />
              <p className="text-[10px]">
                <a className="text-rose-600">Note:</a> Once request is posted,
                your profile details will be shown to the companions once they
                viewed the request.
              </p>
              <button className="text-center bg-rose-500 text-white font-bold mb-12 rounded h-[45px] hover:bg-white hover:text-rose-500 hover:border-[2px] hover:border-rose-500 hover:ease-in-out duration-300">
                Post Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
