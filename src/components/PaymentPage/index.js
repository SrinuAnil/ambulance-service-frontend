import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles.css";
import { backend_api } from "../../constant";

function PaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isPaid, setIsPaid] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState("");
    const [error, setError] = useState("");

    const { selectedAmbulance, selectedOptions, totalPrice, balance } = location.state || {};
    const [userBalance, setUserBalance] = useState(balance);

    if (!selectedAmbulance) {
        return <p>No ambulance selected. Please go back and choose one.</p>;
    }

    const handlePayment = async () => {
        console.log(selectedAmbulance, selectedOptions, totalPrice);

        const bookingData = {
            userId: "1",
            ambulanceId: selectedAmbulance.id,
            ambulanceName: selectedAmbulance.name,
            totalPrice,
            location: "165.516",
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

    return (
        <div className="payment-container">
            <h2>💳 Payment</h2>
            <div className="amb-details-card">
                <img src={selectedAmbulance.imgUrl} alt={selectedAmbulance.name} className="amb-image" />
                <div className="details">
                    <h3>{selectedAmbulance.name}</h3>
                    <p>Base Price: ₹{selectedAmbulance.price}</p>
                    {selectedOptions.includes("Oxygen(O2)") && <p>Oxygen: ₹{selectedAmbulance.oxygen}</p>}
                    {selectedOptions.includes("Ventilator") && selectedAmbulance.ventilator && <p>Ventilator: ₹{selectedAmbulance.ventilator_price}</p>}
                    {selectedOptions.includes("Technician") && selectedAmbulance.technician && <p>Technician: ₹{selectedAmbulance.technician_price}</p>}
                    {selectedOptions.includes("Compounder") && <p>Compounder: ₹{selectedAmbulance.compounder}</p>}
                    <h4>Total Price: ₹{totalPrice}</h4>
                </div>
            </div>

            <p>Your Balance: ₹{userBalance}</p>

            {paymentStatus && <p className="payment-status">{paymentStatus}</p>}

            {isPaid ? <p>✅ Payment Successful!</p> : <button className="pay-button" onClick={handlePayment}>Make Payment</button>}
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
