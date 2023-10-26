"use client";

import x from "@/app/images/x.svg";
import { UpdateApplicationFormProps } from "@/app/libs/interfaces";

const UpdateApplicationForm: React.FC<UpdateApplicationFormProps> = ({
  isFormVisible,
  disabled,
  setIsFormVisible,
  applicationData,
  data,
  setData,
  updateApplication,
  compPage,
  editable,
  setEditable,
}) => {
  return (
    isFormVisible && compPage === "Pending" && (
        <div
          className="flex flex-col w-[500px]  border-2 mt-4 items-center mb-12 bg-white fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 "
          style={{ boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.5)" }}
        >
          <img
            src={x.src}
            alt="X"
            width={20}
            className="m-2 absolute right-0 top-0 cursor-pointer "
            onClick={() => setIsFormVisible(!isFormVisible)}
          />

          <p className="text-center underline underline-offset-8 decoration-rose-500 decoration-2 mt-6">
            Application Form
          </p>
          <div className="ml-4 mr-4 text-center ">
            <p className="text-[13px] mt-4">
              To let the requester know more about you fill up the form
              below
            </p>
            <h1 className="text-[13px] ">
              You are now applying for {applicationData.requesterName}'s{" "}
              {applicationData.taskname} at {applicationData.dateime}.{" "}
            </h1>
          </div>

          <div className="">
            <p className="text-[13px] mt-8 mb-4">
              <a className="text-green-500">Amount</a> ( the amount you want
              for your service, input 0 if free)
            </p>
            <input
              type="number"
              step="0.01"
              min="0"
              className={`border-2 border-gray-300 h-[45px] w-[400px] ${
                editable ? "" : "pointer-events-none"
              }`}
              value={data.amount}
              onChange={(e) => setData({ ...data, amount: e.target.value })}
            />
            <p className="text-[13px] mt-4 mb-4">
              <a className="text-rose-500">Explain</a> Why are you a good
              fit to apply?
            </p>
            <textarea
              className={`border-2 border-gray-300 h-[150px] resize-none w-[400px] mb-4 ${
                editable ? "" : "pointer-events-none"
              }`}
              value={data.description}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
            />
          </div>
          <button
            className={`text-center bg-orange-500 text-white font-bold mb-2 rounded h-[45px] w-[400px] hover:bg-white hover:text-orange-500 hover:border-[2px] hover:border-orange-500 hover:ease-in-out duration-300`}
            onClick={() => setEditable(!editable)}
          >
            {editable ? "Cancel Editing" : "Edit Application"}
          </button>
          <button
            className={`text-center bg-rose-500 text-white font-bold mb-2 rounded h-[45px] w-[400px] hover:bg-white hover:text-rose-500 hover:border-[2px] hover:border-rose-500 hover:ease-in-out duration-300 
            }`}
          >
            Cancel Application
          </button>

          <button
            className={`text-center bg-blue-500 text-white font-bold mb-4 rounded h-[45px] w-[400px] hover:bg-white hover:text-blue-500 hover:border-[2px] hover:border-blue-500 hover:ease-in-out duration-300 ${
              !editable ? "collapse" : ""
            }`}
            onClick={updateApplication}
          >
            Save Changes
          </button>
        </div>
      )
  );
};

export default UpdateApplicationForm;
