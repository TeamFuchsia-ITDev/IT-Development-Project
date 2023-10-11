"use client";

import { Navbar } from "../../components/navbar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card } from "@/app/components/card";
import Carousel from "@/app/components/carousel";
import axios from "axios";
import { UserProps, RequestProps } from "../../libs/interfaces";
import search from "../../images/search.svg";


export default function homepage() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserProps | undefined>(undefined);
  const [requests, setRequests] = useState<RequestProps[]>([]);

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`/api/user/profile/${session?.user.email}`);
      const data = await response.json();
      setUser(data);
    };

    const getRequests = async () => {
      const response = await axios.get(`/api/user/request`);
      const data = await response.data;
      const filteredRequests = data.requests.filter(
        (request: { userEmail: string }) =>
          request.userEmail !== session?.user.email
      );
      setRequests(filteredRequests);
    };

    if (status !== "loading" && session?.user.email) {
      getUser();
      getRequests();
    }
  }, [session?.user.email, status]);


  const Categoryoptions = [
    "Gaming",
    "Travel",
    "Technology",
    "Sports",
    "Workout",
  ];


  const CityOptions = [
    "Vancouver",
    "Victoria",
    "Nanaimo",
    "Kelowna",
    "Burnaby",
    "Richmond",
    "Abbotsford",
    "Coquitlam",
    "Surrey",
    "Langley",
    "North Vancouver",
    "Maple Ridge",
    "Prince George",
    "New Westminster",
    "Port Coquitlam",
  ];

  return (
    <main className="ml-12 mr-12">
      <Navbar />
      <div className="ml-4 mr-4 mt-24">
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
            className="border-2 border-gray-300  h-[45px] w-[520px] "
          />
          
       
          <select className="border-2 border-gray-300  h-[45px] w-[250px] ml-4" > <option value="" disabled>

            Select Category
          </option>
            {/* Map through the array to generate options */}
            {Categoryoptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}</select>


          <select className="border-2 border-gray-300  h-[45px] w-[250px] ml-4" > <option value="" disabled>
            Select City
          </option>
            {/* Map through the array to generate options */}
            {CityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}</select>


          <select className="border-2 border-gray-300  h-[45px] w-[250px] ml-4" />
        </div>

        <div className="rounded-[5px] mt-12  mb-12">
          <div className="flex flex-row mt-2 ml-2">
            <h1 className="text-2xl ">Most Recent <a className="text-rose-500">Requests</a></h1>

            <div className="flex gap-4 mr-4  mt-4 "></div>
          </div>
          <div className="mt-12 mb-12 gap-4 flex  overflow-hidden">
            <Card smallCard={false} />
            <Card smallCard={false} />
            <Card smallCard={false} />
          </div>
        </div>
        <div className="shadow-inner mr-2">
          <Carousel
            cards={[
              <Card smallCard={true} />,
              <Card smallCard={true} />,
              <Card smallCard={true} />,
              <Card smallCard={true} />,
              <Card smallCard={true} />,
              <Card smallCard={true} />,
            ]}
          />
        </div>
        <div>
          {requests.map((request, index) => (
            <div key={index}>
              <p>{request.taskname}</p>
              <p>{request.category}</p>
              <p>{request.amount}</p>
              <p>
                {new Date(request.datetime).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <input
                type="datetime-local"
                value={new Date(
                  new Date(request.datetime).getTime() -
                  new Date(request.datetime).getTimezoneOffset() * 60000
                )
                  .toISOString()
                  .slice(0, 16)}
                readOnly
              />
              <p>{request.userEmail}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
