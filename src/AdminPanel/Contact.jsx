import React, { useState, useEffect } from "react";
import { pdfjs } from "react-pdf";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Upload,
  Switch,
} from "antd";
import { baseurl } from "../helper/Helper.jsx";
import axios from "axios";
import Password from "antd/es/input/Password";
// import { baseurl } from "../helper/Helper";
import { useAuth } from "../context/auth";
import "../Style/AdminPanel.css";



const Contact = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [auth, setAuth] = useAuth();
  const [pdfFile, setPdfFile] = useState(null);

  console.log(auth.user._id);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(baseurl + "/api/contacts/getAllContacts");

      console.log(res.data.contacts);
      setData(res.data.contacts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

 
 
 


  const handleStatusToggle = async(record)=>{
      try {
         const response = await axios.patch(`${baseurl}/api/admin/toggled/${record._id}`)
         console.log(response)

         if(response){
          message.success("Status updated succesfully")
          fetchData()
         }
      } catch (error) {
        console.log(error)
      }
  }

  

  
  

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "name",
    },

    {
        title: "Last Name",
        dataIndex: "lastName",
        key: "lastName",
      },
     
      {
        title: "Phone Number",
        dataIndex: "phoneNumber",
        key: "phoneNumber",
      },

    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },


    {
        title: "Question",
        dataIndex: "question",
        key: "question",
      },
  

    // {
    //   title: "Status",
    //   key: "Status",
    //   render: (_, record) => (
    //     <Switch
    //       checked={record.Status === "Active"}
    //       onChange={() => handleStatusToggle(record)}
    //       checkedChildren="Active"
    //       unCheckedChildren="Inactive"
    //     />
    //   ),
    // },

    
  ];

  return (
    <div>
      
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        // rowKey="_id"
      />


       
    </div>
  );
};

export default Contact;