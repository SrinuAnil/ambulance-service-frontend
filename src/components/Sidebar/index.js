import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Cookies from "js-cookie";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const SidebarContainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleLogotBotton = () => {
    const jwtToken = Cookies.remove("customerjwtToken");
    navigate("/");
  }

  return (
    <>
      <Navbar>
        <button className="menu-button" onClick={() => setIsOpen(true)}>
          <FaBars size={28} />
        </button>
      </Navbar>

      <Sidebar ref={sidebarRef} className={isOpen ? "open" : ""}>
        <button className="close-button" onClick={() => setIsOpen(false)}>
          <FaTimes size={24} />
        </button>
        <h2>Menu</h2>
        <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/account">Account</Link>
          </li>
          <li>
            <Link to="/recharge">Recharge</Link>
          </li>
          <li>
            <Link to="/transactions">Transactions</Link>
          </li>
          <li>
            <Link to="/booking">Bookings</Link>
          </li>
          <li>
            <LogoutButton onClick={handleLogotBotton}>Logout</LogoutButton>
          </li>
        </ul>
      </Sidebar>

      {/* Overlay to close sidebar when clicking outside */}
      {isOpen && <Overlay onClick={() => setIsOpen(false)} />}
    </>
  );
};

// Styled Components
const Navbar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #007bff;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: start;
  z-index: 1000;

  .menu-button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    margin-left: 15px;
  }
`;

const Sidebar = styled.div`
  position: fixed;
  top: 0;
  left: -260px;
  width: 260px;
  height: 100%;
  background: #222;
  color: white;
  padding: 20px;
  transition: left 0.3s ease-in-out;
  z-index: 1100;

  &.open {
    left: 0;
  }

  .close-button {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 15px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin-top: 40px;
    display: flex;
    flex-direction: column;
  }

  li {
    padding: 15px;
    font-size: 18px;
  }

  a {
    color: white;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

const LogoutButton = styled.button`
  width: 100%;
  background-color:rgb(248, 247, 247);
  color: #000000;
  font-size: 18px;
  padding: 10px;
  border: none;
  flex-grow: 1;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

export default SidebarContainer;
