"use client";
import axios from "axios";
import { Navbar } from "../../components/navbar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { UserProps, RequestProps } from "../../libs/interfaces";
import { RequestCard } from "@/app/components/requestcard";
import Carousel from "@/app/components/carousel";
import { useRouter } from "next/navigation";

export default function MyRequest() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<UserProps | undefined>(undefined);
  const [myRequests, setMyRequests] = useState<RequestProps[]>([]);

  useEffect(() => {
    // Redirect to login page if there is no session
    if (status !== "loading" && !session) {
      router.push("/login");
    }
  }, [session, status, router]);

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
    <main className="pl-24 pr-24">
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
            loop={false}
            slidesPerView={3}
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
