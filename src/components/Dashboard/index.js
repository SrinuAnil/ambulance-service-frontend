import { useState, useEffect } from "react";
import Modal from "react-modal";
import "./styles.css";
import Cookies from "js-cookie";
import { backend_api } from "../../constant";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${backend_api}/api/bookings`)
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((error) => console.error("Error fetching bookings:", error));
  }, []);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const onLogoutClick = () => {
    Cookies.remove("admin_jwt_token");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="logo">
          <button>S</button>
        </div>
        <div className="nav-links">
          {["D", "S", "C", "M", "C", "S"].map((item, index) => (
            <button key={index} className="nav-item">
              {item}
            </button>
          ))}
        </div>
        <div className="logout" onClick={onLogoutClick}>
          L
        </div>
      </nav>

      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <p className="welcome-text">Welcome Back!</p>
        </header>

        <section className="bookings">
          {bookings.length === 0 ? (
            <p>No bookings yet</p>
          ) : (
            <div className="cards-grid">
              {bookings.map((booking, index) => {
                      console.log(bookings)
                const ambulanceDetails = JSON.parse(booking.ambulanceDetails);
                const selectedOptions = JSON.parse(booking.selectedOptions);
                return (
                  <div key={index} className="booking-card">
                    <h4>{booking.username}</h4>
                    <p>🚑 {ambulanceDetails.name}</p>
                    <p>💰 Total Price: ₹{booking.totalPrice}</p>
                    <p>💳 Payment Method: {booking.payMethod}</p>
                    <p>🏥 Selected Options: {selectedOptions.join(", ") || "None"}</p>
                    <div className="time-details">
                      <p>📅 {new Date(booking.timestamp).toLocaleDateString()}</p>
                      <p>⏰ {new Date(booking.timestamp).toLocaleTimeString()}</p>
                    </div>
                    <button className="accept-button">Accept Booking</button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
