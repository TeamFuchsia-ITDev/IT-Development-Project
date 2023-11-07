// "use client";

// import React, { useEffect, useRef } from "react";
// import dynamic from "next/dynamic";
// import mapboxgl from "mapbox-gl";
// import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
// import { MapProps } from "@/app/libs/interfaces";
// import "mapbox-gl/dist/mapbox-gl.css";
// import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";

// mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

// const Map = ({ startLocation, endLocation }: MapProps) => {
//   const mapContainer = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     if (mapContainer.current === null) return;

//     const map = new mapboxgl.Map({
//       container: mapContainer.current,
//       style: "mapbox://styles/mapbox/streets-v12",
//       center: [-123.11124, 49.28122],
//       zoom: 10,
//     });

//     // Check if the code is running in a browser environment
//     if (typeof window !== "undefined") {
//       const directions = new MapboxDirections({
//         accessToken: mapboxgl.accessToken,
//         unit: "metric",
//         profile: "mapbox/driving-traffic",
// 		alternatives: true

//       });

//       map.addControl(directions, "top-left");
//       directions.setOrigin(startLocation);
//       directions.setDestination(endLocation);
//     }

//     return () => map.remove();
//   }, [startLocation, endLocation]);

//   return (
//     <div>
//       <div ref={mapContainer} style={{ width: "100%", height: "800px" }} />
//     </div>
//   );
// };

// export default dynamic(() => Promise.resolve(Map), { ssr: false });

"use client";

import React, { ChangeEvent, useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const Map: React.FC = () => {
  const [selectedTravelMode, setSelectedTravelMode] = useState('DRIVING');
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    const startLocation = { lat: 49.112609, lng: -122.830069 };
    const endLocation = { lat: 49.215401, lng: -122.950891 };

    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API!,
      version: 'weekly',
    });

    loader.importLibrary('core').then(() => {
      const map = new window.google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: startLocation,
        zoom: 12,
      });

      if (!directionsRenderer) {
        // Initialize directionsRenderer only once
        const renderer = new window.google.maps.DirectionsRenderer({
          map: map,
          panel: document.getElementById('directions-panel') as HTMLElement,
        });
        setDirectionsRenderer(renderer);
      }

      const directionsService = new window.google.maps.DirectionsService();

      const request: google.maps.DirectionsRequest = {
        origin: startLocation,
        destination: endLocation,
        travelMode: selectedTravelMode as google.maps.TravelMode,
      };

      directionsService.route(request, function (result, status) {
        if (status === window.google.maps.DirectionsStatus.OK && directionsRenderer) {
          directionsRenderer.setDirections(result);
        }
      });
    });
  }, [selectedTravelMode, directionsRenderer]);  

  const handleTravelModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTravelMode(event.target.value);
  };

  return (
    <div>
      <div id="map" style={{ height: '400px', width: '100%' }} />
      <div id="directions-panel" style={{ marginTop: '10px' }}></div>
      <label>
        Select Travel Mode:
        <select value={selectedTravelMode} onChange={handleTravelModeChange}>
          <option value="DRIVING">Driving</option>
          <option value="BICYCLING">Bicycling</option>
          <option value="WALKING">Walking</option>
        </select>
      </label>
    </div>
  );
};

export default Map;

