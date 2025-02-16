import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SidebarContent from "../Sidebar";
import { backend_api } from "../../constant";

const Container = styled.div`
  width: 90%;
  max-width: 1000px;
  margin: 80px auto;
  text-align: center;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  white-space: nowrap;

  th, td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: center;
  }
  
  th {
    background: #007bff;
    color: white;
  }

  tr:nth-child(even) {
    background: #f2f2f2;
  }

  tr:hover {
    background: #ddd;
  }

  @media (max-width: 768px) {
    th, td {
      padding: 8px;
      font-size: 14px;
    }
  }

  @media (max-width: 480px) {
    th, td {
      padding: 6px;
      font-size: 12px;
    }
  }
`;

const BookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const user = localStorage.getItem("customer");
        if (!user) {
          setError("User not found. Please log in.");
          setLoading(false);
          return;
        }
  
        const userId = JSON.parse(user)._id;
        const response = await fetch(`${backend_api}/user/bookings?userId=${userId}`);
        const data = await response.json();
        console.log("Raw Data:", data);
  
        const formattedData = data.map((booking) => {
          let selectedHospital, ambulance, address;
          
          try {
            selectedHospital = JSON.parse(JSON.parse(booking.selectedHospital)).name || "Unknown Hospital";
          } catch (error) {
            console.error("Error parsing selectedHospital:", error);
            selectedHospital = "Unknown Hospital";
          }
  
          try {
            ambulance = JSON.parse(booking.ambulanceDetails).name || "Unknown Ambulance";
          } catch (error) {
            console.error("Error parsing ambulanceDetails:", error);
            ambulance = "Unknown Ambulance";
          }
  
          try {
            address = JSON.parse(JSON.parse(booking.address)).pincode || "Unknown Pincode";
          } catch (error) {
            console.error("Error parsing address:", error);
            address = "Unknown Pincode";
          }
  
          return {
            id: booking._id,
            username: booking.username,
            selectedHospital,
            ambulance,
            amount: booking.totalPrice,
            date: new Date(booking.timestamp).toLocaleString(),
            address,
            paymentMethod: booking.payMethod,
          };
        });
  
        console.log("Formatted Data:", formattedData);
        setBookings(formattedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching booking data:", err);
        setError("Error fetching booking data.");
        setLoading(false);
      }
    };
  
    fetchBookings();
  }, []);
  
  

  return (
    <>
      <SidebarContent />
      <Container>
        <h2>Booking History</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <TableWrapper>
            <Table>
              <thead>
              <tr>
                  <th>Date</th>
                  <th>Ambulance</th>
                  <th>Amount</th>
                  <th>Location</th>
                  <th>Payment Method</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                  <td>{booking.date}</td>
                  <td>{booking.ambulance}</td>
                  <td>${booking.amount.toFixed(2)}</td>
                  <td>{booking.selectedHospital}</td>
                  <td>{booking.paymentMethod}</td>
                </tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
        )}
      </Container>
    </>
  );
};

export default BookingPage;
