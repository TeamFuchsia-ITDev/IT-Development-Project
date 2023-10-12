"use client";
import axios from "axios";
import { Navbar } from "../../components/navbar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { UserProps, RequestProps } from "../../libs/interfaces";
import { Card } from "@/app/components/card";

export default function MyRequest() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserProps | undefined>(undefined);
  const [myRequests, setMyRequests] = useState<RequestProps[]>([]);

  console.log("myrequests", myRequests);

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`/api/user/profile/${session?.user.email}`);
      const data = await response.json();
      setUser(data);
    };

    const getRequest = async () => {
      const response = await axios.get(`/api/user/request`);
      const data = await response.data;
      const filteredRequests = data.requests.filter(
        (request: { userEmail: string }) =>
          request.userEmail === session?.user.email
      );
      setMyRequests(filteredRequests);
    };

    if (status !== "loading" && session?.user.email) {
      getUser();
      getRequest();
    }
  }, [session?.user.email, status]);

  return (
    <main className="ml-12 mr-12">
      <Navbar />
      <div className="ml-4 mr-4 mt-24">
        <div className="ml-4 mr-4">
          <p className="text-[40px] text-center">Welcome to your Requests page</p>
          <p className="text-[20px]  text-center">
            In here you will be able to see all the requests that you have
            created
          </p>
        </div>
        <div>
          {/* <p className="text-[30px] mt-8 text-center underline underline-offset-8 decoration-rose-500 decoration-2 underline-offset-6">
            My Requests
          </p> */}
        </div>
        <div className="flex flex-row gap-4 justify-center mt-4">
          {myRequests.map((request: RequestProps, index: number) => (
            <div key={index}>
              <Card request={request} smallCard={true} />
            </div>
           
          ))} 
        </div>
      </div>
    </main>
  );
}

{
  /* <p>{request.taskname}</p>
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
                value={new Date(new Date(request.datetime).getTime() - (new Date(request.datetime).getTimezoneOffset() * 60000)).toISOString().slice(0, 16)}
                readOnly
              />
              <p>{request.userEmail}</p> */
}
