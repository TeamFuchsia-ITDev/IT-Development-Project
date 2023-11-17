"use client";

import { Navbar } from "../../components/navbar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ApplicationProps, RequestProps } from "@/app/libs/interfaces";
import { CompanionCard } from "@/app/components/companioncard";
import Carousel from "@/app/components/carousel";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { ethnicityOptions, genderOptions } from "@/app/libs/reusables";
import search from "@/app/images/Search.svg";
import { HiredApplicantsCard } from "@/app/components/hiredApplicants";
import ReviewCard from "@/app/components/reviewcard";


export default function RequestDonePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestIDParams = searchParams.get("id");
  const [applications, setApplications] = useState([]);
  const [request, setRequest] = useState<RequestProps | undefined>(undefined);
  const [activeDropdown, setActiveDropdown] = useState(-1);
  const [disabled, setDisabled] = useState(false);
  const [isReviewcardVisible, setIsReviewcardVisible] = useState(false);

  const toggleDropdown = (index: number) => {
    if (activeDropdown === index) {
      setActiveDropdown(-1);
    } else {
      setActiveDropdown(index);
    }
  };

  const revertApplicantStatus = async (applicantId: string) => {
    try {
      setDisabled(true);
      const response = await axios.patch(
        `/api/user/applications/${applicantId}`
      );
      if (response.status !== 200) {
        const errorMessage = response.data?.error || "An error occurred";
        toast.error(errorMessage);
      } else {
        toast.success("Application status reverted");
        setTimeout(() => setDisabled(false), 4000);
        setTimeout(() => {
          toast.dismiss();
          window.location.reload();
        }, 2000);
      } 

    } catch (error) {
      console.error("Unable to remove applicant", error);
    }


   
    
  };

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }
  }, [session, status, router]);

  useEffect(() => {
    const getApplications = async () => {
      const response = await fetch(`/api/user/applications/${requestIDParams}`);
      const data = await response.json();
      setApplications(data);
    };
    const getRequest = async () => {
      const response = await fetch(`/api/user/request/${requestIDParams}`);
      const data = await response.json();
      setRequest(data);
    };
    if (requestIDParams) {
      getApplications();
      getRequest();
    }
  }, [session?.user.email, requestIDParams]);

  return (
    <main className="pl-24 pr-24">
      <Navbar />
      <div className={`${isReviewcardVisible ? "pointer-events-none blur-sm" : ""}`}>
        <div className="mt-6 text-center">
          <p className="text-[30px] mt-12"> {request?.taskname} <span className="text-blue-500">applicants</span></p>
          <p className="text-md">
            In here you will be able to see all the hired applicants
            to your request
          </p>
          <div className="flex flex-row gap-4  justify-center mt-4">
            <div className="flex flex-row">
              <input
                type="text"
                placeholder="Search by description, city, name ..."
                className="w-[400px] rounded-md border-gray-300 border-2 p-2 focus:outline-none focus:border-transparent pl-10"
              />

              <img
                src={search.src}
                className="w-[35px] h-[30px] absolute pl-2 pt-3"
              />
            </div>
            <input
              type="text"
              placeholder="Age ..."
              className="w-[100px] rounded-md border-gray-300 border-2 p-2 focus:outline-none focus:border-transparent pl-3"
            />
            <select className="w-[170px] rounded-lg border-gray-300 border-2 p-2 focus:outline-none focus:border-transparent text-gray-500 pl-3">
              {" "}
              {ethnicityOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select className="w-[140px] rounded-lg border-gray-300 border-2 p-2 focus:outline-none focus:border-transparent text-gray-500 pl-3">
              {" "}
              {genderOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="flex flex-row items-center">
            <h1 className="font-bold mt-8 mb-4">Your reviewed applicants </h1>
            {applications
              .filter((app: ApplicationProps) => app.status === "Accepted")
              .map((app: ApplicationProps, index) => (
                <div className="relative inline-block" key={index}>
                  <img
                    src={app.compImage}
                    alt={`Image-${index}`}
                    className="w-[40px] h-[40px] rounded-full ml-4 border-gray-400 hover:scale-125 object-cover"
                    style={{
                      boxShadow: "4px 4px 10px rgba(153, 153, 153, 100%)",
                    }}
                    title={app.compName}
                    onClick={() => toggleDropdown(index)}
                  />

                  <ul
                    className={`absolute w-[130px] left-5 mt-2 bg-white border border-gray-300 rounded-md shadow-md z-10 ${
                      activeDropdown === index ? "block" : "hidden"
                    }`}
                  >
                    <li>
                      <Link
                        href={{
                          pathname: "/profilepage",
                          query: `user=${app?.userEmail}`,
                        }}
                      >
                        <button className="block px-4 py-2 cursor-pointer  hover:text-blue-500 w-full">
                          View Profile
                        </button>
                      </Link>
                    </li>
                    <li>
                      <button
                        className={`${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} block px-4 py-2 w-full hover:text-red-500 hover:text-bold`}
                        onClick={() => revertApplicantStatus(app.id)}
                        disabled={disabled}
                      >
                        Remove
                      </button>
                    </li>
                  </ul>
                </div>
              ))}
          </div>

          <h1 className="font-bold mt-2 mb-4">Applicants</h1>
          <Carousel
            loop={false}
            slidesPerView={4}
            cards={applications
              .filter(
                (application: ApplicationProps) =>
                  application.status === "Pending"
              )
              .map((application: ApplicationProps, index: number) => (
                <div key={index}>
                  <HiredApplicantsCard application={application} 
                  toggleReviewCardVisibility={setIsReviewcardVisible}
                  />
                </div>
              ))}
          />
        </div>
      </div>

      <ReviewCard 
      isReviewcardVisible={isReviewcardVisible}
      setIsReviewcardVisible={setIsReviewcardVisible}
      disabled={disabled}
      setDisabled={setDisabled} />
    </main>
  );
}
