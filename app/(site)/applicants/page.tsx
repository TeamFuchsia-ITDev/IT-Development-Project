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

export default function MyJobs() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestIDParams = searchParams.get("id");
  const [applications, setApplications] = useState([]);
  const [request, setRequest] = useState<RequestProps | undefined>(undefined);
  const [activeDropdown, setActiveDropdown] = useState(-1);

  const toggleDropdown = (index: number) => {
    if (activeDropdown === index) {
      setActiveDropdown(-1);
    } else {
      setActiveDropdown(index);
    }
  };

  const revertApplicantStatus = async (applicantId: string) => {
    try {
      const response = await axios.patch(
        `/api/user/applications/${applicantId}`
      );
      if (response.status !== 200) {
        const errorMessage = response.data?.error || "An error occurred";
        toast.error(errorMessage);
      } else {
        toast.success("Application status reverted");
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
      <div>
        <div className="mt-6 text-center">
          <p className="text-[40px] mt-24">
            These are the applicants for {request?.taskname}
          </p>
          <p className="text-[16px]  ">
            In here you will be able to see al the companions that have applied
            to your request
          </p>
          <div className="flex flex-row gap-4  justify-center mt-4">
            <input
              type="text"
              placeholder="Input age"
              className="w-[200px] rounded-lg"
            />
            <select className="rounded-lg">
              {" "}
              <option value="" disabled>
                Select Ethnicity
              </option>
            </select>
            <select className="rounded-lg">
              {" "}
              <option value="" disabled>
                Select Gender
              </option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex flex-row items-center">
            <h1 className="font-bold mt-8 mb-4">Your Accepted Applicants </h1>
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
                    className={`absolute w-[200px] left-5 mt-2 bg-white border border-gray-300 rounded-md shadow-md z-10 ${
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
                        <p className="block px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-blue-500">
                          View Profile
                        </p>
                      </Link>
                    </li>
                    <li>
                      <p
                        className="block px-4 py-2 cursor-pointer hover:text-rose-500 hover:bg-gray-100"
                        onClick={() => revertApplicantStatus(app.id)}
                      >
                        Remove
                      </p>
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
                  <CompanionCard application={application} />
                </div>
              ))}
          />
        </div>
      </div>
    </main>
  );
}
