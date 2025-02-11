import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import {slide as Menu } from "react-burger-menu";
import styled from "styled-components";
import SidebarContainer from "../Sidebar";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
  height: 100vh;
  background-color: #f4f4f4;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  
  th, td {
    border: 1px solid #ddd;
    padding: 10px;
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
`;

const ToggleButton = styled.button`
    position: fixed;
    left: 20px;
    top: 20px;
    background: transparent;
    border: none;
    cursor: pointer;
    /* color: white; */
    z-index: 1000;
`

const BookingPage = () => {
  const [isOpen, setIsOpen] = useState(false)

  const bookings = [
    {
      id: 1,
      ambulanceName: "City Emergency",
      amount: 1500,
      date: "2024-02-05",
      fromLocation: "Downtown Hospital",
      toLocation: "Green Valley Clinic",
    },
    {
      id: 2,
      ambulanceName: "Rapid Response",
      amount: 1800,
      date: "2024-02-06",
      fromLocation: "Sunrise Apartments",
      toLocation: "Central Health Center",
    },
    {
      id: 3,
      ambulanceName: "LifeCare Express",
      amount: 2000,
      date: "2024-02-07",
      fromLocation: "Old Town",
      toLocation: "Metro City Hospital",
    },
    {
      id: 4,
      ambulanceName: "Quick Med",
      amount: 1700,
      date: "2024-02-08",
      fromLocation: "North Park",
      toLocation: "St. Mary's Hospital",
    },
    {
      id: 5,
      ambulanceName: "Emergency Aid",
      amount: 1900,
      date: "2024-02-09",
      fromLocation: "Lake View Residency",
      toLocation: "City General Hospital",
    },
  ];

  return (
    <>
    <div className="">
        <ToggleButton onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
        </ToggleButton>

        {/* Sidebar Menu */}
        <Menu isOpen={isOpen} onStateChange={({ isOpen }) => setIsOpen(isOpen)}>
            <SidebarContainer />
        </Menu>
        </div>
    <Container>
      <h2>Booking History</h2>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ambulance Name</th>
            <th>Amount</th>
            <th>Date</th>
            <th>From Location</th>
            <th>To Location</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.id}</td>
              <td>{booking.ambulanceName}</td>
              <td>${booking.amount.toFixed(2)}</td>
              <td>{booking.date}</td>
              <td>{booking.fromLocation}</td>
              <td>{booking.toLocation}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
    </>
  );
};

export default BookingPage;
