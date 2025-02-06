import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './styles.css'

function Recharge() {
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [amount, setAmount] = useState(0);
    const [transactionId, setTransactionId] = useState("");

    useEffect(() => {
        const storedCustomer = localStorage.getItem("customer");
        if (storedCustomer) {
            setCustomer(JSON.parse(storedCustomer));
        }
    }, []);

    const handleManualPayment = () => {
        if (amount <= 0 || transactionId.trim() === "") {
            alert("Please enter a valid amount and transaction ID.");
            return;
        }

        if (customer) {
            const updatedCustomer = { ...customer, topup: customer.topup + parseFloat(amount) };
            localStorage.setItem("customer", JSON.stringify(updatedCustomer));
            setCustomer(updatedCustomer);
            alert(`Recharge Successful! Your Transaction ID: ${transactionId}`);
            navigate("/home");
        }
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
                />
                <input
                    type="text"
                    placeholder="Enter transaction ID"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                />
                <button onClick={handleManualPayment}>Submit Payment</button>
            </div>
        </div>
    );
}

export default Recharge;
