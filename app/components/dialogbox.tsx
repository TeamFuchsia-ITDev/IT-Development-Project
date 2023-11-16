"use client";

import { DialogboxProps } from "@/app/libs/interfaces";
import done from "@/app/images/done.svg"

const Dialogbox: React.FC<DialogboxProps> = ({
  isDialogboxVisible,
  disabled,
  setIsDialogboxVisible,
  setDisabled,
}) => {
  return (
    isDialogboxVisible && (
      <main
        className="bg-white fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-xl"
        style={{ boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.5)" }}
      >
        <div className="flex flex-col justify-center  w-[300px] text-center gap-2 p-8 ">
          <img src={done.src} className="w-[70px] h-[100px] mx-auto" />
          <h1 className="text-sm mb-2">
            Are you sure you want to end the task and mark it as{" "}
            <span className="text-green-500">complete</span>?
          </h1>
          <button className="text-sm text-center bg-green-500 text-white rounded-full h-[35px]   hover:bg-white hover:text-green-400 hover:border-[2px] hover:border-green-400 hover:ease-in-out duration-300">
            Yes
          </button>
          <button
            className="text-sm text-center bg-red-500 text-white rounded-full h-[35px]   hover:bg-white hover:text-red-400 hover:border-[2px] hover:border-red-400 hover:ease-in-out duration-300"
            onClick={() => {
              setIsDialogboxVisible(!isDialogboxVisible);
            }}
          >
            No
          </button>
        </div>
      </main>
    )
  );
};

export default Dialogbox;
