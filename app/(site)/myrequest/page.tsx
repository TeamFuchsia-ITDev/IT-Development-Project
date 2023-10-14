"use client";
import axios from "axios";
import { Navbar } from "../../components/navbar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { UserProps, RequestProps } from "../../libs/interfaces";
import { RequestCard } from "@/app/components/requestcard";
import Carousel from "@/app/components/carousel";

export default function MyRequest() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserProps | undefined>(undefined);
  const [myRequests, setMyRequests] = useState<RequestProps[]>([]);
  

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
          <p className="text-[40px] text-center">
            Welcome to your Requests page
          </p>
          <p className="text-[20px]  text-center">
            In here you will be able to see all the requests that you have
            created
          </p>
        </div>

        <div className="mt-6 ">
          <Carousel
            cards={myRequests.map((request: RequestProps, index: number) => (
              <div key={index}>
                <RequestCard request={request} />
              </div>
            ))}
          />
        </div>
      </div>
    </main>
  );
}
