"use client";

import x from "@/app/images/x.svg";
import { ApplicationFormProps } from "@/app/libs/interfaces";

const ApplicationFormPopUp: React.FC<ApplicationFormProps> = ({
  isFormVisible,
  setIsFormVisible,
  applicationData,
  data,
  setData,
  disabled,
  postApplication,
}) => {
  return (
    isFormVisible && (
      <div
        className="flex flex-col w-[500px] border-2 mt-4 items-center mb-12 bg-white fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 "
        style={{ boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.5)" }}
      >
        <img
          src={x.src}
          alt="X"
          width={20}
          className="m-2 absolute right-0 top-0 cursor-pointer "
          onClick={() => {
            setIsFormVisible(!isFormVisible);
            setData({
              ...data,
              amount: "",
              description: "",
            });
          }}
        />

        <p className="text-center underline underline-offset-8 decoration-rose-500 decoration-2 mt-6">
          Application Form
        </p>
        <div className="ml-4 mr-4 text-center ">
          <p className="text-[13px] mt-4">
            To let the requester know more about you, fill up the form below
          </p>
          <h1 className="text-[13px] ">
            You are now applying for {applicationData.requesterName}'s{" "}
            {applicationData.taskname} at {applicationData.dateime}.{" "}
          </h1>
        </div>

        <div className="">
          <p className="text-[13px] mt-8 mb-4">
            <a className="text-green-500">Amount</a> ( The amount you want for
            your service, input 0 if free)
          </p>
          <input
            type="number"
            id="amount"
            name="amount"
            step="0.01"
            min="0"
            className="border-2 border-gray-300 h-[45px] w-[400px]"
            value={data.amount}
            onChange={(e) => setData({ ...data, amount: e.target.value })}
          />
          <p className="text-[13px] mt-4 mb-4">
            <a className="text-rose-500">Explain</a> ( Why are you a good fit to
            apply? )
          </p>
          <textarea
            id="description"
            name="description"
            className="border-2 border-gray-300 h-[150px] resize-none w-[400px] mb-4"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />
        </div>
        <button
          className={`${disabled ? "text-center bg-green-500 opacity-50 text-white font-bold mb-8 rounded h-[45px] w-[400px] cursor-not-allowed" : "text-center bg-green-500 text-white font-bold mb-8 rounded h-[45px] w-[400px] hover:bg-white hover:text-green-500 hover:border-[2px] hover:border-green-500 hover:ease-in-out duration-300"}`}
          onClick={postApplication}
          disabled={disabled}
        >
          Apply
        </button>
      </div>
    )
  );
};

export default ApplicationFormPopUp;
