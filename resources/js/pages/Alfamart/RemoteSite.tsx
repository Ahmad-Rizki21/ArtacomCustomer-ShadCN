import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import { 
    GoogleMap, 
    useLoadScript, 
    Marker, 
    InfoWindow 
} from '@react-google-maps/api';

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Alfamart Lawson',
        href: '#',
    },
    {
        title: 'Remote Site',
        href: '/dashboard/alfamart/remote-site',
    },
];

interface RemoteSite {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    type: 'Alfamart' | 'Lawson';
    totalConnections: number;
    activeStatus: boolean;
    region: string;
    city: string;
}

const remoteSites: RemoteSite[] = [
    { 
        id: 1, 
        name: 'Alfamart Sudirman', 
        latitude: -6.2088, 
        longitude: 106.8456, 
        type: 'Alfamart',
        totalConnections: 125,
        activeStatus: true,
        region: 'DKI Jakarta',
        city: 'Jakarta Pusat'
    },
    { 
        id: 2, 
        name: 'Lawson Senayan', 
        latitude: -6.2261, 
        longitude: 106.8025, 
        type: 'Lawson',
        totalConnections: 75,
        activeStatus: true,
        region: 'DKI Jakarta',
        city: 'Jakarta Selatan'
    },
    { 
        id: 3, 
        name: 'Alfamart Kelapa Gading', 
        latitude: -6.1528, 
        longitude: 106.9131, 
        type: 'Alfamart',
        totalConnections: 100,
        activeStatus: true,
        region: 'DKI Jakarta',
        city: 'Jakarta Utara'
    },
    { 
        id: 4, 
        name: 'Lawson Kemang', 
        latitude: -6.2530, 
        longitude: 106.8248, 
        type: 'Lawson',
        totalConnections: 60,
        activeStatus: true,
        region: 'DKI Jakarta',
        city: 'Jakarta Selatan'
    },
    { 
        id: 5, 
        name: 'Alfamart Dago', 
        latitude: -6.8907, 
        longitude: 107.6133, 
        type: 'Alfamart',
        totalConnections: 90,
        activeStatus: true,
        region: 'Jawa Barat',
        city: 'Bandung'
    },
    { 
        id: 6, 
        name: 'Lawson Setiabudi', 
        latitude: -6.8541, 
        longitude: 107.6056, 
        type: 'Lawson',
        totalConnections: 55,
        activeStatus: true,
        region: 'Jawa Barat',
        city: 'Bandung'
    },
    { 
        id: 7, 
        name: 'Alfamart Darmo', 
        latitude: -7.2707, 
        longitude: 112.7360, 
        type: 'Alfamart',
        totalConnections: 80,
        activeStatus: true,
        region: 'Jawa Timur',
        city: 'Surabaya'
    },
    { 
        id: 8, 
        name: 'Lawson Pakuwon', 
        latitude: -7.2770, 
        longitude: 112.7845, 
        type: 'Lawson',
        totalConnections: 65,
        activeStatus: true,
        region: 'Jawa Timur',
        city: 'Surabaya'
    }
];

export default function RemoteSite() {
    const [selectedSite, setSelectedSite] = useState<RemoteSite | null>(null);

    // Hardcoded API Key (untuk development, gunakan environment variable di production)
    const GOOGLE_MAPS_API_KEY = 'AIzaSyAHkumR2qbKZWyF-3hOWm7WT7C4U3szbIE';

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ['places']
    });

    // Hitung statistik distribusi
    const distributionStats = remoteSites.reduce((acc, site) => {
        // Hitung total per tipe
        if (!acc.byType[site.type]) {
            acc.byType[site.type] = 0;
        }
        acc.byType[site.type]++;

        // Hitung total per region
        if (!acc.byRegion[site.region]) {
            acc.byRegion[site.region] = 0;
        }
        acc.byRegion[site.region]++;

        return acc;
    }, { 
        byType: {} as Record<string, number>, 
        byRegion: {} as Record<string, number> 
    });

    if (loadError) {
        return <div>Error memuat peta</div>;
    }

    if (!isLoaded) {
        return <div>Memuat peta...</div>;
    }

    // Fungsi untuk membuat teks distribusi
    const getDistributionText = () => {
        const typeText = Object.entries(distributionStats.byType)
            .map(([type, count]) => `${type}: ${count}`)
            .join(', ');
        
        const regionText = Object.entries(distributionStats.byRegion)
            .map(([region, count]) => `${region}: ${count}`)
            .join(', ');

        return `Total Remote Site\nTipe: ${typeText}\nWilayah: ${regionText}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Alfamart Remote Site" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-bold">Alfamart Remote Site</h1>
                
                {/* Peta Penuh Layar */}
                <div className="relative w-full h-[calc(100vh-200px)] overflow-hidden rounded-xl">
                    <GoogleMap
                        mapContainerStyle={{
                            width: '100%', 
                            height: '100%'
                        }}
                        zoom={5}
                        center={{lat: -2.5489, lng: 117.8902}}
                        options={{
                            streetViewControl: false,
                            mapTypeControl: false,
                        }}
                    >
                        {remoteSites.map(site => (
                            <Marker
                                key={site.id}
                                position={{ lat: site.latitude, lng: site.longitude }}
                                onClick={() => setSelectedSite(site)}
                            />
                        ))}

                        {selectedSite && (
                            <InfoWindow
                                position={{ 
                                    lat: selectedSite.latitude, 
                                    lng: selectedSite.longitude 
                                }}
                                onCloseClick={() => setSelectedSite(null)}
                            >
                                <div className="p-2">
                                    <h3 className="font-bold text-lg mb-2">{selectedSite.name}</h3>
                                    <p>Wilayah: {selectedSite.region}</p>
                                    <p>Kota: {selectedSite.city}</p>
                                    <p>Tipe: {selectedSite.type}</p>
                                    <p>Total Koneksi: {selectedSite.totalConnections}</p>
                                    <p>Status: {selectedSite.activeStatus ? 'Aktif' : 'Tidak Aktif'}</p>
                                </div>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                </div>
            </div>
        </AppLayout>
    );
}