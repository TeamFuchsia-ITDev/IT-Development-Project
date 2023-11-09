"use client";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState, FormEvent, ChangeEvent, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import defaultProfileImage from "@/app/images/blank-profile.jpg";
import logo1 from "@/app/images/Serve-ease.svg";
import photo from "@/app/images/photo.svg";
import { LocationData, LocationFeature, FormData } from "@/app/libs/interfaces";

export default function CreateProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [disabled, setDisabled] = useState(false);

  const [data, setData] = useState<FormData>({
    name: "",
    birthday: "",
    ethnicity: "",
    gender: "",
    phonenumber: "",
    location: {
      lng: 0,
      lat: 0,
      address: {
        fullAddress: "",
        pointOfInterest: "",
        city: "",
        country: "",
      },
    },
  });

  const [location, setLocation] = useState<LocationData | undefined>(undefined);
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState<LocationFeature[]>([]);

  const ethnicityOptions = [
    "Asian",
    "Black",
    "White",
    "Hispanic/Latino",
    "Native American",
    "Pacific Islander",
    "Middle Eastern",
    "Mixed Race",
    "Other",
  ];

  const genderOptions = ["Male", "Female", "Non-Binary", "Other"];

  //   // Check if the session is still loading
  if (status === "loading") {
    // return <p>Loading...</p>;
    return null;
  }

  if (!session) {
    router.replace("/login");
    return null;
  }

  if (session.user?.isNewUser === false) {
    router.replace("/dashboard");
    return null;
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) {
      // Read the selected image file and convert it to base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result?.toString();
        setImageBase64(base64Data!);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  async function handleLocationChange(e: ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setAddress(val);

    const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${val}
      .json?&country=ca&proximity=ip&types=address%2Cpoi&language=en&limit=3&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;
    try {
      const response = await axios.get(endpoint);
      setLocation(response.data);
      setSuggestions(response.data?.features);
    } catch (error) {
      console.error("Error getting location suggestions:", error);
      toast.error("Error getting suggestions. Please try again.");
    }
  }

  const submitProfile = async (e: FormEvent) => {
    e.preventDefault();
    setDisabled(true);
    try {
      toast.loading("Creating your profile...", {
        duration: 4000,
      });

      const requestBody = {
        name: data.name,
        birthday: data.birthday,
        ethnicity: data.ethnicity,
        gender: data.gender,
        phonenumber: data.phonenumber,
        location: {
          lng: location?.features[0]?.geometry.coordinates[0],
          lat: location?.features[0]?.geometry.coordinates[1],
          address: {
            fullAddress: location?.features[0]?.place_name,
            pointOfInterest: location?.features[0]?.context[0]?.text,
            city: location?.features[0]?.context[2]?.text,
            country: location?.features[0]?.context[5]?.text,
          },
        },
        image: imageBase64,
      };

      const response = await axios.post(`api/user/profile`, requestBody);

      if (response.data.status !== 200) {
        const errorMessage = response.data?.error || "An error occurred";
        toast.error(errorMessage);
        setTimeout(() => setDisabled(false), 4000);
      } else {
        toast.success("Profile successfully created!");

        setTimeout(() => {
          toast.loading("Redirecting now to your dashboard...", {
            duration: 4000,
          });
        }, 1000);

        setTimeout(() => {
          toast.remove();
          signOut();
        }, 5000);
      }
    } catch (err) {
      const errorMessage = "An error occurred";
      toast.error(errorMessage);
    }
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Allow only letters and spaces in the name field
    const newName = e.target.value.replace(/[^a-zA-Z\s]/g, "");
    setData({ ...data, name: newName });
  };

  const handlePhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let formattedValue: string | RegExpMatchArray | null = value.replace(
      /\D/g,
      ""
    );
    if (formattedValue.length > 0) {
      formattedValue = formattedValue.match(/(\d{1,3})(\d{0,3})(\d{0,4})/); // split into groups of 3 digits
      formattedValue = [
        formattedValue![1],
        formattedValue![2],
        formattedValue![3],
      ]
        .filter((group) => group.length > 0)
        .join("-"); // join groups with dashes
    }
    setData({ ...data, phonenumber: formattedValue });
  };

  return (
    <div className="flex justify-center h-[screen] items-center">
      <div className=" w-[500px] ">
        <div className="flex justify-center">
          <img src={logo1.src} alt="logo" className="h-[90px] w-[200px]" />
        </div>
        <div className="flex flex-col mt-4 text-center">
          <h1 className="bold text-4xl">
            Profile <a className="text-blue-500">Creation</a> Page
          </h1>
          <p className="text-sm mb-4">
            Almost there {session.user.name}, we need to know more 
            <span className="block">about you. Want to continue later? <a className=" text-blue-500 hover:cursor-pointer" onClick={() => signOut()}> Sign Out</a></span>
          </p>
        </div>
        <div className="flex flex-col justify-center items-center">
          <label htmlFor="profileImage" className="">
            Click to upload a profile image
          </label>
          <div className="mt-2">
            <div onClick={() => fileInputRef.current?.click()}>
              {imageBase64 ? (
                <img
                  src={imageBase64}
                  alt="Selected File"
                  className="w-[100px] h-[100px]  rounded-[10px] border-2 border-grey-500 object-cover "
                />
              ) : (
                <div className="flex flex-col">
                  <img
                    src={defaultProfileImage.src}
                    alt="Default Image"
                    className="w-[100px] h-[100px] object-cover"
                  />
                </div>
              )}
            </div>
          </div>
          <input
            type="file"
            id="profileImage"
            ref={(input) => {
              fileInputRef.current = input;
            }}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleFileChange}
          />
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Name"
            value={data.name}
            onChange={handleNameChange}
            className="border-2 border-gray-300 h-[45px] rounded-md pl-4 mt-8 w-[390px] "
          />

          <select
            id="ethnicity"
            name="ethnicity"
            value={data.ethnicity}
            onChange={(e) => setData({ ...data, ethnicity: e.target.value })}
            className=" border-2 border-gray-300 h-[45px] rounded-md pl-4 mt-8 w-[390px] "
          >
            <option value="" disabled>
              Select Ethnicity
            </option>
            {/* Map through the array to generate options */}
            {ethnicityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <div className="mt-8">
            <div className="flex items-center space-x-4 gap-4">
              {genderOptions.map((option) => (
                <div key={option}>
                  <input
                    id={option.toLowerCase()}
                    name="gender"
                    type="radio"
                    value={option}
                    checked={data.gender === option}
                    onChange={(e) =>
                      setData({ ...data, gender: e.target.value })
                    }
                    className="form-radio h-4 w-4 text-blue-500 focus:ring-blue-500 "
                  />
                  <label
                    htmlFor={option.toLowerCase()}
                    className="text-sm text-gray-900 ml-2"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex gap-2">
            <label className=" text-sm flex justify-center items-center">
              Birth Date
            </label>
            <input
              id="birthday"
              name="birthday"
              type="date"
              value={data.birthday}
              onChange={(e) => {
                const date = e.target.value;
                if (!date) return;
                const formattedDate = new Date(date)
                  .toISOString()
                  .split("T")[0];
                setData({ ...data, birthday: formattedDate });
              }}
              className="border-2 border-gray-300 h-[45px] rounded-md pl-4  w-[315px]"
            />
          </div> <div className="">
            <input
              id="address"
              name="address"
              type="text"
              placeholder="Address"
              value={address}
              onChange={handleLocationChange}
              className="border-2 border-gray-300 h-[45px] rounded-md pl-4 mt-8 w-[390px]"
            />
          </div>
          {suggestions?.length > 0 && (
            <div className="bg-white border border-gray-300 rounded-lg z-10 overflow-auto max-h-40 w-[390px]">
              {suggestions.map((suggestion, index) => (
                <p
                  className="p-4 cursor-pointer text-sm text-black transition duration-200 ease-in-out bg-gray-100 hover:bg-green-200"
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
          <input
            id="phonenumber"
            name="phonenumber"
            placeholder="Phone Number"
            type="text"
            value={data.phonenumber}
            onChange={handlePhoneNumberChange}
            className="border-2 border-gray-300 h-[45px] rounded-md pl-4 mt-8 w-[390px]"
          />

         
          <div className="mt-8">
             <button 
              onClick={submitProfile}
              type="submit"
              className={`${disabled ? "text-center bg-blue-500 text-white font-bold w-[385px] rounded h-[45px] opacity-50 cursor-not-allowed mb-12" : "text-center bg-blue-500 text-white font-bold w-[385px] rounded h-[45px] hover:bg-white hover:text-blue-500 hover:border-[2px] hover:border-blue-500 hover:ease-in-out duration-300 mb-12"}`}
              disabled={disabled}
            >
              Create your profile
            </button>
          </div>
          
        </div>

       
      </div>
    </div>
  );
}
