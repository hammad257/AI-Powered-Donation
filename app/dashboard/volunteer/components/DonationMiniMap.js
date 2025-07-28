"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine"; // attaches to L.Routing

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function RoutingMachine({ from, to, setEta }) {
  const map = useMap();

  useEffect(() => {
    if (!from || !to) return;

    const instance = L.Routing.control({
      waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
      lineOptions: {
        styles: [{ color: "#3388ff", weight: 5 }],
      },
      showAlternatives: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      routeWhileDragging: false,
      show: false,
    })
      .on("routesfound", function (e) {
        const route = e.routes?.[0];
        if (route && setEta) {
          // duration in seconds
          setEta(Math.round(route.summary.totalTime / 60)); // minutes
        }
      })
      .addTo(map);

    return () => {
      map.removeControl(instance);
    };
  }, [from, to, map, setEta]);

  return null;
}

export default function DonationMiniMap({ donation }) {
  const [volunteerPos, setVolunteerPos] = useState(null);
  const [eta, setEta] = useState(null);

  const { lat, lng, foodType, quantity, location } = donation || {};

  useEffect(() => {
    // get volunteer's current location
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setVolunteerPos([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          console.error("Geolocation error:", err);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  if (!lat || !lng) {
    return (
      <p className="text-xs text-gray-500 mt-2">
        No coordinates provided for this donation.
      </p>
    );
  }

  const donationPos = [lat, lng];
  const center = volunteerPos || donationPos;

  return (
    <div className="mt-3">
      <div className="h-64 w-full border rounded overflow-hidden">
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Donation marker */}
          <Marker position={donationPos}>
            <Popup>
              <strong>{foodType}</strong> - {quantity}
              <br />
              {location}
            </Popup>
          </Marker>

          {/* Volunteer marker */}
          {volunteerPos && (
          <Marker position={volunteerPos}>
            <Popup>You (Volunteer)</Popup>
          </Marker>
          )}

          {/* Routing */}
          {volunteerPos && (
            <RoutingMachine from={volunteerPos} to={donationPos} setEta={setEta} />
          )}
        </MapContainer>
      </div>

      {volunteerPos && eta !== null && (
        <p className="text-sm text-gray-600 mt-2">
          Estimated travel time: <strong>{eta} min</strong>
        </p>
      )}
    </div>
  );
}
