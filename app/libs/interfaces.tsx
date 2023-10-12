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
  taskname: string;
  category: string;
  datetime: string;
  description: string;
  userEmail: string;
  requesterName: string;
  requesterImage: string;
  requesterCity: string;
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
}

// Define interfaces for location data
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

// Define an interface for your form data
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
