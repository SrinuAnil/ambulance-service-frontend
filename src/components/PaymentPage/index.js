import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "./styles.css";
import { backend_api } from "../../constant";

const GOOGLE_MAPS_API_KEY = "AIzaSyAUYtGJqbjfbM31hlUtyZot7dr6GizJh0o";

function PaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isPaid, setIsPaid] = useState(false);
    const [error, setError] = useState("");
    const { selectedAmbulance, selectedOptions, totalPrice, customer } = location.state || {};
    const [userBalance, setUserBalance] = useState(customer?.topup || 0);

    const [showModal, setShowModal] = useState(false);
    const [newAddress, setNewAddress] = useState("");
    const [selectedAddress, setSelectedAddress] = useState("");  // Initially no address selected
    const [addresses, setAddresses] = useState(customer?.addresses || []);
    const [fromLocation, setFromLocation] = useState(null);
    const [toLocation, setToLocation] = useState(null);
    const [mapModal, setMapModal] = useState({ open: false, type: null });

    if (!selectedAmbulance) {
        return <p>No ambulance selected. Please go back and choose one.</p>;
    }

    const handlePayment = async () => {
        if (!selectedAddress || !fromLocation || !toLocation) {
            setError("Please select an address");
            return;
        }

        const bookingData = {
            userId: customer._id,
            ambulanceId: selectedAmbulance.id,
            ambulanceName: selectedAmbulance.name,
            totalPrice,
            location: selectedAddress,
            fromLocation,
            toLocation,
            timestamp: new Date().toISOString(),
            time: new Date().getTime(),
        };

        try {
            if (userBalance >= totalPrice) {
                const response = await fetch(`${backend_api}/api/bookings`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(bookingData),
                });

                if (response.ok) {
                    setIsPaid(true);
                    setUserBalance((prevBalance) => prevBalance - totalPrice);
                    localStorage.setItem(
                        "customer",
                        JSON.stringify({ ...customer, topup: customer.topup - totalPrice })
                    );
                } else {
                    console.error("Payment failed");
                }
            } else {
                setError("Insufficient Balance");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const openMapModal = (type) => {
        setMapModal({ open: true, type });
    };

    const handleLocationSelect = (lat, lng) => {
        if (mapModal.type === "from") {
            setFromLocation({ latitude: lat, longitude: lng });
        } else {
            setToLocation({ latitude: lat, longitude: lng });
        }
        setMapModal({ open: false, type: null });
    };

    const handleAddAddress = () => {
        if (newAddress.trim() !== "") {
            setAddresses([...addresses, newAddress]);
            setSelectedAddress(newAddress);  // Select the new address automatically
            setNewAddress("");
            setShowModal(false);
        }
    };

    return (
        <div className="payment-container">
            <h2>💳 Payment</h2>

            {/* Address Selection Dropdown */}
            <label>Select Address:</label>

            <select value={selectedAddress} onChange={(e) => setSelectedAddress(e.target.value)}>
                <option value="" disabled>
                    Choose an Address
                </option>
                {addresses.length > 0 ? (
                    addresses.map((address, index) => (
                        <option key={index} value={address}>
                            {address}
                        </option>
                    ))
                ) : (
                    <option disabled>No addresses found</option>
                )}
            </select>

            {/* Add Address Button */}
            <button onClick={() => setShowModal(true)}>+ Add Address</button>

            {/* Location Selection */}
            <div>
                <label>From Location:</label>
                <button onClick={() => openMapModal("from")}>
                    {fromLocation ? `Lat: ${fromLocation.latitude}, Lng: ${fromLocation.longitude}` : "Select Location"}
                </button>
            </div>

            <div>
                <label>To Location:</label>
                <button onClick={() => openMapModal("to")}>
                    {toLocation ? `Lat: ${toLocation.latitude}, Lng: ${toLocation.longitude}` : "Select Location"}
                </button>
            </div>

            {/* Address Modal */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Add New Address</h3>
                        <input
                            type="text"
                            placeholder="Enter full address"
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                        />
                        <div>
                            <button className="save-address-button" onClick={handleAddAddress}>Save Address</button>
                            <button className="back-button" onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Details */}
            <div className="amb-details-card">
                <img src={selectedAmbulance.imgUrl} alt={selectedAmbulance.name} className="amb-image" />
                <div className="details">
                    <h3>{selectedAmbulance.name}</h3>
                    <p>Base Price: ₹{selectedAmbulance.price}</p>
                    {selectedOptions.includes("Oxygen(O2)") && <p>Oxygen: ₹{selectedAmbulance.oxygen}</p>}
                    {selectedOptions.includes("Ventilator") && selectedAmbulance.ventilator && (
                        <p>Ventilator: ₹{selectedAmbulance.ventilator_price}</p>
                    )}
                    {selectedOptions.includes("Technician") && selectedAmbulance.technician && (
                        <p>Technician: ₹{selectedAmbulance.technician_price}</p>
                    )}
                    {selectedOptions.includes("Compounder") && <p>Compounder: ₹{selectedAmbulance.compounder}</p>}
                    <h4>Total Price: ₹{totalPrice}</h4>
                </div>
            </div>

            <p>Your Balance: ₹{userBalance}</p>
            
            {isPaid ? (
                <p>✅ Payment Successful!</p>
            ) : (
                <button className="pay-button" onClick={handlePayment} disabled={!selectedAddress}>
                    Make Payment
                </button>
            )}
            
            <button className="back-button" onClick={() => navigate(-1)}>Go Back</button>
            
            {error && (
                <p>
                    {error}: <span><a href="/recharge">click here</a></span> to recharge
                </p>
            )}

            {/* Google Maps Modal */}
            {mapModal.open && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Select {mapModal.type === "from" ? "From" : "To"} Location</h3>
                        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                            <GoogleMap
                                mapContainerStyle={{ width: "100%", height: "400px" }}
                                center={{ lat: 20.5937, lng: 78.9629 }}
                                zoom={5}
                                onClick={(e) => handleLocationSelect(e.latLng.lat(), e.latLng.lng())}
                            >
                                <Marker position={{ lat: 20.5937, lng: 78.9629 }} />
                            </GoogleMap>
                        </LoadScript>
                        <button onClick={() => setMapModal({ open: false, type: null })}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PaymentPage;
