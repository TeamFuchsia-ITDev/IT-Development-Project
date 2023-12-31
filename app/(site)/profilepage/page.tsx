"use client";

import { Navbar } from "@/app/components/navbar";
import { useState, useEffect, SetStateAction, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { UserProps, ReviewData } from "@/app/libs/interfaces";
import email from "@/app/images/email.svg";
import phone from "@/app/images/phone.svg";
import gender from "@/app/images/gender.svg";
import bday from "@/app/images/bday.svg";
import loc from "@/app/images/location.svg";
import EditProfile from "@/app/components/editProfile";
import { ReviewInfoCard } from "@/app/components/reviewinfocard";
import { useMode } from "@/app/context/ModeContext";

import axios from "axios";

const Profilepage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { mode } = useMode();

  const searchParams = useSearchParams();
  const userParams = searchParams.get("user");
  let tab = searchParams.get("tab") ?? "Reviews";

  // useStates
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [editable, setEditable] = useState(false);
  const [profilepage, setprofilepage] = useState(tab);
  const [user, setUser] = useState<Partial<UserProps>>({});
  const [allReviews, setAllReviews] = useState<ReviewData[]>([]);

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }
    if (session?.user.isNewUser) {
      router.push("/create-profile");
    }
  }, [session, status, router]);

  useEffect(() => {
    const getUser = async (userEmail: string | null) => {
      const response = await fetch(`/api/user/profile/${userEmail}`);
      const data = await response.json();
      setUser(data);
    };

    const getReviews = async () => {
      const response = await axios.get(`/api/user/reviews`);
      setAllReviews(response.data.reviews);
    };

    if (session?.user.email && userParams === null) {
      getUser(session?.user.email);
      getReviews();
    } else if (session?.user.email && userParams !== null) {
      getUser(userParams);
      getReviews();
    }
  }, [session?.user.email]);

  const HandleEditProfileClick = () => {
    setIsFormVisible(!isFormVisible);
  };

  console.log("ALL REVIEWS", allReviews);

  return (
    <main className="pl-24 pr-24">
      <Navbar />
      <div
        className={`flex flex-row mt-12 gap-4 w-full ${
          isFormVisible ? "pointer-events-none blur-sm" : ""
        }`}
      >
        <div className="w-[40%]">
          {user ? (
            <div
              className="h-auto pl-12 pr-12 rounded-[5px] mt-12"
              style={{ boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)" }}
            >
              <div className="flex flex-col items-center">
                <img
                  src={user?.image}
                  alt=""
                  className="rounded-full item-center w-[100px] h-[100px] mt-[-50px] object-cover"
                  style={{ boxShadow: "3px 3px 8px rgba(0, 0, 0, 0.5)" }}
                />
                <div className="text-center ">
                  <div className="text-xl font-bold mt-2">{user.name}</div>
                  <p className="">{user.ethnicity}</p>
                </div>
                <div className="flex flex-col  text-xl mt-4 gap-4">
                  <p className=" text-lg">
                    <img src={email.src} alt="x" className="inline-block w-6" />{" "}
                    {user.userEmail}
                  </p>
                  <p className=" text-lg">
                    <img
                      src={gender.src}
                      alt="x"
                      className="inline-block w-6"
                    />{" "}
                    {user.gender}
                  </p>
                  <p className=" text-lg">
                    <img src={bday.src} alt="x" className="inline-block w-6" />{" "}
                    {user.birthday}
                  </p>
                  <p className=" text-lg">
                    <img src={phone.src} alt="x" className="inline-block w-6" />{" "}
                    {user.phonenumber}
                  </p>
                  <p className=" text-lg mb-4 ">
                    <img src={loc.src} alt="x" className="inline-block w-6" />{" "}
                    {user?.location?.address.fullAddress}
                  </p>
                </div>
                {userParams ? null : (
                  <>
                    {user.location !== undefined && (
                      <button
                        className="text-center bg-blue-500 text-white font-bold mb-6 ml-4 mr-4 w-full rounded h-[45px] hover:bg-white hover:text-blue-500 hover:border-[2px] hover:border-blue-500 hover:ease-in-out duration-300"
                        onClick={HandleEditProfileClick}
                      >
                        Edit Profile
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : null}
        </div>

        <div className=" w-[60%] ">
          <button
            className={`${
              profilepage === "Reviews"
                ? " bg-white w-[50%] h-12 text-orange-500 font-bold border-t-4 border-orange-500 rounded-t-xl"
                : "  w-[50%] text-gray-400  h-12 border-b-2 rounded-b-xl border-l-2"
            }`}
            onClick={() => setprofilepage("Reviews")}
          >
            {mode ? "Reviews as Requester" : "Reviews as Companion"}
          </button>
          <button
            className={`${
              profilepage === "analytics"
                ? " bg-white w-[50%] h-12 text-blue-500 font-bold border-t-4 border-blue-500 rounded-t-xl"
                : "  w-[50%] text-gray-400  h-12 border-b-2 rounded-b-xl border-r-2"
            }`}
            onClick={() => setprofilepage("analytics")}
            id="analytics"
          >
            History
          </button>

          {profilepage === "Reviews" ? (
            <div className="grid grid-cols-2 pl-6 ">
              {allReviews
                .filter(
                  (review) =>
                    review.revieweeEmail === user.userEmail &&
                    (mode
                      ? review.reviewType === "RequesterReview"
                      : review.reviewType === "CompanionReview")
                )
                .map((review, index) => (
                  <ReviewInfoCard
                    key={index}
                    rating={review.rating}
                    reviewerName={review.reviewerName}
                    comment={review.comment}
                    reviewerImage={review.reviewerImage}
                  />
                ))}
            </div>
          ) : null}
          {profilepage === "analytics" ? (
            <div className="flex justify-center  h-[400px] items-center">
              <p className="bg-red-500 origin-bottom -rotate-12 text-[30px] p-2 w-[400px] text-center text-white">Coming soon</p>
            </div>
          ) : null}
        </div>
      </div>

      <EditProfile
        isFormVisible={isFormVisible}
        setIsFormVisible={setIsFormVisible}
        disabled={disabled}
        editProfileData={user!}
        setEditProfileData={setUser}
        editable={editable}
        setEditable={setEditable}
        setDisabled={setDisabled}
      />
    </main>
  );
};

export default Profilepage;
