import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom"; // ✅ Use useHistory for navigation
import "./styles.css";

const Amb_data = [
    { id: 1, imgUrl: "https://www.cityambulanceservice.in/wp-content/uploads/2019/11/cropped-0000000.jpg", name: "Omni Ambulance", price: 1000, oxygen: 200, ventilator: false, compounder: 300 },
    { id: 2, imgUrl: "https://www.cityambulanceservice.in/wp-content/uploads/2019/11/cropped-0000000.jpg", name: "EECO Ambulance", price: 1200, oxygen: 200, ventilator: false, compounder: 300, technician: true, technician_price: 600 },
    { id: 3, imgUrl: "https://www.cityambulanceservice.in/wp-content/uploads/2019/11/cropped-0000000.jpg", name: "Winger Ambulance", price: 1500, oxygen: 400, ventilator: true, ventilator_price: 1000, technician: true, technician_price: 600, compounder: 300 },
    { id: 4, imgUrl: "https://www.cityambulanceservice.in/wp-content/uploads/2019/11/cropped-0000000.jpg", name: "Tempo Ambulance", price: 1500, oxygen: 400, ventilator: true, ventilator_price: 1000, technician: true, technician_price: 600, compounder: 300 },
];

function BookAmb() {
    const history = useHistory(); // ✅ Initialize useHistory
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [filteredAmbulances, setFilteredAmbulances] = useState(Amb_data);
    const [customer, setCustomer] = useState(null);

    useEffect(() => {
        const storedCustomer = localStorage.getItem("customer");
        console.log(storedCustomer)
        if (storedCustomer) {
            setCustomer(JSON.parse(storedCustomer));
        }
    }, []);

    const options = ["Oxygen(O2)", "Ventilator", "Technician", "Compounder"];

    const onCheckboxChange = (option) => {
        setSelectedOptions((prev) =>
            prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
        );
    };

    useEffect(() => {
        let filteredData = Amb_data;

        if (selectedOptions.includes("Ventilator")) {
            filteredData = filteredData.filter((data) => data.ventilator);
        }
        if (selectedOptions.includes("Technician")) {
            filteredData = filteredData.filter((data) => data.technician);
        }
        setFilteredAmbulances(filteredData);
    }, [selectedOptions]);

    const calculatePrice = (data) => {
        let updatedPrice = data.price;
        if (selectedOptions.includes("Oxygen(O2)")) updatedPrice += data.oxygen;
        if (selectedOptions.includes("Ventilator") && data.ventilator) updatedPrice += data.ventilator_price || 0;
        if (selectedOptions.includes("Technician") && data.technician) updatedPrice += data.technician_price || 0;
        if (selectedOptions.includes("Compounder")) updatedPrice += data.compounder;
        return updatedPrice;
    };

    const handleBookNow = (data) => {
        const totalPrice = calculatePrice(data);

        // ✅ Navigate to Payment Page with State Data
        history.push({
            pathname: "/payment",
            state: { selectedAmbulance: data, selectedOptions, totalPrice, balance: customer.topup },
        });
    };

    return (
        <div className="amb-booking-container">
            <div className="amb-card-container">
                <h2>🚑 Book an Ambulance</h2>
                {customer ? (
                    <div className="customer-details">
                        <p><strong>Hello, </strong> {customer.name}</p>
                        {/* <p><strong>Email:</strong> {customer.email}</p> */}
                        <p><strong>Card Balance:</strong> ${customer.topup}</p>
                    </div>
                ) : (
                    <p>Please log in to book an ambulance.</p>
                )}
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
