"use client";

import { ethnicityOptions, genderOptions } from "@/app/libs/reusables";
import { EditProfileFormProps } from "../libs/interfaces";
import blankProfile from "@/app/images/blank-profile.jpg";
import x from "@/app/images/x.svg";

const EditProfile: React.FC<EditProfileFormProps> = ({
  isFormVisible,
  setIsFormVisible,
  disabled,
  editProfileData,
  setEditProfileData,
  editable,
  setEditable,
  updateProfile,
}) => {
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
          onClick={() => setIsFormVisible(!isFormVisible)}
        />

        <div>
          <div className="flex flex-col justify-center items-center">
            <div className="flex flex-col ">
              <img
                src={blankProfile.src}
                alt="blank profile"
                className="w-[100px] h-[100px] rounded-full mt-4  object-cover"
              />
              <p className="text-[10px] hover:text-blue-500 cursor-pointer">
                change profile picture
              </p>
            </div>
            <div className="flex  flex-col justify-center items-center">
              <input
                type="text"
                placeholder=""
                className={`border-1 border-gray-300 h-[45px] w-[400px] mt-4 focus:ring-blue-400 ${
                  editable ? "" : "pointer-events-none"
                }`}
                // value={editProfileData.name}
                // onChange={(e) =>
                //   setEditProfileData({
                //     ...editProfileData,
                //     name: e.target.value,
                //   })
                // }
              />
              <input
                type="text"
                placeholder=""
                className={`border-1 border-gray-300 h-[45px] w-[400px] mt-4 focus:ring-blue-400 ${
                  editable ? "" : "pointer-events-none"
                }`}
              />
              <select
                id="ethnicity"
                name="ethnicity"
                className=" h-[45px] w-[400px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:text-sm sm:leading-6"
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
                      value={option}
                      className="form-radio h-4 w-4 text-rose-500 focus:ring-white"
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
                  onChange={(e) => {
                    const date = e.target.value;
                    if (!date) return;
                    const formattedDate = new Date(date)
                      .toISOString()
                      .split("T")[0];
                  }}
                  className=" h-[45px] w-[400px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:text-sm sm:leading-6"
                />
              </div>

              <input
                type="text"
                placeholder=""
                className="border-1 border-gray-300 h-[45px] w-[400px] mt-4 mb-4  focus:ring-blue-400 "
              />
            </div>
            <button className="text-center bg-blue-500 text-white font-bold mb-6  w-[400px] rounded h-[45px] hover:bg-white hover:text-blue-500 hover:border-[2px] hover:border-blue-500 hover:ease-in-out duration-300">
              Save Changes
            </button>
          </div>
        </div>
      </main>
    )
  );
};

export default EditProfile;
