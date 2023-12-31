import { FormEvent } from "react";
import { Socket } from "socket.io-client";

export interface UserProps {
  id: string;
  name: string;
  ethnicity: string;
  gender: string;
  birthday: string;
  phonenumber: string;
  image: string;
  userEmail: string;
  location: {
    lng: number;
    lat: number;
    address: {
      fullAddress: string;
      pointOfInterest: string;
      city: string;
      country: string;
    };
  };
}

export interface ProfileData {
  id: string;
  name: string;
  ethnicity: string;
  gender: string;
  birthday: string;
  phonenumber: string;
  image: string;
  userEmail: string;
}

export interface RequestProps {
  id: string;
  taskname: string;
  category: string;
  datetime: string;
  description: string;
  userEmail: string;
  requesterName: string;
  requesterImage: string;
  requesterCity: string;
  status: string;
  compNeeded: string;
}

export interface ApplicationProps {
  id: string;
  amount: GLfloat;
  description: string;
  userEmail: string;
  compName: string;
  compImage: string;
  compCity: string;
  compEthnicity: string;
  compGender: string;
  compBirthday: string;
  status: string;
  requestId: string;
}

export interface ImageMapping {
  [key: string]: string;
}

export interface APIErr {
  code: number;
  message: string;
  cause: string | Error;
}

export interface CardProps {
  cardType?: string;
  request?: RequestProps;
  toggleFormVisibility: (isVisible: boolean) => void;
  onApplyClick: (requestData: {
    id: string;
    taskname?: string;
    requesterName?: string;
    datetime?: string;
  }) => void;
  onLeaveReviewClick?: (request: RequestProps) => void;
  toggleReviewcardVisibility?: (isVisible: boolean) => void;
}

export interface RequestCardProps {
  request?: RequestProps;
  toggleFormVisibility: (isVisible: boolean) => void;
  onEditRequestClick: (requestData: RequestProps) => void;
  toggleDialogboxVisibility?: (isVisible: boolean) => void;
  onMarkAsCompletedClick?: (requestData: RequestProps) => void;
}

export interface NavBarProps {
  mode: boolean;
  toggleMode: (mode: boolean) => void;
}

export interface CompanionCardProps {
  application?: ApplicationProps;
}

export interface HiredApplicantsCardProps {
  application?: ApplicationProps;
  toggleReviewCardVisibility: (isVisible: boolean) => void;
  onLeaveReviewClick: (companionEmail: string) => void;
}

export interface LocationFeature {
  geometry: {
    coordinates: [number, number];
  };
  place_name: string;
  context: Array<{ text: string }>;
}

export interface LocationData {
  features: LocationFeature[];
}

export interface FormData {
  name: string;
  birthday: string;
  ethnicity: string;
  gender: string;
  phonenumber: string;
  location: {
    lng: number;
    lat: number;
    address: {
      fullAddress: string;
      pointOfInterest: string;
      city: string;
      country: string;
    };
  };
}

export interface RequestData {
  id: string;
  taskname?: string;
  requesterName?: string;
  datetime?: string;
}

export interface MapProps {
  startLocation: [number, number];
  endLocation: [number, number];
}

export interface DropdownStates {
  [index: number]: boolean;
}

export interface CompPageData {
  [key: string]: RequestProps[];
}

export interface ModeContextType {
  mode: boolean;
  setMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ApplicationFormProps {
  isFormVisible: boolean;
  setIsFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
  applicationData: {
    requesterName: string;
    taskname: string;
    dateime: string;
  };
  data: {
    requestid: string;
    amount: string;
    description: string;
    status: string;
  };
  setData: React.Dispatch<
    React.SetStateAction<{
      requestid: string;
      amount: string;
      description: string;
      status: string;
    }>
  >;
  disabled: boolean;
  postApplication: (e: FormEvent) => void;
}

export interface UpdateApplicationFormProps {
  isFormVisible: boolean;
  setIsFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
  applicationData: {
    requesterName: string;
    taskname: string;
    dateime: string;
  };
  data: {
    requestid: string;
    amount: string;
    description: string;
    status: string;
  };
  setData: React.Dispatch<
    React.SetStateAction<{
      requestid: string;
      amount: string;
      description: string;
      status: string;
    }>
  >;
  disabled: boolean;
  updateApplication: (e: FormEvent) => void;
  cancelApplication: (e: FormEvent) => void;
  compPage: string;
  editable: boolean;
  setEditable: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface UpdateRequestFormProps {
  isFormVisible: boolean;
  setIsFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
  disabled: boolean;
  editRequestData: RequestProps;
  setEditRequestData: React.Dispatch<React.SetStateAction<RequestProps>>;
  editable: boolean;
  setEditable: React.Dispatch<React.SetStateAction<boolean>>;
  updateRequest: (e: FormEvent) => void;
}

export interface EditProfileFormProps {
  isFormVisible: boolean;
  setIsFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  editProfileData: Partial<UserProps>;
  setEditProfileData: React.Dispatch<React.SetStateAction<Partial<UserProps>>>;
  editable: boolean;
  setEditable: React.Dispatch<React.SetStateAction<boolean>>;
  // updateProfile: (e: FormEvent) => void;
}

export interface ChatProps {
  requestid: string | null;
  username: string | null;
  userType: string | null;
}

export interface SocketReference {
  current: Socket | null;
}

export interface DialogboxProps {
  isDialogboxVisible: boolean;
  setIsDialogboxVisible: React.Dispatch<React.SetStateAction<boolean>>;
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  request: RequestProps;
}

export interface ReviewCardProps {
  isReviewcardVisible: boolean;
  setIsReviewcardVisible: React.Dispatch<React.SetStateAction<boolean>>;
  reviewee?: ProfileData;
  request?: string;
  reviewer?: ProfileData;
  mode: string;
}

export interface TestimonialCardProps {
  name: string;
  image: string;
  testimonial: string;
  role: string;
}

export interface ReviewData {
  id: string;
  requestId: string;
  rating: number;
  comment: string;
  revieweeEmail: string;
  revieweeName: string;
  reviewerName: string;
  reviewerEmail: string;
  reviewType: string;
  revieweeImage: string;
  reviewerImage: string;
}

export interface ReviewInfoCardProps {
  comment: string;
  rating: number;
  reviewerName: string;
  reviewerImage: string;
}

export interface ReviewDataState {
	reviewee: ProfileData | undefined;
	reviewer: ProfileData | undefined;
	request: string;
  }
