import React from "react";
import styled from "styled-components";
import SidebarContent from '../Sidebar';

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

  .credit {
    color: green;
    font-weight: bold;
  }

  .debit {
    color: red;
    font-weight: bold;
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
  const bookings = [
    { id: 1, ambulanceName: "City Emergency", amount: 1500, date: "2024-02-05", from: "Downtown Hospital", to: "Green Valley Clinic" },
    { id: 2, ambulanceName: "Rapid Response", amount: 1800, date: "2024-02-06", from: "Sunrise Apartments", to: "Central Health Center" },
    { id: 3, ambulanceName: "LifeCare Express", amount: 2000, date: "2024-02-07", from: "Old Town", to: "Metro City Hospital" },
  ];

  return (
    <>
      <SidebarContent />
      <Container>
        <h2>Booking History</h2>
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Ambulance</th>
                <th>Amount</th>
                <th>Date</th>
                <th>From</th>
                <th>To</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.ambulanceName}</td>
                  <td>${booking.amount.toFixed(2)}</td>
                  <td>{booking.date}</td>
                  <td>{booking.from}</td>
                  <td>{booking.to}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      </Container>
    </>
  );
};

export default BookingPage;
