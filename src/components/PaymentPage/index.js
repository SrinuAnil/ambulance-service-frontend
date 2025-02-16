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
    background: rgb(0, 0, 0);
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background: rgb(0, 13, 26);
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
    const { selectedAmbulance, selectedOptions, totalPrice, customer } = location.state || {};
    const [userBalance, setUserBalance] = useState(customer?.topup || 0);
    const [showModal, setShowModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(customer?.address);
    const [selectedHospital, setSelectedHospital] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState("");
    const [contactNumber, setContactNumber] = useState()
    const [addresses, setAddresses] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [newAddress, setNewAddress] = useState("");
    const [newArea, setNewArea] = useState("");
    const [newPincode, setNewPincode] = useState("");
    const [timer, setTimer] = useState(60);

    useEffect(() => {
        const getUserData = async () => {
            try {
                const response = await fetch(`${backend_api}/api/get-customer?userId=${customer._id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
    
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
    
                const data = await response.json(); // ✅ Properly await response.json()
                console.log("Fetched data:", data);
    
                // Check if `data.address` is valid JSON
                const parsedAddress = data.address ? data.address : [];
                console.log("Parsed Address:", parsedAddress);
    
                setAddresses(parsedAddress);
            } catch (error) {
                console.error("Error fetching or parsing address:", error);
                setAddresses([]);
            }
        };

        const getAmbulanceData = async() => {
            try {
                const response = await fetch(`${backend_api}/api/get-ambulaces`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
    
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
    
                const data = await response.json(); // ✅ Properly await response.json()
                console.log("Fetched data:", data);
    
                // Check if `data.address` is valid JSON
                const parsedHospital = data ? data : [];
                console.log("Parsed Address:", parsedHospital);
    
                setHospitals(parsedHospital);
            } catch (error) {
                console.error("Error fetching or parsing address:", error);
                setHospitals([]);
            }
        }
    
        getUserData();
        getAmbulanceData()
    }, [customer._id]); // Added dependency on customer._id
    
    useEffect(() => {
    if (isPaid) {
        const interval = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer <= 1) {
                    clearInterval(interval); // Stop when reaching 0
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);

        return () => clearInterval(interval); // Cleanup interval on unmount
    }
}, [isPaid]);

    const handleAddAddress = async () => {
        if (newAddress && newArea && newPincode) {
            const fullAddress = { address: newAddress, area: newArea, pincode: newPincode };
    
            try {
                const response = await fetch(`${backend_api}/update-address`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: customer._id, 
                        address: fullAddress, // Send object instead of string
                    }),
                });
    
                const data = await response.json();
    
                if (response.ok) {
                    setAddresses((prev) => [...prev, fullAddress]); // Update local state
                    setSelectedAddress(fullAddress);
                    setNewAddress("");
                    setNewArea("");
                    setNewPincode("");
                    setShowModal(false);
    
                    toast.success("Address added successfully!");
                } else {
                    throw new Error(data.message || "Failed to add address.");
                }
            } catch (error) {
                toast.error(error.message);
            }
        } else {
            toast.error("Please fill all address fields");
        }
    };

    const handlePayment = async () => {
        if (!selectedPayment || !selectedAddress || !selectedHospital) {
            toast.error("Please select a payment method, address and hospital");
            return;
        }

        if (selectedPayment === "Online Payment" && userBalance < totalPrice) {
            toast.error("Insufficient balance. Please recharge your wallet.");
            return;
        }

        try {
            console.log(selectedAddress)
            const response = await fetch(`${backend_api}/api/bookings`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: customer._id,
                    username: customer.name,
                    totalPrice,
                    address: JSON.stringify(selectedAddress),
                    ambulanceDetails: JSON.stringify(selectedAmbulance),
                    selectedOptions: JSON.stringify(selectedOptions),
                    selectedHospital: JSON.stringify(selectedHospital),
                    contactNumber: contactNumber,
                    payMethod: selectedPayment,
                    timestamp: new Date().toISOString(),
                }),
            });
            
            if (response.ok) {
                if (selectedPayment === "Online Payment") {
                    localStorage.setItem("customer", JSON.stringify({ ...customer, topup: userBalance - totalPrice }));
                    setUserBalance(userBalance - totalPrice);
                }
                setIsPaid(true);
                toast.success("Payment successful!");
            } else {
                toast.error("Payment failed. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };

    const getTimer = () => {
        setInterval(() => {
            setTimer(timer - 1)
            return timer
        }, 1000)
    }

    return (
        <>
            <SidebarContainer />
            <PaymentContainer>
                <h2>🚑 Ambulance Payment</h2>
                <WalletContainer>
                    <p>Your Balance: ₹ {userBalance}</p>
                    <RechargeButton onClick={() => navigate('/recharge')}>Recharge</RechargeButton>
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
                    {addresses.length > 0 
                        ? addresses.map((address, index) => (
                            <option key={index} value={JSON.stringify(address)}>
                                {`${address.address}, ${address.area}, ${address.pincode}`}
                            </option>
                        ))
                        : <option disabled>No addresses found</option>
                    }
                </Select>
                <input style={{"padding": "10px", "fontSize":"18px", "marginBottom":"10px", "width": "100%", "borderRadius":"8px"}} type="number" placeholder="Enter Contact Number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
                <Select value={selectedHospital} onChange={(e) => setSelectedHospital(e.target.value)}>
                    <option value="" disabled>Choose Hospital</option>
                    {hospitals.length > 0 
                        ? hospitals.map((hospital, index) => (
                            <option key={index} value={JSON.stringify(hospital)}>
                                {`${hospital.name}`}
                            </option>
                        ))
                        : <option disabled>No hospital found</option>
                    }
                </Select>
                <Select value={selectedPayment} onChange={(e) => setSelectedPayment(e.target.value)}>
                    <option value="" disabled>Payment Type</option>
                    <option value="Online Payment">Online Payment</option>
                    <option value="Cash">Cash Payment</option>
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
                {isPaid ? <p>✅ You get a call in <span>{timer}</span> seconds for confirmation</p> : <Button onClick={handlePayment}>Make Payment</Button>}
                <Button onClick={() => navigate(-1)}>Go Back</Button>
            </PaymentContainer>
            <ToastContainer />
        </>
    );
}

export default PaymentPage;
