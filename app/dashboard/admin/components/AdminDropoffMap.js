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
      lineOptions: { styles: [{ color: "#3388ff", weight: 5 }] },
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
          setEta(Math.round(route.summary.totalTime / 60));
        }
      })
      .addTo(map);

    return () => {
      map.removeControl(instance);
    };
  }, [from, to, map, setEta]);

  return null;
}

export default function AdminDropoffMap({
  selected,
  onSelectLocation,
  onAddressChange,
}) {
  const [volunteerPos, setVolunteerPos] = useState(null);
  const [dropoffPos, setDropoffPos] = useState(selected || null);
  const [eta, setEta] = useState(null);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setVolunteerPos([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => console.error("Geolocation error:", err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // 🔹 Fetch suggestions
  const fetchSuggestions = async (q) => {
    if (!q) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          q
        )}`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Suggestion fetch error:", err);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(setTimeout(() => fetchSuggestions(val), 500));
  };

  const handleSelect = (s) => {
    const latlng = [parseFloat(s.lat), parseFloat(s.lon)];
    setDropoffPos(latlng);
    setQuery(s.display_name);
    setSuggestions([]);

    // 🔹 send props back up
    if (onSelectLocation) onSelectLocation(latlng);
    if (onAddressChange) onAddressChange(s.display_name);
  };

  const center = volunteerPos || dropoffPos || [31.5204, 74.3587]; // fallback

  return (
    <div className="mt-3">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search drop-off location..."
        className="w-full border p-2 rounded mb-2"
      />
      {suggestions.length > 0 && (
        <ul className="border rounded bg-white shadow max-h-40 overflow-y-auto mb-2">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => handleSelect(s)}
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}

      <div className="h-64 w-full border rounded overflow-hidden">
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          onClick={(e) => {
            const latlng = [e.latlng.lat, e.latlng.lng];
            setDropoffPos(latlng);

            // 🔹 pass clicked coords + reverse geocode
            if (onSelectLocation) onSelectLocation(latlng);

            fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`
            )
              .then((res) => res.json())
              .then((data) => {
                if (onAddressChange) onAddressChange(data.display_name);
                setQuery(data.display_name);
              });
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {volunteerPos && (
            <Marker position={volunteerPos}>
              <Popup>You (Volunteer)</Popup>
            </Marker>
          )}

          {dropoffPos && (
            <Marker position={dropoffPos}>
              <Popup>Drop-off location</Popup>
            </Marker>
          )}

          {volunteerPos && dropoffPos && (
            <RoutingMachine from={volunteerPos} to={dropoffPos} setEta={setEta} />
          )}
        </MapContainer>
      </div>

      {volunteerPos && dropoffPos && eta !== null && (
        <p className="text-sm text-gray-600 mt-2">
          Estimated travel time: <strong>{eta} min</strong>
        </p>
      )}
    </div>
  );
}
