
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Vite/Webpack
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Setup default icon
const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons based on status
const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

type LocationData = {
    id: string;
    name: string;
    lat: string;
    lng: string;
    status: string;
    category: string;
    district: string;
};

export default function GeospatialMap() {
    const { data: locations = [], isLoading } = useQuery<LocationData[]>({
        queryKey: ['/api/stats/locations'],
    });

    // Center of Himachal Pradesh
    const hpCenter: [number, number] = [31.927213, 77.188756];

    if (isLoading) {
        return (
            <Card className="h-[500px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </Card>
        );
    }

    const getIcon = (status: string) => {
        if (status === 'approved' || status === 'rc_issued') return greenIcon;
        if (status === 'rejected') return redIcon;
        return blueIcon; // Pending / In Process
    };

    return (
        <Card className="col-span-1 lg:col-span-2 overflow-hidden border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardHeader className="bg-muted/50 pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" />
                    Geospatial Intelligence
                </CardTitle>
            </CardHeader>
            <div className="h-[500px] w-full relative z-0">
                <MapContainer
                    center={hpCenter}
                    zoom={8}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={false}
                    className="z-0"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {locations.map((loc) => {
                        const lat = parseFloat(loc.lat);
                        const lng = parseFloat(loc.lng);
                        if (isNaN(lat) || isNaN(lng)) return null;

                        return (
                            <Marker
                                key={loc.id}
                                position={[lat, lng]}
                                icon={getIcon(loc.status)}
                            >
                                <Popup>
                                    <div className="p-1">
                                        <h3 className="font-bold text-sm">{loc.name}</h3>
                                        <div className="text-xs text-muted-foreground">{loc.district}</div>
                                        <div className="mt-1">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold text-white
                                                ${loc.status === 'approved' ? 'bg-green-500' :
                                                    loc.status === 'rejected' ? 'bg-red-500' : 'bg-blue-500'}`
                                            }>
                                                {loc.status}
                                            </span>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>

                {/* Legend Overlay */}
                <div className="absolute bottom-4 right-4 bg-white/90 p-3 rounded-lg shadow-lg z-[1000] text-xs border border-border">
                    <div className="font-bold mb-2 text-foreground">Status Legend</div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-3 h-3 rounded-full bg-green-500"></span> Approved
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span> In Process
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500"></span> Rejected
                    </div>
                </div>
            </div>
        </Card>
    );
}
