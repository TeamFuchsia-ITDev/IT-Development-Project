"use client";

import { Navbar } from "@/app/components/navbar";
import { useState, useEffect, SetStateAction } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { UserProps } from "@/app/libs/interfaces";
import email from "@/app/images/email.svg";
import phone from "@/app/images/phone.svg";
import gender from "@/app/images/gender.svg";
import bday from "@/app/images/bday.svg";
import loc from "@/app/images/location.svg";
import EditProfile from "@/app/components/editProfile";


const Profilepage = () => {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const userParams = searchParams.get("user");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [disabled, setDisabled] = useState(false);
  

  let tab = searchParams.get("tab") ?? "Reviews";
  const [profilepage, setprofilepage] = useState(tab);
  const [user, setUser] = useState<UserProps | undefined>(undefined);

  useEffect(() => {
    const getUser = async (userEmail: string | null) => {
      const response = await fetch(`/api/user/profile/${userEmail}`);
      const data = await response.json();
      setUser(data);
    };

    if (session?.user.email && userParams === null) {
      getUser(session?.user.email);
    } else if (session?.user.email && userParams !== null) {
      getUser(userParams);
    }
  }, [session?.user.email]);

  const HandleEditProfileClick = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <main className="pl-24 pr-24">
      <Navbar />
      <div className="flex flex-row mt-12 gap-4">
        <div>
          {user ? (
            <div
              className="h-auto  rounded-[5px] mt-12"
              style={{ boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)" }}
            >
              <div className="flex flex-col items-center">
                <>
                  <img
                    src={user?.image}
                    alt=""
                    className="rounded-full item-center w-[100px] h-[100px] mt-[-50px] object-cover"
                    style={{ boxShadow: "3px 3px 8px rgba(0, 0, 0, 0.5)" }}
                  />
                  <div className="text-center">
                    <p className="text-xl font-bold mt-2">{user.name}</p>
                    <p className="">{user.ethnicity}</p>
                  </div>
                  <div className="flex flex-col pl-12 pr-12 text-xl mt-4 gap-4">
                    <p className=" text-lg">
                      <img
                        src={email.src}
                        alt="x"
                        className="inline-block w-6"
                      />{" "}
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
                      <img
                        src={bday.src}
                        alt="x"
                        className="inline-block w-6"
                      />{" "}
                      {user.birthday}
                    </p>
                    <p className=" text-lg">
                      <img
                        src={phone.src}
                        alt="x"
                        className="inline-block w-6"
                      />{" "}
                      {user.phonenumber}
                    </p>
                    <p className=" text-lg mb-4 ">
                      <img src={loc.src} alt="x" className="inline-block w-6" />{" "}
                      {user.location.address.fullAddress}
                    </p>
                  </div>
                  {userParams ? null : (
                    <button className="text-center bg-blue-500 text-white font-bold mb-6 ml-4 mr-4 w-[400px] rounded h-[45px] hover:bg-white hover:text-blue-500 hover:border-[2px] hover:border-blue-500 hover:ease-in-out duration-300"
                    onClick={HandleEditProfileClick}>
                      Edit Profile
                    </button>
                  )}
                </>
              </div>
            </div>
          ) : (
            <>
              <div
                className="border-2  w-[500px] h-[420px]  rounded-[5px] mt-12  animate-puls"
                style={{ boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)" }}
              >
                <div className="flex flex-col ">
                  <>
                    <div className="flex  justify-center">
                      <div className="rounded-full  h-[100px] item-center w-[100px] border-2 border-gray mt-[-50px] bg-gray-300 animate-pulse"></div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="bg-gray-300 animate-pulse w-[150px] h-[20px] mt-2"></div>
                      <div className="bg-gray-300 animate-pulse w-[100px] h-[20px] mt-2"></div>
                    </div>

                    <div className="flex flex-col pl-12 pr-12 text-xl mt-4 gap-2">
                      <div className="bg-gray-300 animate-pulse w-[200px] h-[20px] mt-2"></div>
                      <div className="bg-gray-300 animate-pulse w-[200px] h-[20px] mt-2"></div>
                      <div className="bg-gray-300 animate-pulse w-[200px] h-[20px] mt-2"></div>
                      <div className="bg-gray-300 animate-pulse w-[200px] h-[20px] mt-2"></div>
                      <div className="bg-gray-300 animate-pulse w-[400px] h-[20px] mt-2"></div>
                      <div className="bg-gray-300 animate-pulse w-[400px] h-[20px] mt-2"></div>
                    </div>
                    <div className="flex justify-center">
                      <div className="bg-gray-300 animate-pulse w-[400px] h-[45px] mt-2 items-center mt-4 "></div>
                    </div>
                  </>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="border-2 w-[100%] h-[600px] ">
          <div className="w-[100%]"></div>
          <button
            className={`${
              profilepage === "Reviews"
                ? " bg-white w-[50%] h-12 text-orange-500 font-bold border-t-4 border-orange-500 "
                : "  w-[50%] text-gray-400  h-12 border-b-2 "
            }`}
            onClick={() => setprofilepage("Reviews")}
          >
            Reviews
          </button>
          <button
            className={`${
              profilepage === "analytics"
                ? " bg-white w-[50%] h-12 text-blue-500 font-bold border-t-4 border-blue-500 "
                : "  w-[50%] text-gray-400  h-12 border-b-2 "
            }`}
            onClick={() => setprofilepage("analytics")}
            id="analytics"
          >
            History
          </button>

          {profilepage === "Reviews" ? <>This is reviews</> : null}
          {profilepage === "analytics" ? <>This is History</> : null}
        </div>
      </div>

      <EditProfile
        isFormVisible={isFormVisible}
        setIsFormVisible={setIsFormVisible}
        disabled={disabled}
      />
    </main>
  );
};

export default Profilepage;
