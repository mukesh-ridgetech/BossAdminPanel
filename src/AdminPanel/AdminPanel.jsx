import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Menu, Avatar, Button, Dropdown } from "antd";
import "../Style/AdminPanel.css";
import {
  UserOutlined,
  DashboardOutlined,
  TeamOutlined,
  CarOutlined,
  EnvironmentOutlined,
  CarryOutOutlined,
  FormOutlined,
  ExportOutlined ,
  WarningOutlined,
  InsertRowAboveOutlined ,
  CalendarOutlined
} from "@ant-design/icons";
import Home from "./Home";
import Contact from "./Contact";
import PersonalDetails from "./PersonalDetails";
// import Personal from "./Personal";
// import ImageUploader from "./ImageUploader";
const { Header, Sider, Content } = Layout;
import JobPost from "./JobPost";
import ApplicationSend from "./ApplicationSend";
import VacanyUpload from "./VacanyUpload";
import Users from "./Users";
// import CreateAmenity from "./CreateAmenity";


import logo from '../../public/images/dewanLogo.png'

const AdminPanel = () => {
  const [selectedTab, setSelectedTab] = useState("applicationSend");
 const navigate= useNavigate();

  const handleMenuClick = (e) => {
    setSelectedTab(e.key);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const renderContent = () => {
    switch (selectedTab) {
        case "user":
        return <Users />;
        case "jobPost":
        return <JobPost />;
        case "applicationSend":
        return <ApplicationSend />;
        case "contact":
        return <Contact />;
        case "personal-details":
        return <PersonalDetails />;
        case "vacancy":
        return <VacanyUpload />;
      
        
    }
  };

  const menuItems = [
    // { key: "home", icon: <TeamOutlined />, label: "Home" },
    
    {
      key: "user",
      icon: <TeamOutlined />,
      label: "Users",
    },

    {
        key: "jobPost",
        // icon: <FormOutlined />,
        icon: <ExportOutlined />,
        label: "Job Posts",
      },

      {
        key: "contact",
        icon: <CalendarOutlined />,
        label: "Query Recieved",
      },

      // {
      //   key: "personal-details",
      //  icon: <FormOutlined />,
      //   label: "Personal Details",
      // },

      {
        key: "vacancy",
        icon: <InsertRowAboveOutlined />,
        label: "Vacancies Recieved",
      },
  ];

  return (
    <Layout style={{ minHeight: "100vh", maxWidth: "100vw" }}>
      <Header className="header">
      <div className="logo-vinMart">
          {/* <img src={logo} alt="dewanRealty Logo" /> */}
          <h1>Boss</h1>

        </div>


        <Button type="primary" onClick={handleLogout}  style={{ marginLeft: '20px' }}>
          Logout
        </Button>
      </Header>

      <Layout style={{minWidth:"250px"}}>
        <Sider className="sider" style={{minWidth:"250px"}}>
          <Menu
            mode="inline"
            defaultSelectedKeys={["applicationSend"]}
            style={{ height: "100%", borderRight: 0 }}
            onClick={handleMenuClick}
          >
            <Menu.Item key="applicationSend" icon={<DashboardOutlined />}>
            Job Applicants
            </Menu.Item>

            {menuItems?.map((menuItem) => (
              <Menu.Item key={menuItem?.key} icon={menuItem?.icon}>
                {menuItem?.label}
              </Menu.Item>
            ))}
          </Menu>
        </Sider>

        <Layout style={{ padding: "24px" }}>
          <Content className="content">{renderContent()}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminPanel;
