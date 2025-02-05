import React, { useEffect, useState } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import "./styles.css";

function CaptainHome() {
  const [userLocation, setUserLocation] = useState(null);
  const [isOnline, setIsOnline] = useState(false);

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

  const handleToggle = () => {
    if (!isOnline) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            setIsOnline(true);
          },
          (error) => {
            console.error("Error fetching location:", error);
            alert("Unable to fetch location. Please enable location services.");
          }
        );
      } else {
        alert("Geolocation is not supported by your browser.");
      }
    } else {
      setIsOnline(false);
    }
  };

  const mapContainerStyle = {
    width: "100%",
    height: "500px",
  };

  return (
    <div>
      <div className="captain-status-toggle">
        <h2>Captain Status: {isOnline ? "Online" : "Offline"}</h2>
        <button
          onClick={handleToggle}
          className={`toggle-button ${isOnline ? "online" : "offline"}`}
          aria-label={`Toggle to ${isOnline ? "offline" : "online"} status`}
        >
          {isOnline ? "Set Offline" : "Set Online"}
        </button>
      </div>
      {!isLoaded ? (
        <p>Loading Map...</p>
      ) : (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={userLocation || { lat: 37.7749, lng: -122.4194 }} // Default to San Francisco
          zoom={14}
        >
          {/* Add any markers or additional map features here */}
        </GoogleMap>
      )}
    </div>
  );
}

export default CaptainHome;
