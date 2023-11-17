"use client";

import { ReviewCardProps } from "@/app/libs/interfaces";
import Rating from "@mui/material/Rating";
import { useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import { labels } from "@/app/libs/reusables";

function getLabelText(value: number) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  isReviewcardVisible,
  disabled,
  setIsReviewcardVisible,
  setDisabled,
}) => {
  const [value, setValue] = useState<number | null>(5);
  const [hover, setHover] = useState(-1);

  return (
    isReviewcardVisible && (
      <main
        className="w-[370px] bg-white fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 "
        style={{ boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)" }}
      >
        <div className="flex flex-col justify-center items-center gap-2 ">
          <div>
            <h1 className="text-xl pt-4">Leave a Review to this user</h1>
          </div>
          <div className="flex flex-col items-center justify-center">
            {value !== null && (
              <div className="ml-2">{labels[hover !== -1 ? hover : value]}</div>
            )}
            <Rating
              name="hover-feedback"
              value={value}
              getLabelText={getLabelText}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
              onChangeActive={(event, newHover) => {
                setHover(newHover);
              }}
              emptyIcon={
                <StarIcon style={{ opacity: 0.95 }} fontSize="inherit" />
              }
            />
          </div>
          <textarea
            id="description"
            name="description"
            className="border-2 border-gray-300 h-[150px] resize-none w-[300px] focus:outline-none focus:border-transparent"
            placeholder="Can you tell us why you gave this Rating? ... "
          />

          <button className="text-center bg-green-500 text-white mt-2 rounded-full h-[35px] w-[300px] hover:bg-white hover:text-green-500 hover:border-[2px] hover:border-green-500 hover:ease-in-out duration-300">
            Submit
          </button>
          <button
            className="text-center bg-red-500 text-white  mb-4 rounded-full h-[35px] w-[300px] hover:bg-white hover:text-red-500 hover:border-[2px] hover:border-red-500 hover:ease-in-out duration-300"
            onClick={() => {
              setIsReviewcardVisible(!isReviewcardVisible);
            }}
          >
            Cancel
          </button>
        </div>
      </main>
    )
  );
};

export default ReviewCard;
