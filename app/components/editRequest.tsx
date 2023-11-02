"use client";

import { CategoryOptions, numberofCompanion } from "@/app/libs/reusables";
import { UpdateRequestFormProps } from "../libs/interfaces";
import x from "@/app/images/x.svg";

const EditRequest: React.FC<UpdateRequestFormProps> = ({
  isFormVisible,
  setIsFormVisible,
  disabled,
}) => {
  return (
    isFormVisible && (
      <main
        className="flex flex-col w-[500px] border-2 mt-4 items-center mb-12 bg-white fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 "
        style={{ boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.5)" }}
      >
        <img
          src={x.src}
          alt="X"
          width={20}
          className="m-2 absolute right-0 top-0 cursor-pointer "
          onClick={() => setIsFormVisible(!isFormVisible)}
        />
        <div className="ml-4 mr-4 mt-24">
          <div className="flex flex-col items-center mt-4">
            <div className="flex flex-col w-[500px] border-2 mt-4 items-center mb-12 shadow-lg ">
              <div className="flex flex-col w-[400px] gap-4 ">
                <p className="text-[13px] mt-4">Category</p>
                <select
                  className="border-2 border-gray-300  h-[45px] "
                  id="categories"
                  name="categories"
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {CategoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <p className="text-[13px] ">Companion Needed</p>
                <select
                  className="border-2 border-gray-300  h-[45px] "
                  id="companionCount"
                  name="companionCount"
                >
                  <option value="" disabled>
                    Select Number of Companion Needed
                  </option>
                  {numberofCompanion.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <p className="text-[13px] ">Task Name</p>
                <input
                  type="text"
                  placeholder="Playing basketball, walking my dog, etc."
                  className="border-2 border-gray-300 h-[45px]"
                  id="taskname"
                  name="taskname"
                />
                <p className="text-[13px]">Date</p>
                <input
                  type="Datetime-local"
                  placeholder=""
                  className="border-2 border-gray-300 h-[45px] "
                  id="datetime"
                  name="datetime"
                />
                <p className="text-[13px]">Brief Description of the task</p>
                <textarea
                  placeholder="what the goal of the task is, etc."
                  className="border-2 border-gray-300 h-[150px] resize-none "
                  id="description"
                  name="description"
                />

                <button
                  className={`${
                    disabled
                      ? " text-center bg-orange-500 opacity-50 text-white font-bold mb-12 rounded h-[45px]"
                      : "text-center bg-orange-500 text-white font-bold mb-4 rounded h-[45px] hover:bg-white hover:text-orange-500 hover:border-[2px] hover:border-orange-500 hover:ease-in-out duration-300"
                  } ${disabled && "cursor-not-allowed"}`}
                  disabled={disabled}
                >
                  Update Request
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  );
};

export default EditRequest;
