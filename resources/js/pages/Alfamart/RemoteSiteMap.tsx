// pages/Alfamart/RemoteSiteMap.tsx
import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

interface RemoteSite {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  type: 'Indomaret' | 'Lawson';
}

const RemoteSiteMap: React.FC = () => {
  const [selectedSite, setSelectedSite] = useState<RemoteSite | null>(null);

  const mapContainerStyle = {
    width: '100%',
    height: '500px'
  };

  const center = {
    lat: -2.5489,  // Koordinat tengah Indonesia
    lng: 117.8902
  };

  const remoteSites: RemoteSite[] = [
    // Contoh data - akan diganti dengan data dari backend
    { 
      id: 1, 
      name: 'Indomaret Sudirman', 
      latitude: -6.2088, 
      longitude: 106.8456, 
      type: 'Indomaret' 
    },
    { 
      id: 2, 
      name: 'Lawson Senayan', 
      latitude: -6.2261, 
      longitude: 106.8025, 
      type: 'Lawson' 
    }
  ];

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={5}
        center={center}
      >
        {remoteSites.map(site => (
          <Marker
            key={site.id}
            position={{ lat: site.latitude, lng: site.longitude }}
            onClick={() => setSelectedSite(site)}
            icon={site.type === 'Indomaret' 
              ? '/indomaret-icon.png' 
              : '/lawson-icon.png'
            }
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
            <div>
              <h3>{selectedSite.name}</h3>
              <p>Tipe: {selectedSite.type}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default RemoteSiteMap;