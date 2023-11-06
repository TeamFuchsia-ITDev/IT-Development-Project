"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import mapboxgl from "mapbox-gl";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import { MapProps } from "@/app/libs/interfaces";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

const Mapbox = ({ startLocation, endLocation }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mapContainer.current === null) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-123.11124, 49.28122],
      zoom: 10,
    });

    // Check if the code is running in a browser environment
    if (typeof window !== "undefined") {
      const directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: "metric",
        profile: "mapbox/driving-traffic",
		alternatives: true

      });

      map.addControl(directions, "top-left");
      directions.setOrigin(startLocation);
      directions.setDestination(endLocation);
    }

    return () => map.remove();
  }, [startLocation, endLocation]);

  return (
    <div>
      <div ref={mapContainer} style={{ width: "100%", height: "800px" }} />
    </div>
  );
};

export default dynamic(() => Promise.resolve(Mapbox), { ssr: false });