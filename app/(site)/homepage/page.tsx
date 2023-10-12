"use client";

import { Navbar } from "../../components/navbar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card } from "@/app/components/card";
import Carousel from "@/app/components/carousel";
import axios from "axios";
import { UserProps, RequestProps } from "../../libs/interfaces";
import { CategoryOptions  } from "@/app/libs/reusables";


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
      (amount === "" || parseFloat(amount) >= request.amount) &&
      (selectedCity === "" || request.requesterCity === selectedCity)
    );
  });

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
    </main>
  );
}
