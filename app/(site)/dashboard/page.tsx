"use client";
import axios from "axios";
import { Navbar } from "../../components/navbar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { UserProps, RequestProps } from "../../libs/interfaces";
import { RequestCard } from "@/app/components/requestcard";
import Carousel from "@/app/components/carousel";
import { useRouter } from "next/navigation";
import question from "@/app/images/question.svg";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<UserProps | undefined>(undefined);
  const [myRequests, setMyRequests] = useState<RequestProps[]>([]);
  const [page, setPage] = useState("Pending");

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
      <div className="mt-24">
        <div className=" text-center">
          <p className="text-[40px]">Welcome to your Dashboard</p>

          <p className="text-[16px] ">
            In here you will be able to see all requests you have created need
          </p>
          <p className=" ">
            further explanation?{" "}
            <a href="#" className="text-rose-500">
              click here
            </a>
          </p>
        </div>
        <div className="flex items-center justify-center mt-8 mb-4">
          <div className="flex flex-row w-[100%] h-[40px]">
            <button
              className={`${
                page === "Pending"
                  ? "rounded-t-2xl bg-orange-300 w-[25%] text-white font-bold border-b-4 border-orange-500"
                  : "rounded-t-2xl bg-orange-300 w-[25%] text-gray-200"
              }`}
              onClick={() => setPage("Pending")}
            >
              Pending Request
            </button>
            <button
              className={`${
                page === "Active"
                  ? "rounded-t-2xl bg-green-400 w-[25%] text-white border-b-4 border-green-600 font-bold"
                  : " rounded-t-2xl bg-green-400 w-[25%] text-gray-200"
              }`}
              onClick={() => setPage("Active")}
            >
              Active Request
            </button>
            <button
              className={`${
                page === "Completed"
                  ? "rounded-t-2xl bg-blue-400 w-[25%] text-white font-bold border-b-4 border-blue-600"
                  : " rounded-t-2xl bg-blue-400 w-[25%] text-gray-200"
              }`}
              onClick={() => setPage("Completed")}
            >
              Completed Request
            </button>
            <button
              className={`${
                page === "Cancelled"
                  ? "rounded-t-2xl bg-red-400 w-[25%] text-white font-bold border-b-4 border-red-600"
                  : " rounded-t-2xl bg-red-400 w-[25%] text-gray-200"
              }`}
              onClick={() => setPage("Cancelled")}
            >
              Cancelled Request
            </button>
          </div>
        </div>
        {page === "Pending" ? (
          myRequests.filter(
            (request: RequestProps) => request.status === "Pending"
          ).length <= 0 ? (
            <p>
              You have not created a request yet, <a>Create one now</a>
            </p>
          ) : (
            <Carousel
              loop={false}
              slidesPerView={3}
              cards={myRequests
                .filter((request: RequestProps) => request.status === "Pending")
                .map((request: RequestProps, index: number) => (
                  <div key={index}>
                    <RequestCard request={request} />
                  </div>
                ))}
            />
          )
        ) : null}

        {page === "Active" ? (
          <Carousel
            loop={false}
            slidesPerView={3}
            cards={myRequests
              .filter((request: RequestProps) => request.status === "OnGoing")
              .map((request: RequestProps, index: number) => (
                <div key={index}>
                  <RequestCard request={request} />
                </div>
              ))}
          />
        ) : null}

        {page === "Completed" ? (
          <Carousel
            loop={false}
            slidesPerView={3}
            cards={myRequests
              .filter((request: RequestProps) => request.status === "Completed")
              .map((request: RequestProps, index: number) => (
                <div key={index}>
                  <RequestCard request={request} />
                </div>
              ))}
          />
        ) : null}
      </div>
    </main>
  );
}
