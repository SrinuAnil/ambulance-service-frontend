import React from "react";
import styled from "styled-components";
import SidebarContainer from "../Sidebar";

const TransactionPage = () => {
  const transactions = [
    { id: 1, type: "Credit", amount: 2000, date: "2024-02-05", description: "Recharge" },
    { id: 2, type: "Debit", amount: 1500, date: "2024-02-06", description: "Booking" },
  ];

  return (
    <>
      <SidebarContainer />
      <Container>
        <h2>Transaction History</h2>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td className={transaction.type === "Credit" ? "credit" : "debit"}>
                  {transaction.type}
                </td>
                <td>${transaction.amount.toFixed(2)}</td>
                <td>{transaction.date}</td>
                <td>{transaction.description}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

const Container = styled.div`
  margin: 80px auto;
  width: 90%;
  max-width: 800px;
  text-align: center;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th, td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: center;
  }

  th {
    background: #007bff;
    color: white;
  }

  .credit {
    color: green;
    font-weight: bold;
  }

  .debit {
    color: red;
    font-weight: bold;
  }
`;

export default TransactionPage;
