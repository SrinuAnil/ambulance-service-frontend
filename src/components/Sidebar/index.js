import React, { useState } from "react";
import { Sidebar, Menu, MenuItem, Submenu, Logo } from "react-mui-sidebar";
import styled from "styled-components";

const SidebarContainer = styled.div`
  width: 285px;
  background:rgb(209, 209, 209);
  color: white;
`;

const SidebarContent = () => {
  return (
    <SidebarContainer>
      <Sidebar width={"285px"}>
        <Logo img="https://adminmart.com/wp-content/uploads/2024/03/logo-admin-mart-news.png">
          AdminMart
        </Logo>
        <Menu subHeading="HOME">
          <MenuItem link="/home">Home</MenuItem>
          <MenuItem link="/account">Account</MenuItem>
          <MenuItem link="/transactions">Transactions</MenuItem>
          <MenuItem link="/booking">Bookings</MenuItem>
        </Menu>
        <Menu subHeading="APPS">
          <MenuItem>Contact Us</MenuItem>
          <MenuItem>Help</MenuItem>
        </Menu>
        <Menu subHeading="OTHERS">
          <Submenu title="Menu Level">
            <MenuItem>Post</MenuItem>
            <MenuItem>Details</MenuItem>
            <Submenu title="Level 2">
              <MenuItem>New</MenuItem>
              <MenuItem>Hello</MenuItem>
            </Submenu>
          </Submenu>
          <MenuItem>Chip</MenuItem>
          <MenuItem target="_blank" link="https://google.com">
            External Link
          </MenuItem>
        </Menu>
      </Sidebar>
    </SidebarContainer>
  );
};

export default SidebarContent;