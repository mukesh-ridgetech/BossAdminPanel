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
import PdfComp from "./PdfComp.jsx";
import "../Style/AdminPanel.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.js",
    import.meta.url
  ).toString();
  

const VacanyUpload = () => {
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
      const res = await axios.get(baseurl + "/api/adminPost/getAllAdminPost");

      console.log(res.data);

      if(res.data){
        const reversedArr = res.data.reverse();
        setData(reversedArr);
        setLoading(false);
      }
      
      
    } catch (error) {
      console.error("Error In Fetching Data:", error);
      setLoading(false);
    }
  };



 
  const viewPdf = (record)=>{

    const pdfdata = baseurl+record.pdf
    setPdfFile(pdfdata);
    setIsModalOpen(true)
         console.log(pdfdata)
  }
 


  const handleStatusToggle = async(record)=>{
      try {
         const response = await axios.patch(`${baseurl}/api/adminPost/toggled/${record._id}`)
         console.log(response)

         if(response){
          message.success("Status Updated Successfully")
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
        title: 'Date',
        dataIndex: 'createdAt',
        key: 'createdAt',
        sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),  // Sort by date
        render: (createdAt) => {
          const date = new Date(createdAt);
          return date.toLocaleDateString();  // Format the date
        },
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





    // {
    //     title: "Status",
    //     key: "status",
    //     render: (_, record) => (
    //       <Switch
    //         checked={record.status === "Active"}
    //         onChange={() => handleStatusToggle(record)}
    //         checkedChildren="Active"
    //         unCheckedChildren="Inactive"
    //       />
    //     ),
    //   },

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

    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button onClick={() => viewPdf(record)}>View Vacancy</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        // rowKey="_id"
      />


       <Modal
        // title={editingUser ? 'Edit User' : 'Add User'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={false}
        style={{width:"70%"}}
      >
      
       {/* <h1>{pdfFile}</h1> */}
       <PdfComp url={pdfFile}/>

        </Modal>
    </div>
  );
};

export default VacanyUpload;
