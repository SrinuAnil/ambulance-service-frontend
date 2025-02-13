import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import { backend_api } from "../../constant";
import SidebarContainer from "../Sidebar";

const PaymentContainer = styled.div`
    max-width: 500px;
    margin: auto;
    margin-top: 70px;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
`;


const WalletContainer = styled.div`
    background: rgb(77, 47, 47);
    color: #ffffff;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 10px;
    margin-bottom: 10px;
`;

const RechargeButton = styled.button`
    background:rgb(0, 0, 0);
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background:rgb(0, 13, 26);
    }

    &:disabled {
        background: gray;
        cursor: not-allowed;
    }
`;

const Button = styled.button`
    background: #007bff;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
    margin-right: 10px;
    &:hover {
        background: #0056b3;
    }

    &:disabled {
        background: gray;
        cursor: not-allowed;
    }
`;

const Select = styled.select`
    width: 100%;
    padding: 8px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const Modal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const ModalContent = styled.div`
    background: white;
    padding: 20px;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    width: 80%;
    max-width: 400px;
    text-align: center;
`;

function PaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isPaid, setIsPaid] = useState(false);
    const [error, setError] = useState("");
    const { selectedAmbulance, selectedOptions, totalPrice, customer } = location.state || {};
    const [userBalance, setUserBalance] = useState(customer?.topup || 0);
    const [showModal, setShowModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(customer?.address || '');
    const [selectedPayment, setSelectedPayment] = useState("");
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState("");
    const [newArea, setNewArea] = useState("");
    const [newPincode, setNewPincode] = useState("");

    // useEffect( async () => {
    //     const response = await fetch(`${backend_api}/get/bookings`, {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({
    //             userId: customer._id,
    //             username: customer.name,
    //             totalPrice,
    //             address: selectedAddress,
    //             ambulanceDetails: selectedAmbulance,
    //             selectedOptions,
    //             payMethod: "Online",
    //             timestamp: new Date().toISOString(),
    //         }),
    //     })
    // });

    const handlePayment = async () => {
        
        if (selectedPayment === "Online Payment"){
            if( userBalance < totalPrice) {
                setError("Please Recharge your wallet")
                return;
            }else {
                try {
                    const response = await fetch(`${backend_api}/api/bookings`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            userId: customer._id,
                            username: customer.name,
                            totalPrice,
                            address: selectedAddress,
                            ambulanceDetails: selectedAmbulance,
                            selectedOptions,
                            payMethod: "Online",
                            timestamp: new Date().toISOString(),
                        }),
                    });
                    if (response.ok) {
                        localStorage.setItem("customer", JSON.stringify({...customer, topup: userBalance - totalPrice}));
                        setIsPaid(true);
                        setUserBalance(userBalance - totalPrice);
                    } else {
                        setError("Payment failed");
                    }
                } catch (error) {
                    console.error("Error:", error);
                    setError("Something went wrong");
                }
            }
        }else if(selectedPayment === "Cash Payment"){
            try {
                const response = await fetch(`${backend_api}/api/bookings`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: customer._id,
                        username: customer.name,
                        totalPrice,
                        address: selectedAddress,
                        ambulanceDetails: selectedAmbulance,
                        selectedOptions,
                        payMethod: "Cash",
                        timestamp: new Date().toISOString(),
                    }),
                });
                if (response.ok) {
                    setIsPaid(true);
                    setUserBalance(userBalance - totalPrice);
                } else {
                    setError("Payment failed");
                }
            } catch (error) {
                console.error("Error:", error);
                setError("Something went wrong");
            }
        }
    };

    const handleAddAddress = async () => {
        if (newAddress && newArea && newPincode) {
            const fullAddress = `${newAddress}, ${newArea}, ${newPincode}`;
            
            // Send request to backend to update user's address
            try {
                const response = await fetch(`${backend_api}/update-address`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: customer._id, // Assuming customer object has user ID
                        address: fullAddress,
                    }),
                });
    
                const data = await response.json();
    
                if (response.ok) {
                    // Update local state with new address
                    setAddresses([...addresses, fullAddress]);
                    setSelectedAddress(fullAddress);
                    setNewAddress("");
                    setNewArea("");
                    setNewPincode("");
                    setShowModal(false);
    
                    // Show success notification
                    toast.success("Address added successfully!", {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "light",
                    });
                } else {
                    throw new Error(data.message || "Failed to add address.");
                }
            } catch (error) {
                // Show error notification
                toast.error(error.message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                });
            }
        } else {
            toast.error("Please fill all address fields", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });
        }
    };
    

    return (
        <>
        <SidebarContainer />
        <PaymentContainer>
            <h2>🚑 Ambulance Payment</h2>
            <WalletContainer>
            <p>Your Balance: ₹ {userBalance}</p>
            <RechargeButton onClick={() => navigate('/recharge')}>
            Recharge
            </RechargeButton>
            </WalletContainer>
            {selectedAmbulance && (
                <div>
                    <h3>Ambulance Details</h3>
                    <p>🚑 Type: {selectedAmbulance.name}</p>
                    <p>💰 Price: ₹ {totalPrice}</p>
                </div>
            )}

            <Select value={selectedAddress} onChange={(e) => setSelectedAddress(e.target.value)}>
                <option value="" disabled>Choose an Address</option>
                {addresses.length > 0 ? addresses.map((address, index) => (
                    <option key={index} value={address}>{address}</option>
                )) : <option disabled>No addresses found</option>}
            </Select>

            <Select value={selectedPayment} onChange={(e) => setSelectedPayment(e.target.value)}>
                <option value="" disabled>Payment Type</option>
                <option value="Online Payment">Online Payment</option>
                <option value="Cash Payment">Cash Payment</option>
            </Select>

            {showModal && (
                <Modal>
                    <ModalContent>
                        <h3>Add New Address</h3>
                        <input style={{"padding": "10px", "fontSize":"18px", "marginBottom":"10px"}} type="text" placeholder="Enter full address" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} />
                        <input style={{"padding": "10px", "fontSize":"18px", "marginBottom":"10px"}} type="text" placeholder="Area Name" value={newArea} onChange={(e) => setNewArea(e.target.value)} />
                        <input style={{"padding": "10px", "fontSize":"18px", "marginBottom":"10px"}} type="number" placeholder="Enter Pincode" value={newPincode} onChange={(e) => setNewPincode(e.target.value)} />
                        <Button onClick={handleAddAddress}>Save Address</Button>
                        <Button onClick={() => setShowModal(false)}>Cancel</Button>
                    </ModalContent>
                </Modal>
            )}

            {!isPaid  && <Button onClick={() => setShowModal(true)}>+ Add Address</Button>}
            {isPaid ? <p>✅ Payment Successful!</p> : <Button onClick={handlePayment} disabled={!selectedAddress || !selectedPayment}>Make Payment</Button>}
            <Button onClick={() => navigate(-1)}>Go Back</Button>
            {error && <p>{error}</p>}
        </PaymentContainer>
        </>
    );
}

export default PaymentPage;
