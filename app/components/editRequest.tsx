"use client";

import { CategoryOptions, numberofCompanion } from "@/app/libs/reusables";
import { UpdateRequestFormProps } from "../libs/interfaces";
import x from "@/app/images/x.svg";
import { isDST } from "@/app/libs/reusables";

const EditRequest: React.FC<UpdateRequestFormProps> = ({
  isFormVisible,
  setIsFormVisible,
  disabled,
  editRequestData,
  setEditRequestData,
  editable,
  setEditable,
  updateRequest,
}) => {
  return (
    isFormVisible && (
      <div
        className="flex flex-col w-[500px] h-auto border-2 items-center bg-white fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 "
        style={{ boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.5)" }}
      >
        {" "}
        {!editable && (
          <img
            src={x.src}
            alt="X"
            width={20}
            className="absolute right-0 top-0 cursor-pointer mt-2 mr-2"
            onClick={() => setIsFormVisible(!isFormVisible)}
          />
        )}
        <div className="flex flex-col w-[500px] mt-4 items-center mb-4">
          <div className="flex flex-col w-[400px] gap-4 ">
            <p className="text-[10px] mt-4">Category</p>
            <select
              className={`border-2 border-gray-300 h-[45px] ${
                editable ? "" : "pointer-events-none"
              }`}
              value={editRequestData.category}
              onChange={(e) =>
                setEditRequestData({
                  ...editRequestData,
                  category: e.target.value,
                })
              }
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
            <p className="text-[10px] ">Companion Needed</p>
            <select
              className={`border-2 border-gray-300  h-[45px] ${
                editable ? "" : "pointer-events-none"
              }`}
              value={editRequestData.compNeeded}
              onChange={(e) =>
                setEditRequestData({
                  ...editRequestData,
                  compNeeded: e.target.value,
                })
              }
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

            <p className="text-[10px] ">Task Name</p>
            <input
              type="text"
              placeholder="Playing basketball, walking my dog, etc."
              className={`border-2 border-gray-300  h-[45px] ${
                editable ? "" : "pointer-events-none"
              }`}
              value={editRequestData.taskname}
              onChange={(e) =>
                setEditRequestData({
                  ...editRequestData,
                  taskname: e.target.value,
                })
              }
            />
            <p className="text-[10px]">Date</p>
            <input
              type="Datetime-local"
              placeholder=""
              className={`border-2 border-gray-300  h-[45px] ${
                editable ? "" : "pointer-events-none"
              }`}
              value={
                editable
                  ? editRequestData.datetime
                  : editRequestData.datetime
                  ? isDST()
                    ? new Date(
                        new Date(editRequestData.datetime).getTime() -
                          7 * 60 * 60 * 1000
                      )
                        .toISOString()
                        .slice(0, 16)
                    : new Date(
                        new Date(editRequestData.datetime).getTime() -
                          8 * 60 * 60 * 1000
                      )
                        .toISOString()
                        .slice(0, 16)
                  : ""
              }
              onChange={(e) =>
                setEditRequestData({
                  ...editRequestData,
                  datetime: e.target.value,
                })
              }
            />
            <p className="text-[10px]">Brief Description of the task</p>
            <textarea
              placeholder="what the goal of the task is, etc."
              className={`border-2 border-gray-300 h-[150px] resize-none ${
                editable ? "" : "pointer-events-none"
              }`}
              value={editRequestData.description}
              onChange={(e) =>
                setEditRequestData({
                  ...editRequestData,
                  description: e.target.value,
                })
              }
            />
            <button
              className={`${
                disabled
                  ? "text-center bg-orange-500 opacity-50 text-white font-bold  rounded h-[45px] w-[400px]"
                  : "text-center bg-orange-500 text-white font-bold rounded h-[45px] w-[400px] hover:bg-white hover:text-orange-500 hover:border-[2px] hover:border-orange-500 hover:ease-in-out duration-300"
              }`}
              onClick={() => setEditable(!editable)}
              disabled={disabled}
            >
              {editable ? "Cancel Editing" : "Edit Request"}
            </button>

            {editable && (
              <button
                className={`${
                  disabled
                    ? " text-center bg-blue-500 opacity-50 text-white font-bold mb-2 rounded h-[45px]"
                    : "text-center bg-blue-500 text-white font-bold  rounded h-[45px] hover:bg-white hover:text-blue-500 hover:border-[2px] hover:border-blue-500 hover:ease-in-out duration-300"
                } ${disabled && "cursor-not-allowed"}`}
                onClick={updateRequest}
                disabled={disabled}
              >
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default EditRequest;
