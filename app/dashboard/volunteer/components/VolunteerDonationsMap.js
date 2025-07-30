"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function FitBounds({ donations }) {
  const map = useMap();

  if (!donations || donations.length === 0) return null;

  const bounds = L.latLngBounds(
    donations
      .filter((d) => d.lat && d.lng)
      .map((d) => [d.lat, d.lng])
  );

  if (bounds.isValid()) {
    map.fitBounds(bounds, { padding: [50, 50] });
  }

  return null;
}

export default function VolunteerDonationsMap({ donations = [] }) {
  const fallback = [31.5204, 74.3587]; // Lahore fallback

  return (
    <div className="h-[480px] w-full mb-6 border rounded overflow-hidden">
      <MapContainer
        center={fallback}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds donations={donations} />

        {donations
          .filter((d) => d.lat && d.lng)
          .map((d) => (
            <Marker key={d._id} position={[d.lat, d.lng]}>
              <Popup>
                <strong>{d.foodType}</strong> — {d.quantity} <br />
                {d.location}
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}