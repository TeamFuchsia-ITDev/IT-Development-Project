"use client";

import { useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import getGeolocation from "@/app/libs/geolocation";
import { toast } from "react-hot-toast";

interface UserProps {
  id: string;
  name: string;
  ethnicity: string;
  gender: string;
  birthday: string;
  phonenumber: string;
  image: string;
  userEmail: string;
  location: {
    lng: number;
    lat: number;
    address: {
      fullAddress: string;
      pointOfInterest: string;
      city: string;
      country: string;
    };
  };
}

const Profile = () => {
  const [user, setUser] = useState<UserProps | undefined>(undefined);
  const { data: session, status } = useSession();
  const [isMounted, setisMounted] = useState(false);
  const searchParams = useSearchParams();
  const successParams = searchParams.get("success");

  //   const searchParams = useSearchParams();
  //   const profileEmail = searchParams.get("id");

  useEffect(() => {
    if (isMounted) {
      if (successParams) {
        toast.success("Google successful login");
      }
    }
  }, [session, successParams]);

  useEffect(() => {
    setisMounted(true);
    getGeolocation()
      .then((location) => {
        console.log("Latitude:", location.lat);
        console.log("Longitude:", location.lng);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`/api/user/profile/${session?.user.email}`);
      const data = await response.json();
      setUser(data);
    };
    if (session?.user.email) getUser();
  }, [session?.user.email]);

  return (
    <div className="w-full mx-auto max-w-4xl text-center">
      <h1 className="font-bold text-2xl mt-20">User profile of:</h1>
      {user ? (
        <>
          <img
            className="mx-auto"
            src={user.image}
            alt="Selected File"
            style={{ maxWidth: "100px", maxHeight: "100px" }}
          />
          <p className="text-gray-900 leading-7">{user.userEmail}</p>
          <p className="text-gray-900 leading-7">{user.name}</p>
          <p className="text-gray-900 leading-7">{user.ethnicity}</p>
          <p className="text-gray-900 leading-7">{user.gender}</p>
          <p className="text-gray-900 leading-7">{user.birthday}</p>
          <p className="text-gray-900 leading-7">{user.phonenumber}</p>
          <p className="text-gray-900 leading-7">
            {user.location.address.fullAddress}
          </p>
        </>
      ) : (
        <p>loading...</p>
      )}
      <div>
        <Link href="/">
          <button className="text-gray-900 underline hover:text-gray-900/70">
            Back to dashboard
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Profile;
