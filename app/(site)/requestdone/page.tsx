"use client";

import { Navbar } from "../../components/navbar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ApplicationProps,
  ProfileData,
  RequestProps,
} from "@/app/libs/interfaces";
import Carousel from "@/app/components/carousel";
import axios from "axios";
import { HiredApplicantsCard } from "@/app/components/hiredApplicants";
import ReviewCard from "@/app/components/reviewcard";

export default function RequestDonePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestIDParams = searchParams.get("id");
  const [applications, setApplications] = useState([]);
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [request, setRequest] = useState<RequestProps | undefined>(undefined);
  const [selectedCompanionProfile, setSelectedCompanionProfile] = useState<
    ProfileData | undefined
  >(undefined);
  const [reviewer, setReviewer] = useState<ProfileData | undefined>(undefined);
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

    const getProfiles = async () => {
      const response = await axios.get(`/api/user/profile`);
      setProfiles(response.data.profiles);
    };
    if (requestIDParams) {
      getApplications();
      getRequest();
      getProfiles();
    }
  }, [session?.user.email, requestIDParams]);

  const handleLeaveReview = async (companionEmail: string) => {
    const selectedProfile = profiles.find((profile) => {
      return profile.userEmail === companionEmail;
    });
    const currReviewer = profiles.find((profile) => {
      return profile.userEmail === session?.user.email;
    });
    setSelectedCompanionProfile(selectedProfile);
	setReviewer(currReviewer)
  };

  return (
    <main className="pl-24 pr-24">
      <Navbar />
      <div
        className={`${
          isReviewcardVisible ? "pointer-events-none blur-sm" : ""
        }`}
      >
        <div className="mt-6 text-center">
          <p className="text-[30px] mt-12">
            {" "}
            {request?.taskname}{" "}
            <span className="text-blue-500">Companions</span>
          </p>
          <p className="text-md">
            In here you will be able to see all the hired companions for your
            request
          </p>
        </div>

        <div>
          <div className="flex flex-row items-center">
            <h1 className="font-bold mt-8 mb-4">Your reviewed Companions</h1>
          </div>

          <h1 className="font-bold mt-2 mb-4">Companions</h1>
          <Carousel
            loop={false}
            slidesPerView={4}
            cards={applications
              .filter(
                (application: ApplicationProps) =>
                  application.status === "RequestCompleted"
              )
              .map((application: ApplicationProps, index: number) => (
                <div key={index}>
                  <HiredApplicantsCard
                    application={application}
                    toggleReviewCardVisibility={setIsReviewcardVisible}
                    onLeaveReviewClick={handleLeaveReview}
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
        setDisabled={setDisabled}
        selectedCompanionProfile={selectedCompanionProfile!}
        request={requestIDParams!}
		reviewer={reviewer}
      />
    </main>
  );
}
