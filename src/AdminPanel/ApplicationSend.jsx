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
import PdfComp from "./pdfComp";
import "../Style/AdminPanel.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.js",
    import.meta.url
  ).toString();
  

const ApplicationSend = () => {
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
      const res = await axios.get(baseurl + "/api/sendApplication/getAllSendApplication");

      console.log(res.data.sendApplications);
      setData(res.data.sendApplications);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
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
          <Button onClick={() => viewPdf(record)}>View Resume</Button>
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
        // footer={null}
        style={{width:"70%"}}
      >
      
       {/* <h1>{pdfFile}</h1> */}
       <PdfComp url={pdfFile}/>


        

        </Modal>
    </div>
  );
};

export default ApplicationSend;
