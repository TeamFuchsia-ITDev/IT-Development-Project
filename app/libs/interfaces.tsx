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
  amount: GLfloat;
  datetime: string;
  userEmail: string;
  requesterName: string;
  requesterImage: string;
  requesterCity: string;
}
