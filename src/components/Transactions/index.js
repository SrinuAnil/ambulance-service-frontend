import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 80%;
  margin: 40px auto;
  text-align: center;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
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

  tr.credit {
    background: #d4edda;
  }

  tr.debit {
    background: #f8d7da;
  }

  .status {
    font-weight: bold;
  }
`;

const TransactionPage = () => {
  const transactions = [
    { id: 1, type: "Recharge", amount: 500, date: "2024-02-05", status: "Credit" },
    { id: 2, type: "Booking", amount: 1200, date: "2024-02-06", status: "Debit" },
    { id: 3, type: "Recharge", amount: 800, date: "2024-02-07", status: "Credit" },
    { id: 4, type: "Booking", amount: 950, date: "2024-02-08", status: "Debit" },
    { id: 5, type: "Recharge", amount: 300, date: "2024-02-09", status: "Credit" },
  ];

  return (
    <Container>
      <h2>Transaction History</h2>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn.id} className={txn.status === "Credit" ? "credit" : "debit"}>
              <td>{txn.id}</td>
              <td>{txn.type}</td>
              <td>${txn.amount.toFixed(2)}</td>
              <td>{txn.date}</td>
              <td className="status">{txn.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default TransactionPage;
