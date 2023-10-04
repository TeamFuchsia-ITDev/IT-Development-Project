const getGeolocation = (): Promise<{ lat: number; lng: number }> => {
	return new Promise((resolve, reject) => {
	  if ('geolocation' in navigator) {
		const options: PositionOptions = {
		  enableHighAccuracy: true,
		  timeout: 5000,
		  maximumAge: 0,
		};
  
		const success = (pos: GeolocationPosition) => {
		  const crd = pos.coords;
		  const location = {
			lat: crd.latitude,
			lng: crd.longitude,
		  };
		  resolve(location);
		};
  
		const error = (err: GeolocationPositionError) => {
		  reject(new Error(`ERROR(${err.code}): ${err.message}. Error getting your location`));
		};
  
		navigator.geolocation.getCurrentPosition(success, error, options);
	  } else {
		reject(new Error('Geolocation is not supported'));
	  }
	});
  };
  
  export default getGeolocation;
  