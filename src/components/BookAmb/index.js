import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from 'react-sidebar';
import "./styles.css";
import SidebarContainer from "../Sidebar";

const Amb_data = [
    { id: 1, imgUrl: "https://www.cityambulanceservice.in/wp-content/uploads/2019/11/cropped-0000000.jpg", name: "Omni Ambulance", price: 1000, oxygen: 200, ventilator: false, compounder: 300 },
    { id: 2, imgUrl: "https://www.cityambulanceservice.in/wp-content/uploads/2019/11/cropped-0000000.jpg", name: "EECO Ambulance", price: 1200, oxygen: 200, ventilator: false, compounder: 300, technician: true, technician_price: 600 },
    { id: 3, imgUrl: "https://www.cityambulanceservice.in/wp-content/uploads/2019/11/cropped-0000000.jpg", name: "Winger Ambulance", price: 1500, oxygen: 400, ventilator: true, ventilator_price: 1000, technician: true, technician_price: 600, compounder: 300 },
    { id: 4, imgUrl: "https://www.cityambulanceservice.in/wp-content/uploads/2019/11/cropped-0000000.jpg", name: "Tempo Ambulance", price: 1500, oxygen: 400, ventilator: true, ventilator_price: 1000, technician: true, technician_price: 600, compounder: 300 },
];

function BookAmb() {
    const navigate = useNavigate();
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);    const [customer] = useState(() => {
        const storedCustomer = localStorage.getItem("customer");
        // console.log(storedCustomer, JSON.parse(storedCustomer).phoneNumber)
        return storedCustomer ? JSON.parse(storedCustomer) : null;
    });

    const options = ["Oxygen(O2)", "Ventilator", "Technician", "Compounder"];

    const onCheckboxChange = (option) => {
        setSelectedOptions((prev) =>
            prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
        );
    };

    const filteredAmbulances = Amb_data.filter((data) =>
        (!selectedOptions.includes("Ventilator") || data.ventilator) &&
        (!selectedOptions.includes("Technician") || data.technician)
    );

    const calculatePrice = (data) => {
        let updatedPrice = data.price;
        if (selectedOptions.includes("Oxygen(O2)")) updatedPrice += data.oxygen;
        if (selectedOptions.includes("Ventilator") && data.ventilator) updatedPrice += data.ventilator_price || 0;
        if (selectedOptions.includes("Technician") && data.technician) updatedPrice += data.technician_price || 0;
        if (selectedOptions.includes("Compounder")) updatedPrice += data.compounder;
        return updatedPrice;
    };

    const handleBookNow = (data) => {
        if (!customer) {
            alert("Please log in to proceed with the booking.");
            return;
        }

        const totalPrice = calculatePrice(data);
        navigate("/payment", {
            state: { selectedAmbulance: data, selectedOptions, totalPrice, customer},
        });
    };

    return (
        <div className="amb-booking-container">
            <nav>
                    <div className="customer-detail">
                        <div>
                        </div>
                    <div>
                        <Sidebar
                            sidebar={<SidebarContainer />}
                            open={sidebarOpen}
                            onSetOpen={setSidebarOpen}
                            styles={{ sidebar: { background: "white", width: "250px" } }}
                        >
                            <div className="home-navbar">
                        <button className="profile-container" onClick={() => setSidebarOpen(true)}>
                                {customer.name[0].toUpperCase()}    
                        </button>
                        <div>
                            <></>
                        </div>
                            </div>
                        
                        </Sidebar>
                            
                        </div>
                    </div>
            </nav>
            <div className="amb-card-container">
                <h2>🚑 Book an Ambulance</h2>
                
                <p>Select Additional Services:</p>
                <div className="checkbox-container">
                    {options.map((option, index) => (
                        <div key={index} className="option-item">
                            <input
                                type="checkbox"
                                id={`option-${index}`}
                                checked={selectedOptions.includes(option)}
                                onChange={() => onCheckboxChange(option)}
                            />
                            <label htmlFor={`option-${index}`}>{option}</label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="amb-cards-container">
                {filteredAmbulances.map((data) => (
                    <div key={data.id} className="amb-card">
                        <img src={data.imgUrl} alt={data.name} className="amb-pic" />
                        <div className="amb-details">
                            <p className="amb-name">{data.name}</p>
                            <p>Price: <strong>${calculatePrice(data)}</strong></p>
                            <button className="amb-booking-button" onClick={() => handleBookNow(data)}>Book Now</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BookAmb;
