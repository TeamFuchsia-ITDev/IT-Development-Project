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
  smallCard?: boolean;
  request?: RequestProps;
  toggleFormVisibility: (isVisible: boolean) => void;
  onApplyClick: (requestData: {
    id: string;
    taskname?: string;
    requesterName?: string;
    datetime?: string;
  }) => void;
}

export interface CompanionCardProps {
  application?: ApplicationProps;
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
