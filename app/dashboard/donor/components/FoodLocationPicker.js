"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Debounce utility
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

// Marker Component
const LocationMarker = ({ position, setPosition }) => {
  const markerRef = useRef(null);

  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return (
    <Marker
      draggable
      eventHandlers={{
        dragend() {
          const marker = markerRef.current;
          if (marker) {
            setPosition([marker.getLatLng().lat, marker.getLatLng().lng]);
          }
        },
      }}
      position={position}
      ref={markerRef}
    >
      <Popup>Drag me or click map to change location</Popup>
    </Marker>
  );
};

// Map controller
const MapController = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, 13, { animate: true });
  }, [position, map]);
  return null;
};

const LocationPicker = ({ onLocationSelect }) => {
  const [position, setPosition] = useState([31.5204, 74.3587]); // Lahore
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (onLocationSelect) {
      onLocationSelect({ lat: position[0], lng: position[1] });
    }
  }, [position]);

  // Debounced fetchSuggestions
  const fetchSuggestions = useCallback(
    debounce(async (value) => {
      if (!value || value.trim().length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(
          `https://api.locationiq.com/v1/autocomplete?key=pk.e48ed5fe6bb4fdac8eb3a8b1280d16d9&q=${encodeURIComponent(
            value
          )}&limit=5`
        );
        const data = await res.json();

        if (data.error) {
          console.warn("Rate limited or error:", data.error);
          setSuggestions([]);
        } else {
          setSuggestions(data);
        }
      } catch (err) {
        console.error("Suggestion fetch error:", err.message);
      }
    }, 1000),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setAddress(value);

    if (value.trim().length >= 3) {
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (lat, lon, display_name) => {
    setAddress(display_name);
    setPosition([parseFloat(lat), parseFloat(lon)]);
    setSuggestions([]);
  };

  // Optional: use this instead of debounce for manual search
  // const handleSearchClick = () => {
  //   if (address.trim().length >= 3) {
  //     fetchSuggestions(address);
  //   }
  // };

  if (!mounted) return <p>Loading map...</p>;

  return (
    <div className="w-full relative">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Input Field */}
      <div className="relative mb-2 z-50">
        <input
          type="text"
          placeholder="Search location..."
          value={address}
          onChange={handleInputChange}
          className="border px-2 py-1 flex-1 rounded w-full"
        />
        {/* Optional Search Button */}
        {/* <button onClick={handleSearchClick} className="mt-1 bg-blue-500 text-white px-4 py-1 rounded">Search</button> */}

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <ul className="absolute z-50 bg-white border rounded w-full shadow max-h-40 overflow-y-auto">
            {suggestions.map((s, index) => (
              <li
                key={index}
                onClick={() =>
                  handleSelectSuggestion(s.lat, s.lon, s.display_name)
                }
                className="px-2 py-1 cursor-pointer hover:bg-gray-100 text-sm"
              >
                {s.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Map Display */}
      <div className="h-64 w-full border rounded relative z-10">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} />
          <MapController position={position} />
        </MapContainer>
      </div>
    </div>
  );
};

export default LocationPicker;
