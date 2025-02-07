import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles.css";
import { backend_api } from "../../constant";

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

    if (!selectedAmbulance) {
        return <p>No ambulance selected. Please go back and choose one.</p>;
    }

    const handlePayment = async () => {
        if (!selectedAddress) {
            setError("Please select an address");
            return;
        }

        const bookingData = {
            userId: customer._id,
            ambulanceId: selectedAmbulance.id,
            ambulanceName: selectedAmbulance.name,
            totalPrice,
            location: selectedAddress,
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
        </div>
    );
}

export default PaymentPage;
