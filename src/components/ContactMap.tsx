"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


export default function ContactMap() {
    // Approximate coordinates for Agbara–Lusada Way
    const position: [number, number] = [6.5145, 3.0412];


    // Custom light red marker icon
    const markerIcon = new L.Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/2776/2776067.png",
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -30],
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
                    <strong>Agbara–Badagry Property Center</strong>
                    <br />
                    12, Mango Bus Stop, Agbara–Lusada Way
                </Popup>
            </Marker>
        </MapContainer>
    </div>
}
