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



const PersonalDetails = () => {
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
      const res = await axios.get(baseurl + "/api/personal/get-details");

      console.log(res.data);

      const filterdata = res?.data?.map((item)=>{
             
        function convertTo12HourFormat(timestamp) {
          // Create a new Date object from the timestamp
          const date = new Date(timestamp);
        
          // Get the hours and minutes
          let hours = date.getUTCHours();
          let minutes = date.getUTCMinutes();
        
          // Determine AM or PM suffix
          const ampm = hours >= 12 ? 'PM' : 'AM';
        
          // Convert hours to 12-hour format
          hours = hours % 12;
          hours = hours ? hours : 12; // If hour is 0, make it 12
        
          // Format minutes to always be two digits
          minutes = minutes < 10 ? '0' + minutes : minutes;
        
          // Return the formatted time

          if(timestamp){
            return `${hours}:${minutes} ${ampm}`;
          }

          return "";
         
        }


        const startTime = convertTo12HourFormat(item?.startTime);
        const finishTime = convertTo12HourFormat(item?.finishTime)

          const returndata = {
              firstName:item?.firstName,
      lastName:item?.lastName,
      dateOfBirth:item?.dateOfBirth,
      gender:item?.dateOfBirth,
      countryOfResidence:item?.countryOfResidence,
      phoneNumber:item?.phoneNumber,
      email:item?.email,
      dutchPassport:item?.dutchPassport,
      driversLicense:item?.License,
      drivingLicenseCategory:item?.drivingLicenseCategory,
      ownVehicle:item?.ownVehicle,
      currentlyEmployed:item?.currentlyEmployed,
       jobTitle:item?.jobTitle,
      companyName1:item?.companyName1,
      jobTitle1:item?.jobTitle1,
      DOS:item?.DOS,
      RFL:item?.RFL,
      HAW:item?.HAW,
      day:item?.day,
      WorkE:item?.WorkE,
      WorkN:item?.WorkN,
      startTime:startTime,
      finishTime:finishTime,
      highEducatioin:item?.highEducatioin,
      companyName:item?.companyName,
      status:item?.status,
      id:item?._id
          }

          return returndata
      })

      console.log("filterdata",filterdata)
      setData(filterdata);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

 
 
 


  const handleStatusToggle = async(record)=>{
      try {
         const response = await axios.patch(`${baseurl}/api/personal/toggled/${record.id}`)
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
        title: "DOB",
        dataIndex: "dateOfBirth",
        key: "question",
      },

      {
        title: "Gender",
        dataIndex: "gender",
        key: "gender",
      },

      {
        title: "Country of Residence",
        dataIndex: "countryOfResidence",
        key: "countryOfResidence",
      },

      {
        title: " Dutch Passport",
        dataIndex: "dutchPassport",
        key: "dutchPassport",
      },

      {
        title: " Valid Driver's License",
        dataIndex: "driversLicense",
        key: "driversLicense",
      },

      {
        title: " Category Of Driving License",
        dataIndex: "drivingLicenseCategory",
        key: "drivingLicenseCategory",
      },

      {
        title: " Own Vehicle?",
        dataIndex: "ownVehicle",
        key: "ownVehicle",
      },

      {
        title: " Currently Employed?",
        dataIndex: "currentlyEmployed",
        key: "currentlyEmployed",
      },

      {
        title: " Company Name",
        dataIndex: "companyName",
        key: "companyName",
      },

      {
        title: " Job Title",
        dataIndex: "jobTitle",
        key: "jobTitle",
      },

      {
        title: "Last Company Name",
        dataIndex: "companyName1",
        key: "companyName",
      },

      {
        title: "Last Job Title",
        dataIndex: "jobTitle1",
        key: "jobTitle",
      },

      {
        title: "Date In Service",
        dataIndex: "DOS",
        key: "DOS",
      },

      {
        title: "Reason for Leaving",
        dataIndex: "RFL",
        key: "RFL",
      },

      {
        title: "Hours Available to Work",
        dataIndex: "HAW",
        key: "HAW",
      },

      {
        title: "Days",
        dataIndex: "day",
        key: "day",
      },

      {
        title: "Can You Work Evenings?",
        dataIndex: "WorkE",
        key: "WorkE",
      },

      {
        title: "Can You Work Nights?",
        dataIndex: "WorkN",
        key: "WorkN",
      },

      {
        title: "Earliest Start Time",
        dataIndex: "startTime",
        key: "startTime",
      },


      {
        title: "Latest Finish Time",
        dataIndex: "finishTime",
        key: "finishTime",
      },

      {
        title: " Highest Level of Education Completed: ",
        dataIndex: "highEducatioin",
        key: "highEducatioin",
      },

      
  

    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Switch
          checked={record.status === "Active"}
          onChange={() => handleStatusToggle(record)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },

    
  ];

  return (
    <div>
      
      <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      scroll={{ x: 'max-content' }} // Enables horizontal scrolling
      // rowKey="_id"
    />


       
    </div>
  );
};

export default PersonalDetails;
