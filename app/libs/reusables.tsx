import { ImageMapping } from "@/app/libs/interfaces";

import gaming from "@/app/images/gaming.png";
import sports from "@/app/images/sports.png";
import technology from "@/app/images/technology.png";
import travel from "@/app/images/travel.png";
import shopping from "@/app/images/Shopping.png";
import cooking from "@/app/images/cooking.png";
import Housecleaning from "@/app/images/HouseCleaning.png";
import groceries from "@/app/images/Groceries.png";
import Arts from "@/app/images/Arts.png";
import assistance from "@/app/images/Assistance.png";
import babysitting from "@/app/images/Babysitting.png";
import companionship from "@/app/images/companionship.png";
import fitness from "@/app/images/Fitness.png";
import handyman from "@/app/images/Handyman.png";
import music from "@/app/images/Music.png";
import petcare from "@/app/images/PetCare.png";
import tutoring from "@/app/images/Tutoring.png";
import virtual from "@/app/images/Virtual.png";
import outdoor from "@/app/images/Outdoor.png";
import transportation from "@/app/images/Transportation.png";
import tech from "@/app/images/Techsupport.png";
import moment from "moment-timezone";

export const imageMapping: ImageMapping = {
  Gaming: gaming.src,
  Travel: travel.src,
  Technology: technology.src,
  Sports: sports.src,
  Shopping: shopping.src,
  Cooking: cooking.src,
  "House Cleaning": Housecleaning.src,
  Groceries: groceries.src,
  "Art & Design": Arts.src,
  Assistance: assistance.src,
  Babysitting: babysitting.src,
  Companionship: companionship.src,
  Fitness: fitness.src,
  Handyman: handyman.src,
  Music: music.src,
  "Pet Care": petcare.src,
  Tutoring: tutoring.src,
  "Virtual Assistance": virtual.src,
  "Outdoor Activities": outdoor.src,
  Transportation: transportation.src,
  "Tech Support": tech.src,
};

export const CategoryOptions = [
  "Companionship",
  "Assistance",
  "Outdoor Activities",
  "Virtual Assistance",
  "Gaming",
  "Travel",
  "Sports",
  "Technology",
  "Fitness",
  "Music",
  "House Cleaning",
  "Cooking",
  "Shopping",
  "Pet Care",
  "Babysitting",
  "Tutoring",
  "Transportation",
  "Tech Support",
  "Art & Design",
  "Handyman",
  "Groceries",
];


export const numberofCompanion = [
  "1",
  "2",
  "3",
  "4",
  "5",
]

export  const ethnicityOptions = [
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

export const genderOptions = ["Male", "Female", "Non-Binary", "Other"];


export const labels: { [index: string]: string } = {
  1: "Useless",
  2: "Poor",
  3: "Good",
  4: "Great",
  5: "Excellent",
};

export const currentDateTime = new Date(Date.now());
export const futureDateTime = new Date(currentDateTime.getTime() + 30 * 60000); // + 30 minutes

export function isDST() {
	const timeZone = 'America/Vancouver';
	const currentMoment = moment.tz(timeZone);

	// Check if the current moment is in DST
	return currentMoment.isDST();
}

export const navItems = [
  { text: "Why Join", link: "/why-join" },
  { text: "How it works", link: "/how-it-works" },
];