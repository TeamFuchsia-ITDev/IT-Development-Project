"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
``;

const Map: React.FC = () => {
  const [selectedTravelMode, setSelectedTravelMode] = useState("DRIVING");
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    const startLocation = { lat: 49.112609, lng: -122.830069 };
    const endLocation = { lat: 49.215401, lng: -122.950891 };

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
      <div id="map" style={{ height: "400px", width: "100%" }} />
      <div id="directions-panel" style={{ marginTop: "10px" }}></div>
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
