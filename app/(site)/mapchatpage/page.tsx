"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  useEffect,
  useState,
  useRef,
  ChangeEvent,
  FormEvent,
  useMemo,
} from "react";
import { useSession } from "next-auth/react";
import getGeolocation from "@/app/libs/geolocation";
import Map from "@/app/components/map";
import ChatComponent from "@/app/components/chat";
import { LocationFeature, SocketReference } from "@/app/libs/interfaces";

import io, { Socket } from "socket.io-client";
import axios from "axios";
import toast from "react-hot-toast";

const MapChatPage = () => {
  const socket: SocketReference = useRef<Socket | null>(null);
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState<LocationFeature[]>([]);
  const [coordinates, setCoordinates] = useState({
    lat: 0,
    lng: 0,
  });

  const [whoSharedLocation, setWhoSharedLocation] = useState<string[]>([]);
  const [sharedLocation, setSharedLocation] = useState<string[]>([]);
  const [selectedCompanionLocation, setSelectedCompanionLocation] = useState<
    string | null
  >(null);
  const [hasSharedLocation, setHasSharedLocation] = useState<boolean>(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMeetingPointSet, setIsMeetingPointSet] = useState(false);
  const [data, setData] = useState({
    requestid: "",
    username: "",
    userType: "",
    startLocation: {
      lat: 0,
      lng: 0,
    },
    endLocation: {
      lat: 0,
      lng: 0,
    },
  });

  const queryParams = useMemo(() => {
    return {
      requestid: searchParams.get(`requestid`),
      username: searchParams.get(`username`),
      userType: searchParams.get(`usertype`),
    };
  }, [searchParams]);

  useEffect(() => {
    const fetchUserRequests = async () => {
      try {
        const response = await axios.get(
          `/api/user/request/${queryParams?.requestid}`
        );
        const res = response.data;
        if (res.coordinates.length > 0) {
          setIsMeetingPointSet(true);
        }
        setData((prevData) => ({
          ...prevData,
          endLocation: {
            lat: res.coordinates[0],
            lng: res.coordinates[1],
          },
        }));
      } catch (error) {
        console.error("Error fetching user requests:", error);
      }
    };

    // Check if queryParams is available before making the request
    if (queryParams?.requestid) {
      fetchUserRequests();
    }
    setIsMounted(true);
  }, [queryParams]); // Only run the effect when queryParams change

  // Connect to WebSocket Server
  const setupSocket = () => {
    const wsServerUrl =
      process.env.NEXT_PUBLIC_WS_SERVER ||
      "ws://serve-ease-websocket-server-1b42068c72f6.herokuapp.com";
    socket.current = io(wsServerUrl);

    socket.current?.on("share", (message: string) => {
      setWhoSharedLocation((prevMessages) => [...prevMessages, message]);
    });

    socket.current?.on("location", (message: string) => {
      setSharedLocation((prevMessages) => [...prevMessages, message]);
    });
  };

  // Initializer useEffect
  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      requestid: queryParams.requestid!,
      username: queryParams.username!,
      userType: queryParams.userType!,
    }));

    setupSocket();
  }, [session, searchParams]);

  // Loading useEffect to make sure map has values already before rendering
  useEffect(() => {
    if (
      data.startLocation.lat !== 0 &&
      data.startLocation.lng !== 0 &&
      data.endLocation.lat !== 0 &&
      data.endLocation.lng !== 0
    ) {
      setLoading(false);
    }
  }, [data]);

  async function handleLocationChange(e: ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setAddress(val);

    const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${val}
      .json?&country=ca&proximity=ip&types=address%2Cpoi&language=en&limit=3&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;
    try {
      const response = await axios.get(endpoint);
      setSuggestions(response.data?.features);
      if (response.data?.features.length > 0) {
        const center = response.data.features[0].center;
        setCoordinates((prevData) => ({
          ...prevData,
          lat: center[1],
          lng: center[0],
        }));
      }
    } catch (error) {
      console.error("Error getting location suggestions:", error);
      toast.error("Error getting suggestions. Please try again.");
    }
  }

  const updateProfile = async (e: FormEvent) => {
    setDisabled(true);
    toast.loading("Setting the meeting point...", {
      duration: 4000,
    });

    const requestBody = {
      requestid: data.requestid,
      coordinates: coordinates,
    };

    const response = await axios.post(
      `api/user/request/coordinates`,
      requestBody
    );
    if (response.data.status !== 200) {
      const errorMessage = response.data?.error || "An error occurred";
      toast.error(errorMessage);
      setTimeout(() => setDisabled(false), 2000);
    } else {
      toast.success("Meeting point successfully updated");
      setTimeout(() => {
        toast.dismiss();
        window.location.reload();
      }, 2000);
    }
  };

  return (
    <div className="w-full mx-auto max-w-4xl text-center">
      {isMeetingPointSet && <div>HAS MEETING POINT SETUP</div>}

      <div className="">
        <input
          id="address"
          name="address"
          type="text"
          value={address}
          onChange={handleLocationChange}
          className={`border-1 border-gray-300 h-[45px] w-[400px]  mb-4  focus:ring-blue-400
          }`}
        />
      </div>
      {suggestions?.length > 0 && (
        <div className="bg-white border border-gray-300 rounded-lg z-10 overflow-auto max-h-20 w-[400px] mb-2 ">
          {suggestions.map((suggestion, index) => (
            <p
              // className="p-4 cursor-pointer text-sm text-black transition duration-200 ease-in-out bg-gray-100 hover:bg-green-200"
              className="p-4 cursor-pointer text-sm text-black transition duration-200 ease-in-out hover:bg-green-200"
              key={index}
              onClick={() => {
                setAddress(suggestion.place_name);
                setSuggestions([]);
              }}
            >
              {suggestion.place_name}
            </p>
          ))}
        </div>
      )}
      <button
        className={`${
          disabled
            ? " text-center bg-blue-500 opacity-50 text-white font-bold w-[400px] rounded mb-4 h-[45px] cursor-not-allowed"
            : "text-center bg-blue-500 text-white font-bold w-[400px] rounded mb-4 h-[45px] hover:bg-white hover:text-blue-500 hover:border-[2px] hover:border-blue-500 hover:ease-in-out duration-300"
        } ${disabled && "cursor-not-allowed"}`}
        onClick={updateProfile}
        disabled={disabled}
      >
        Save Changes
      </button>
    </div>
  );
};

export default MapChatPage;

// useEffect(() => {
//     if (data.userType === "Companion") {
//       getGeolocation()
//         .then((location) => {
//           setData((prevData) => ({
//             ...prevData,
//             startLocation: {
//               lat: location.lat,
//               lng: location.lng,
//             },
//             endLocation: { lat: 49.215401, lng: -122.950891 },
//           }));
//         })
//         .catch((error) => {
//           console.error(error);
//         });
//     }
//     if (data.userType === "Requester") {
//       setData((prevData) => ({
//         ...prevData,
//         startLocation: {
//           lat: 49.215401,
//           lng: -122.950891,
//         },
//       }));

//       getGeolocation()
//         .then((location) => {
//           setData((prevData) => ({
//             ...prevData,
//             endLocation: { lat: location.lat, lng: location.lng },
//           }));
//         })
//         .catch((error) => {
//           console.error(error);
//         });
//     }
//   }, [hasSharedLocation]);

//   const handleShareLocation = () => {
//     setHasSharedLocation(true);
//     const joinRoom = () => {
//       if (data.requestid && data.username) {
//         socket.current?.emit("shareLocation", data.requestid, data.username);
//       }
//     };
//     joinRoom();
//     if (data.userType === "Companion") {
//       socket.current?.emit("sendLocation", data.requestid, {
//         lat: data.startLocation.lat,
//         lng: data.startLocation.lng,
//       });
//     }
//     if (data.userType === "Requester") {
//       socket.current?.emit("sendLocation", data.requestid, {
//         lat: data.endLocation.lat,
//         lng: data.endLocation.lng,
//       });
//     }
//   };

// {loading ? (
// 	<p>Loading...</p>
//   ) : (
// 	<Map
// 	  key={`${data}`}
// 	  startLocation={data.startLocation}
// 	  endLocation={data.endLocation}
// 	/>
//   )}
//   <ul>
// 	{whoSharedLocation.map((message, index) => (
// 	  <li key={index}>{message}</li>
// 	))}
// 	{sharedLocation.map((message, index) => (
// 	  <li key={index}>{message}</li>
// 	))}
//   </ul>

//   {data.userType === "Requester" && (
// 	<div>
// 	  <label>Select Companion:</label>
// 	  <select
// 		onChange={(e) => setSelectedCompanionLocation(e.target.value)}
// 	  >
// 		<option value="">Select a Companion</option>
// 		{whoSharedLocation.map((companion, index) => {
// 		  const companionName = companion.split(" is sharing location")[0];
// 		  if (companionName !== data.username) {
// 			return (
// 			  <option key={index} value={sharedLocation[index]}>
// 				{companionName}
// 			  </option>
// 			);
// 		  }
// 		  return null;
// 		})}
// 	  </select>
// 	</div>
//   )}
//   <button onClick={handleShareLocation}>
// 	{hasSharedLocation ? "Location Shared" : "SHARE LOCATION"}
//   </button>
//   {selectedCompanionLocation && (
// 	<div>Selected Companion's Location: {selectedCompanionLocation}</div>
//   )}
