import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './styles.css';
import { backend_api } from "../../constant";

function Recharge() {
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [amount, setAmount] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedCustomer = localStorage.getItem("customer");
        if (storedCustomer) {
            setCustomer(JSON.parse(storedCustomer));
        }
    }, []);

    const handleManualPayment = async () => {
        if (!amount || parseFloat(amount) <= 0 || transactionId.trim() === "") {
            alert("Please enter a valid amount and transaction ID.");
            return;
        }

        if (!customer) {
            alert("Please log in to recharge your balance.");
            return;
        }

        setLoading(true);
        console.log(typeof(amount))

        try {
            const response = await fetch(backend_api+"/api/recharge", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: customer._id, // Assuming customer object has _id from MongoDB
                    amount: parseInt(amount),
                    transactionId,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Recharge Successful! Your Transaction ID: ${transactionId}`);
                
                // Update local customer data
                const updatedCustomer = { ...customer, topup: data.newBalance };
                setCustomer(updatedCustomer);
                localStorage.setItem("customer", JSON.stringify(updatedCustomer));

                navigate("/payment");
            } else {
                alert(data.message || "Recharge failed. Please try again.");
            }
        } catch (error) {
            alert("An error occurred. Please try again later.");
            console.error("Recharge Error:", error);
        }

        setLoading(false);
    };

    return (
        <div className="recharge-container">
            <h2>💳 Recharge Your Balance</h2>
            {customer ? (
                <div className="customer-details">
                    <p><strong>Name:</strong> {customer.name}</p>
                    <p><strong>Current Balance:</strong> ${customer.topup}</p>
                </div>
            ) : (
                <p>Please log in to recharge your balance.</p>
            )}
            
            <div className="upi-section">
                <h3>UPI Payment</h3>
                <p><strong>UPI ID:</strong> yourupi@bank</p>
                <p>Scan this QR to pay:</p>
                <img src="https://i.postimg.cc/CxSWQbWz/Paytm-QRcode-1738747179961.png" alt="UPI QR Code" width="200" />
            </div>

            <div className="recharge-form">
                <input
                    type="number"
                    placeholder="Enter recharge amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={loading}
                />
                <input
                    type="text"
                    placeholder="Enter transaction ID"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    disabled={loading}
                />
                <button onClick={handleManualPayment} disabled={loading}>
                    {loading ? "Processing..." : "Submit Payment"}
                </button>
            </div>
        </div>
    );
}

export default Recharge;
