"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface MapProps {
  startLocation: {
    lat: number;
    lng: number;
  };
  endLocation: {
    lat: number;
    lng: number;
  };
}

const Map: React.FC<MapProps> = ({ startLocation, endLocation }) => {
  const [selectedTravelMode, setSelectedTravelMode] = useState("DRIVING");
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API!,
      version: "weekly",
    });

    loader.importLibrary("core").then(() => {
      const map = new window.google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          center: startLocation,
          zoom: 18,
        }
      );

      if (!directionsRenderer) {
        // Initialize directionsRenderer only once
        const renderer = new window.google.maps.DirectionsRenderer({
          map: map,
          panel: document.getElementById("directions-panel") as HTMLElement,
        });
        setDirectionsRenderer(renderer);
      }
      directionsRenderer?.setMap(map);

      const directionsService = new window.google.maps.DirectionsService();

      const request: google.maps.DirectionsRequest = {
        origin: startLocation,
        destination: endLocation,
        travelMode: selectedTravelMode as google.maps.TravelMode,
      };

      directionsService.route(request, function (result, status) {
        if (
          status === window.google.maps.DirectionsStatus.OK &&
          directionsRenderer
        ) {
          directionsRenderer.setDirections(result);
        }
      });
    });
  }, [selectedTravelMode, directionsRenderer]);

  const handleTravelModeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedTravelMode(event.target.value);
  };

  return (
    <div>
      <div className="flex flex-row">
      <div id="map" className="w-full" />
      <div id="directions-panel" className=""></div>
      </div>
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


