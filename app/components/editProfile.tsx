"use client";

import { ethnicityOptions, genderOptions } from "@/app/libs/reusables";
import {
  EditProfileFormProps,
  LocationData,
  LocationFeature,
} from "@/app/libs/interfaces";
import x from "@/app/images/x.svg";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const EditProfile: React.FC<EditProfileFormProps> = ({
  isFormVisible,
  setIsFormVisible,
  disabled,
  editProfileData,
  setEditProfileData,
  editable,
  setEditable,
  setDisabled,
}) => {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [location, setLocation] = useState<LocationData | undefined>(undefined);
  const [gender, setGender] = useState<string>("");
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState<LocationFeature[]>([]);

  useEffect(() => {
    setAddress(editProfileData?.location?.address?.fullAddress || "");
    setGender(editProfileData.gender || "");
  }, [isFormVisible]);

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

  const handleGenderChange = (e: ChangeEvent<HTMLInputElement>) => {
	const selectedGender = e.target.value;
	setGender(selectedGender);
	setEditProfileData({ ...editProfileData, gender: selectedGender });
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
    setEditProfileData({ ...editProfileData, phonenumber: formattedValue });
  };

  const updateProfile = async (e: FormEvent) => {
    setDisabled(true);
    toast.loading("Updating your profile...", {
      duration: 4000,
    });

    const requestBody = {
      ...editProfileData,
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

    const response = await axios.patch(`api/user/profile`, requestBody);
    if (response.data.status !== 200) {
      const errorMessage = response.data?.error || "An error occurred";
      toast.error(errorMessage);
      setTimeout(() => setDisabled(false), 2000);
    } else {
      toast.success("Profile successfully updated");
      setTimeout(() => {
        toast.dismiss();
        window.location.reload();
      }, 2000);
    }
  };

  return (
    isFormVisible && (
      <main
        className="flex flex-col w-[500px] border-2  items-center mb-12 bg-white fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 "
        style={{ boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.5)" }}
      >
        <img
          src={x.src}
          alt="X"
          width={20}
          className="m-2 absolute right-0 top-0 cursor-pointer "
          onClick={() => {
            setIsFormVisible(!isFormVisible);
            setEditable(false);
          }}
        />

        <div>
          <div className="flex flex-col justify-center items-center">
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`${editable ? "" : "pointer-events-none"}`}
            >
              {imageBase64 ? (
                <img
                  src={imageBase64}
                  alt="Selected File"
                  className="w-[100px] h-[100px] rounded-full mt-4  object-cover hover:opacity-80 cursor-pointer"
                  title="Click to change profile picture"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <img
                    src={editProfileData.image}
                    alt="Default Image"
                    className="w-[100px] h-[100px] rounded-full mt-4  object-cover hover:opacity-80 cursor-pointer"
                  />
                </div>
              )}
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
            <div className="flex  flex-col justify-center items-center">
              <input
                type="text"
                placeholder=""
                className={`border-1 border-gray-300 h-[45px] w-[400px] mt-4 focus:ring-blue-400 rounded-md ${
                  editable ? "" : "pointer-events-none"
                }`}
                value={editProfileData.name}
                onChange={(e) =>
                  setEditProfileData({
                    ...editProfileData,
                    name: e.target.value,
                  })
                }
              />
              <select
                id="ethnicity"
                name="ethnicity"
                className={` h-[45px] w-[400px] mt-4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:text-sm sm:leading-6 ${
                  editable ? "" : "pointer-events-none"
                }`}
                value={editProfileData.ethnicity}
                onChange={(e) =>
                  setEditProfileData({
                    ...editProfileData,
                    ethnicity: e.target.value,
                  })
                }
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

              <div className="flex items-center space-x-4 gap-4 mt-4">
                {genderOptions.map((option) => (
                  <div key={option}>
                    <input
                      id={option.toLowerCase()}
                      name="gender"
                      type="radio"
                      checked={gender === option}
                      className={`form-radio h-4 w-4 text-rose-500 focus:ring-white ${
                        editable ? "" : "pointer-events-none"
                      }`}
                      value={option}
                      onChange={handleGenderChange}
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
              <div className="mt-2">
                <input
                  id="birthday"
                  name="birthday"
                  type="date"
                  value={editProfileData.birthday}
                  onChange={(e) => {
                    const date = e.target.value;
                    if (!date) return;
                    const formattedDate = new Date(date)
                      .toISOString()
                      .split("T")[0];
                    setEditProfileData({
                      ...editProfileData,
                      birthday: formattedDate,
                    });
                  }}
                  className={`h-[45px] w-[400px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:text-sm sm:leading-6 ${
                    editable ? "" : "pointer-events-none"
                  }`}
                />
              </div>

              <input
                type="text"
                placeholder=""
                className={`border-1 border-gray-300 h-[45px] w-[400px] mt-4 mb-4  focus:ring-blue-400 rounded-md ${
                  editable ? "" : "pointer-events-none"
                }`}
                value={editProfileData.phonenumber}
                onChange={handlePhoneNumberChange}
              />

              <div className="">
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={address}
                  onChange={handleLocationChange}
                  className={`border-1 border-gray-300 h-[45px] w-[400px]  mb-4  focus:ring-blue-400 rounded-md ${
                    editable ? "" : "pointer-events-none"
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
            </div>
            <button
              className={`${
                disabled
                  ? "text-center bg-orange-500 opacity-50 text-white font-bold  mb-3 rounded h-[45px] w-[400px]"
                  : "text-center bg-orange-500 text-white font-bold rounded mb-3 h-[45px] w-[400px] hover:bg-white hover:text-orange-500 hover:border-[2px] hover:border-orange-500 hover:ease-in-out duration-300"
              }`}
              onClick={() => setEditable(!editable)}
              disabled={disabled}
            >
              {editable ? "Cancel Editing" : "Edit Profile"}
            </button>

            {editable && (
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
            )}
          </div>
        </div>
      </main>
    )
  );
};

export default EditProfile;
