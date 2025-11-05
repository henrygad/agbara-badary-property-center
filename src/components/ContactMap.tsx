"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


export default function ContactMap() {
    // Approximate coordinates for Agbara–Lusada Way
    const position: [number, number] = [6.5344, 3.0303];

    // Custom light red marker icon
    const markerIcon = new L.Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/2776/2776067.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    return <div className="w-full flex-1 rounded-xl overflow-hidden shadow-lg">
        <MapContainer
            center={position}
            zoom={15}
            scrollWheelZoom={true}
            dragging={true}
            doubleClickZoom={true}
            className="w-full h-full"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} icon={markerIcon}>
                <Popup>
                    <Popup>
                        <strong>Our Office</strong><br />
                        Mango Bus Stop, Agbara–Lusada Road<br />
                        Ogun State, Nigeria
                    </Popup>
                </Popup>
            </Marker>
        </MapContainer>
    </div>
}
