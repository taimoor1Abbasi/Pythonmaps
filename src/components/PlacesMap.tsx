"use client";

import { useEffect, useMemo } from "react";
import { divIcon } from "leaflet";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import type { Place } from "@/lib/places";

function MapFocus({ place }: { place: Place | null }) {
  const map = useMap();

  useEffect(() => {
    if (place) {
      map.flyTo([place.latitude, place.longitude], Math.max(map.getZoom(), 15), {
        duration: 0.7,
      });
    }
  }, [map, place]);

  useEffect(() => {
    const zoomIn = () => map.zoomIn();
    const zoomOut = () => map.zoomOut();
    const recenter = () => map.flyTo([40.728, -73.999], 14, { duration: 0.7 });

    window.addEventListener("atlas-zoom-in", zoomIn);
    window.addEventListener("atlas-zoom-out", zoomOut);
    window.addEventListener("atlas-recenter", recenter);
    return () => {
      window.removeEventListener("atlas-zoom-in", zoomIn);
      window.removeEventListener("atlas-zoom-out", zoomOut);
      window.removeEventListener("atlas-recenter", recenter);
    };
  }, [map]);

  return null;
}

export default function PlacesMap({
  places,
  selectedPlace,
  onSelect,
}: {
  places: Place[];
  selectedPlace: Place | null;
  onSelect: (place: Place) => void;
}) {
  const markers = useMemo(
    () =>
      places.map((place) => ({
        place,
        icon: divIcon({
          className: "",
          html: `<div class="atlas-marker${selectedPlace?.id === place.id ? " is-selected" : ""}"><span>${place.category === "Coffee" ? "☕" : place.category === "Parks" ? "✳" : place.category === "Culture" ? "◈" : place.category === "Shopping" ? "◇" : "✳"}</span></div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 34],
        }),
      })),
    [places, selectedPlace?.id],
  );

  return (
    <MapContainer
      center={[40.728, -73.999]}
      zoom={14}
      scrollWheelZoom
      zoomControl={false}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <MapFocus place={selectedPlace} />
      {markers.map(({ place, icon }) => (
        <Marker
          key={place.id}
          position={[place.latitude, place.longitude]}
          icon={icon}
          eventHandlers={{ click: () => onSelect(place) }}
        />
      ))}
    </MapContainer>
  );
}
