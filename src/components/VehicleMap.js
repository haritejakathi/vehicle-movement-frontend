import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker, Polyline } from '@react-google-maps/api';
import axios from 'axios';

const mapContainerStyle = {
  width: '100%',
  height: '600px'
};

const center = {
  lat: 17.385044,
  lng: 78.486671
};

const VehicleMap = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
  });

  const [locations, setLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      const res = await axios.get('http://localhost:10000/api/vehicle-location');
      setLocations(res.data);
      setCurrentLocation(res.data[0]);
    };

    fetchLocations();

    const interval = setInterval(() => {
      fetchLocations();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={15}
      center={currentLocation ? { lat: currentLocation.latitude, lng: currentLocation.longitude } : center}
    >
      {currentLocation && (
        <Marker
          position={{ lat: currentLocation.latitude, lng: currentLocation.longitude }}
          icon={{
            url: 'https://maps.google.com/mapfiles/kml/shapes/cabs.png',
            scaledSize: new window.google.maps.Size(50, 50)
          }}
        />
      )}
      <Polyline
        path={locations.map(loc => ({ lat: loc.latitude, lng: loc.longitude }))}
        options={{ strokeColor: '#FF0000' }}
      />
    </GoogleMap>
  );
};

export default VehicleMap;
