import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const Home = () => {
  const [userLocation, setUserLocation] = useState(null);
  // const [ambulances, setAmbulances] = useState([]);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAUYtGJqbjfbM31hlUtyZot7dr6GizJh0o",
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error("Error fetching location:", error)
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }, []);

  // Fetch nearest ambulances
  useEffect(() => {
    const fetchAmbulances = async () => {
      if (userLocation) {
        // Function to expand the short URL
        const fetchExpandedUrl = async (shortUrl) => {
        };

        // Expand the short URL
        const expandedUrl = await fetchExpandedUrl("https://maps.app.goo.gl/qBHuCUR2Wgo5UFcL6");

        if (expandedUrl) {
          // Extract GPS coordinates from the expanded URL
          const match = expandedUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/); // Regex to extract lat, lng
          if (match) {
            // const latitude = parseFloat(match[1]);
            // const longitude = parseFloat(match[2]);

            // Add logic to handle or display the friend's location
            // e.g., sending it to your backend or rendering it on a map
          } else {
            console.error("Coordinates not found in the expanded URL.");
          }
        }
      }
    };

    fetchAmbulances();
  }, [userLocation]);

  // Map container style
  const mapContainerStyle = {
    width: "100%",
    height: "500px",
  };

  return (
    <div>
      <h1>Nearest Ambulances</h1>
      {!isLoaded ? (
        <p>Loading Map...</p>
      ) : (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={userLocation || { lat: 0, lng: 0 }}
          zoom={14}
        >
          {/* User's Location */}
          {userLocation && (
            <Marker position={userLocation} label="You" />
          )}

          {/* Ambulance Locations */}
          {/* {ambulances.map((ambulance) => (
            <Marker
              key={ambulance.id}
              position={{ lat: ambulance.lat, lng: ambulance.lng }}
              label={ambulance.name}
            />
          ))} */}
        </GoogleMap>
      )}
    </div>
  );
};

export default Home;
