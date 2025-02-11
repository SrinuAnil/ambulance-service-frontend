import React, {useState} from "react";
import styled from "styled-components";
import { FaBars, FaTimes } from "react-icons/fa";
// import "./styles.css";
import { slide as Menu } from "react-burger-menu";
import SidebarContainer from "../Sidebar";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f4;
`;

const Card = styled.div`
  width: 350px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
`;

const CustomerInfo = styled.div`
  h2 {
    margin-bottom: 10px;
    font-size: 1.5rem;
  }
  
  p {
    margin: 5px 0;
    font-size: 1rem;
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


const AccountPage = () => {

  const [isOpen, setIsOpen] = useState(false);


  const [customer] = useState(() => {
          const storedCustomer = localStorage.getItem("customer");
          // console.log(storedCustomer, JSON.parse(storedCustomer).phoneNumber)
          return storedCustomer ? JSON.parse(storedCustomer) : null;
      });

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
      
      <Card>
        <ProfileImage src="https://img.freepik.com/premium-photo/memoji-happy-man-white-background-emoji_826801-6830.jpg?w=740" alt="Profile" />
        <CustomerInfo>
            {console.log(customer)}
          <h2>{customer.name}</h2>
          <p><strong>Account No:</strong> {customer.accountNumber}</p>
          <p><strong>Balance:</strong> $ {customer.topup}</p>
          <p><strong>Created On:</strong> {customer.createdAt}</p>
        </CustomerInfo>
      </Card>
    </Container>
    </>
  );
};

export default AccountPage;
