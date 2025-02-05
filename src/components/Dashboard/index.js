import { useState, useEffect } from "react";
import Modal from "react-modal";
import "./styles.css";
import { backend_api } from "../../constant";

function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetch(backend_api+"/api/bookings")
            .then((res) => res.json())
            .then((data) => setBookings(data))
            .catch((error) => console.error("Error fetching bookings:", error));
    })

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="logo">S</div>
        <div className="nav-links">
          {["D", "S", "C", "M", "C", "S"].map((item, index) => (
            <button key={index} className="nav-item">
              {item}
            </button>
          ))}
        </div>
        <div className="logout">L</div>
      </nav>

      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <p className="welcome-text">Welcome Back!</p>
        </header>

        <section className="quick-stats">
          <h3>Quick Stats</h3>
          <div className="stats-grid">
            {[
              { label: "Total Bookings", value: "28,345" },
              { label: "Pending Approval", value: "120", color: "red" },
              { label: "New Clients", value: "89" },
              { label: "Returning Clients", value: "46%" },
            ].map((stat, index) => (
              <div key={index} className="stat-card">
                <p className="stat-title">{stat.label}</p>
                <p className="stat-value" style={{ color: stat.color || "#000" }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="tabs">
          {["Bookings", "Enquiries", "My Services"].map((tab, index) => (
            <button key={index} className={`tab-item ${index === 0 ? "active-tab" : ""}`}>
              {tab}
            </button>
          ))}
        </div>

        <section className="bookings">
          {bookings.length === 0 ? (
            <p>No bookings yet</p>
          ) : (
            <div className="cards-grid">
              {bookings.map((booking, index) => (
                <div key={index} className="booking-card">
                  <h4>Amanda Chavez</h4>
                  <p>🚑 {booking.ambulanceName}</p>
                  <div className="time-details">
                    <p>📅 {new Date(booking.timestamp).toLocaleDateString()}</p>
                    <p>⏰ {new Date(booking.timestamp).toLocaleTimeString()}</p>
                  </div>
                  <button className="accept-button">Accept Booking</button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <button className="profile-button" onClick={openModal}>
        Open Profile
      </button>

      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Profile Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <button className="close-modal" onClick={closeModal}>
          &times;
        </button>
        <div className="profile-content">
          <div className="profile-header">
            <p className="profile-initial">S</p>
            <input type="search" placeholder="Search..." />
          </div>
          <div className="profile-bio">
            <h3>Hello, Jonathan!</h3>
            <p>Copy your bio link and paste it in your profile to let people find you.</p>
            <a href="/">www.profile.com</a>
            <button>Edit Link</button>
          </div>
          <div className="reminders">
            <h4>Reminders</h4>
            <ul>
              {[
                { text: "Booking Reminder", desc: "From auto nagar to hospital" },
                { text: "New Message", desc: "From auto nagar to hospital confirmed" },
                { text: "Upcoming Booking", desc: "From mangalam to hospital" },
              ].map((reminder, index) => (
                <li key={index}>
                  <span className="reminder-icon">🔔</span>
                  <div>
                    <p>{reminder.text}</p>
                    <p>{reminder.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Dashboard