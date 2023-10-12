"use client";

import { Navbar } from "../../components/navbar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card } from "@/app/components/card";
import Carousel from "@/app/components/carousel";
import x from "@/app/images/x.svg";
import axios from "axios";
import { UserProps, RequestProps } from "../../libs/interfaces";
import { CategoryOptions } from "@/app/libs/reusables";


export default function homepage() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserProps | undefined>(undefined);
  const [requests, setRequests] = useState<RequestProps[]>([]);

  /** Search Related useStates */
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`/api/user/profile/${session?.user.email}`);
      const data = await response.json();
      setUser(data);
    };

    const getRequests = async () => {
      const response = await axios.get(`/api/user/request`);
      const data = await response.data;
      const filteredRequests: RequestProps[] = data.requests.filter(
        (request: { userEmail: string }) =>
          request.userEmail !== session?.user.email
      );
      setRequests(filteredRequests);


      const uniqueCities = new Set<string>();

      filteredRequests.forEach((item: RequestProps) => {
        if (item.requesterCity) {
          uniqueCities.add(item.requesterCity)
        }
      })

      setCities(Array.from(uniqueCities))
    };

    if (status !== "loading" && session?.user.email) {
      getUser();
      getRequests();
    }
  }, [session?.user.email, status]);



  const searchFilteredRequests = requests.filter((request) => {
    return (
      (request.taskname.includes(searchTerm) ||
        request.description.includes(searchTerm)) &&
      (selectedCategory === "" || request.category === selectedCategory) &&
      (selectedCity === "" || request.requesterCity === selectedCity)
    );
  });

  return (
    <main className="ml-12 mr-12 relative ">
      <Navbar />
      <div className="ml-4 mr-4 mt-24 w-[100%]"> 
        <div className="mr-4">
          {user ? (
            <>
              <p className="text-[40px]">
                Welcome to your Homepage {user.name.split(" ")[0]}
              </p>
            </>
          ) : (
            <p className="text-[40px]">Welcome to your Homepage</p>
          )}
          <p className="text-[20px] w-[900px] ">
            In here you will be able to see latest requests and also allows you
            to search certain requests you want to help someone with
          </p>
        </div>

        <div className=" flex flex-row  mr-4 mt-12">
          <input
            type="text"
            placeholder="Search for a request"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-2 border-gray-300  h-[45px] w-[520px] "
          />

          <select
            className="border-2 border-gray-300  h-[45px] w-[250px] ml-4"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="">All Categories</option>
            {/* Map through the array to generate options */}
            {CategoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            className="border-2 border-gray-300  h-[45px] w-[250px] ml-4"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="" disabled>
              Select City
            </option>
            <option value="">All Cities</option>
            {/* Map through the array to generate options */}
            {cities.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <input
            type="text"
            id="amount"
            name="amount"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border-2 border-gray-300  h-[45px] w-[250px] ml-4"
          />
        </div>

        <div className="mt-12 mb-12">
          <div className="flex flex-row mt-2 ml-2">
            <h1 className="text-2xl ">
              Most Recent <a className="text-rose-500">Requests</a>
            </h1>

            <div className="flex gap-4 mr-4  mt-4 "></div>
          </div>
          <div className="mt-12 mb-12 gap-4 flex">
            {/* <Card smallCard={false} />
            <Card smallCard={false} />
            <Card smallCard={false} /> */}

            {searchFilteredRequests.slice(0, 3).map((request, index) => (
              <div key={index}>
                <Card request={request} smallCard={false} />
              </div>
            ))}
          </div>
        </div>
        <div className="" >
          <Carousel
            cards={searchFilteredRequests.map(
              (request: RequestProps, index: number) => (
                <div key={index}>
                  <Card request={request} smallCard={true} />
                </div>
              )
            )}
          />
        </div>
      </div>


 
        <div className="flex flex-col w-[500px] border-2 mt-4 items-center mb-12 shadow-lg bg-white fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-zinc-50">
          <img
            src={x.src}
            alt="X"
            width={20}
            className="m-2 absolute right-0 top-0 cursor-pointer"/>

          <p className="text-center underline underline-offset-8 decoration-rose-500 decoration-2 mt-6">
            Application Form
          </p>
          <div className="ml-4 mr-4 text-center ">
            <h1 className="text-[13.5px] mt-4" >You are now applying for (Requester name)'s (task name) at (Datetime). </h1>
            <p className="text-[13px]">to let the requester know more about you fill up the form below</p>
          </div>

          <div className="">
            <p className="text-[13px] mt-8 mb-4"><a className="text-green-500">Amount</a> ( the amount you want for your service, input 0 if free)</p>
            <input
              type="text"
              placeholder="$ CAD"
              className="border-2 border-gray-300 h-[45px] w-[400px]" />
            <p className="text-[13px] mt-4 mb-4"><a className="text-rose-500">Explain</a> Why are you a good fit to apply?</p>
            <textarea
              placeholder="experience, skills, etc."
              className="border-2 border-gray-300 h-[150px] resize-none w-[400px] mb-4"
              id="description"
              name="description" />
          </div>
          <button
            className="text-center bg-green-500 text-white font-bold mb-8 rounded h-[45px] w-[400px] hover:bg-white hover:text-green-500 hover:border-[2px] hover:border-green-500 hover:ease-in-out duration-300"


          >
            Apply
          </button>
        </div>
      

    </main>
  );
}
