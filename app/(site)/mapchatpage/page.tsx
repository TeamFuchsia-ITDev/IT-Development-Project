"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import getGeolocation from "@/app/libs/geolocation";
import Map from "@/app/components/map";
import ChatComponent from "@/app/components/chat";

const MapChatPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [data, setData] = useState({
    requestid: "",
    username: "",
    userType: "",
  });

  useEffect(() => {
    const requestid = searchParams.get(`requestid`);
    const username = searchParams.get(`username`);
    const userType = searchParams.get(`usertype`);
    getGeolocation()
      .then((location) => {
        console.log("Latitude:", location.lat);
        console.log("Longitude:", location.lng);
      })
      .catch((error) => {
        console.error(error);
      });

    setData({
      ...data,
      requestid: requestid!,
      username: username!,
      userType: userType!,
    });
  }, [session, searchParams]);

  console.log("DATA", data)

  return (
    <div className="w-full mx-auto max-w-4xl text-center">
      <Map />
      <ChatComponent
        requestid={data.requestid}
        username={data.username}
        userType={data.userType}
      />
    </div>
  );
};

export default MapChatPage;
