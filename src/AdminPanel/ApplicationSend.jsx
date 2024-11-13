import React, { useState, useEffect } from "react";
import { pdfjs } from "react-pdf";
import jsPDF from 'jspdf';

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
  Tag
} from "antd";
import { baseurl } from "../helper/Helper.jsx";
import axios from "axios";
import Password from "antd/es/input/Password";
// import { baseurl } from "../helper/Helper";
import { useAuth } from "../context/auth";
import PdfComp from "./PdfComp";
import "../Style/AdminPanel.css";
import { FilterOutlined } from '@ant-design/icons';
// import { baseUrl } from "../../../Boss_frontend/src/components/helper/helper.jsx";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.js",
    import.meta.url
  ).toString();
  

const ApplicationSend = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [auth, setAuth] = useAuth();
  const [pdfFile, setPdfFile] = useState(null);
  const [details,setDetails] = useState(null);
  const[st,setSt] = useState()
  const [et,setEt] = useState()
  const [jobTitlesToFilter,setjobTitlesToFilter] = useState();

  // console.log(auth.user._id);

  const jobTitle = async()=>{
       try {
         const response = await axios.get(`${baseurl}/api/jobPost/jobNames`);
        //  console.log("jobtitle",response.data);


         if(response.data){
          const data = response?.data?.map((item)=>{
            const returndata = {
             text:item?.jobName,
             value:item?.jobName,
            }
         return returndata;
           
       })

       setjobTitlesToFilter(data)
       console.log(data,"data is now title")
         }
       } catch (error) {
        console(error)
       }
  }


  // const jobTitlesToFilter = [
  //   { text: "Reservations/Collections Clerk", value: "Reservations/Collections Clerk" },
  //   { text: "Commercial Data Analyst", value: "Commercial Data Analyst" },
  //   { text: "Fuel Operator", value: "Fuel Operator" }
  // ];

  useEffect(() => {
    jobTitle();
    fetchData();
    

  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(baseurl + "/api/sendApplication/getAllSendApplication");
      const personal = await axios.get(baseurl + "/api/personal/get-details");
      // console.log("personal.data",personal.data)

      if(res.data && personal.data){
        const combinedArray = [...personal.data, ...res.data.sendApplications];
        console.log("combinedArray",combinedArray)




        function sortDataByTimestamp(data, order = 'asc') {
          return data.sort((a, b) => {
            const dateA = new Date(a.createdAt );
            const dateB = new Date(b.createdAt);
        
            // Ascending order
            if (order === 'asc') {
              return dateA - dateB;
            }
            // Descending order
            else if (order === 'desc') {
              return dateB - dateA;
            }
          });
        }


      const a =   sortDataByTimestamp(combinedArray,'desc');

      const sortedData = a.sort((a, b) => {
        if (a?.job?.jobName.toLowerCase() < b?.job?.jobName.toLowerCase()) {
          return -1;
        }
        if (a?.job?.jobName.toLowerCase() > b?.job?.jobName.toLowerCase()) {
          return 1;
        }
        return 0;
      });
      
      setData(sortedData);
      
      // console.log("a is sortedData",sortedData);
      }
     
      // console.log(res.data.sendApplications);
      
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


  const handleDetails = (record)=>{
       console.log(record)
       setDetails(record)
       setIsModalOpen1(true)


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

        if(record?.startTime){
          return `${hours}:${minutes} ${ampm}`;
        }

        return "";
       
      }

      if(record?.startTime){
        const st1 = convertTo12HourFormat(record?.startTime)
        setSt(st1)
      }

     if(record?.finishTime){
      const et1 = convertTo12HourFormat(record?.finishTime)
      setEt(et1)
     }
      


      
  }
 



  const generatePDF = () => {
    const doc = new jsPDF();
    let y = 20; // Initial y-coordinate
  
    doc.setFontSize(16);
    doc.text('Personal Details', 10, y);
  
    doc.setFontSize(12);
    y += 10;
    doc.text(`First Name: ${details?.firstName} Last Name: ${details?.lastName}`, 10, y);
    
    y += 10;
    doc.text(`Date of Birth: ${details?.dateOfBirth}`, 10, y);
    
    y += 10;
    doc.text(`Gender: ${details?.gender}`, 10, y);
    
    y += 10;
    doc.text(`Country of Residence: ${details?.countryOfResidence}`, 10, y);
    
    y += 10;
    doc.text(`Phone Number: ${details?.phoneNumber}`, 10, y);
    
    y += 10;
    doc.text(`E-mail Address: ${details?.email}`, 10, y);
    
    y += 10;
    doc.text(`Valid Dutch Passport: ${details?.dutchPassport}`, 10, y);
    
    y += 10;
    doc.text(`Valid Driver's License: ${details?.driversLicense}`, 10, y);
    
    y += 10;
    doc.text(`Do You Own A Vehicle: ${details?.ownVehicle}`, 10, y);
  
    y += 20;
    doc.text('Work Experience', 10, y);
    
    y += 10;
    doc.text(`Are you currently Employed: ${details?.currentlyEmployed}`, 10, y);
    
    y += 10;
    doc.text(`Company Name: ${details?.companyName}`, 10, y);
    
    y += 10;
    doc.text(`Job Title: ${details?.jobTitle}`, 10, y);
    
    y += 10;
    doc.text(`Last Job Title: ${details?.jobTitle1}`, 10, y);
    
    y += 10;
    doc.text(`Last Company Name: ${details?.companyName1}`, 10, y);
    
    y += 10;
    doc.text(`Date In Service: ${details?.DOS}`, 10, y);
    
    y += 10;
    doc.text(`Reason for Leaving: ${details?.RFL}`, 10, y);
  
    y += 20;
    doc.text('Availability', 10, y);
    
    y += 10;
    doc.text(`Hours Available to Work: ${details?.HAW}`, 10, y);
    
    y += 10;
    doc.text(`Days: ${details?.day}`, 10, y);
    
    y += 10;
    doc.text(`Can You Work Evenings: ${details?.WorkE}`, 10, y);
    
    y += 10;
    doc.text(`Can You Work Nights: ${details?.WorkN}`, 10, y);
    
    y += 10;
    doc.text(`Earliest Start Time: ${st}`, 10, y);
    
    y += 10;
    doc.text(`Latest Finish Time: ${et}`, 10, y);
  
    // Check if we are running out of space on the page and add a new page if necessary
    const pageHeight = doc.internal.pageSize.height;
    if (y + 30 > pageHeight) { // 30 is a margin buffer
      doc.addPage();
      y = 20; // Reset y-coordinate for the new page
    }
  
    y += 20; // Add spacing before the "Education" section
    doc.text('Education', 10, y);
    
    y += 10;
    doc.text(`Highest Level of Education Completed: ${details?.highEducation}`, 10, y);
  
    // Save the PDF
    doc.save('details.pdf');
  };
  
  
  


  const handleStatusToggle = async(record)=>{
      try {
         const response = await axios.patch(`${baseurl}/api/sendApplication/toggled/${record._id}`)
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
      title: 'Job Title',
      dataIndex: ['job', 'jobName'],  // Access job title inside the jobs object
      key: 'jobTitle',
      filters: jobTitlesToFilter?.map(title => ({
        text: title?.text,  // Use the 'text' from the API data (job title label)
        value: title?.value  // Use the 'value' from the API data (job title value)
      })),
      filterMultiple: false,  // Allow only one filter selection
      onFilter: (value, record) => record?.job?.jobName === value,  // Filtering logic
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

    // createdAt

    // {
    //   title: "Status",
    //   key: "status",
    //   render: (_, record) => (
    //     <Switch
    //       checked={record.status === "Active"}
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

            {
              record?.pdf?(<><Button onClick={() => viewPdf(record)}>View Resume</Button></>):(<>
                  <Button onClick={()=>{handleDetails(record)}}>View Details</Button>
              </>)
              
              
            }
          
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





        <Modal
        // title='Details'
        open={isModalOpen1}
        onCancel={() => setIsModalOpen1(false)}
        // footer={null}
        style={{width:"70%"}}
        footer={[
          <Button key="download" type="primary" onClick={generatePDF}>
            Download PDF
          </Button>,
        ]}
      >
          
          <div className="details-container">
             <h2>Personal Details</h2>
          </div>
          <div className="details-container">
                <div className="details-container-left">First Name</div>
                <div>:</div>
                <div className="details-container-right">{details?.firstName}</div>
          </div>



          <div className="details-container">
                <div className="details-container-left">Last Name</div>
                <div>:</div>
                <div className="details-container-right">{details?.lastName}</div>
          </div>



          <div className="details-container">
                <div className="details-container-left">Date of Birth</div>
                <div>:</div>
                <div className="details-container-right">{details?.dateOfBirth}</div>
          </div>



          <div className="details-container">
                <div className="details-container-left">Gender</div>
                <div>:</div>
                <div className="details-container-right">{details?.gender}</div>
          </div>


          <div className="details-container">
                <div className="details-container-left">Country of Residence</div>
                <div>:</div>
                <div className="details-container-right">{details?.countryOfResidence}</div>
          </div>


          <div className="details-container">
                <div className="details-container-left">Phone Number</div>
                <div>:</div>
                <div className="details-container-right">{details?.phoneNumber}</div>
          </div>


          <div className="details-container">
                <div className="details-container-left">E-mail Address</div>
                <div>:</div>
                <div className="details-container-right">{details?.email}</div>
          </div>

          <div className="details-container">
                <div className="details-container-left">Valid Dutch Passport </div>
                <div>:</div>
                <div className="details-container-right">{details?.dutchPassport}</div>
          </div>



          <div className="details-container">
                <div className="details-container-left">Valid Driver's License  </div>
                <div>:</div>
                <div className="details-container-right">{details?.driversLicense}</div>
          </div>


          <div className="details-container">
                <div className="details-container-left">Do You Own A Vehicle?   </div>
                <div>:</div>
                <div className="details-container-right">{details?.ownVehicle}</div>
          </div>



          <div className="details-container">
               <h2>Work Experience</h2>
          </div>



          <div className="details-container">
                <div className="details-container-left">Are you currently Employed?    </div>
                <div>:</div>
                <div className="details-container-right">{details?.currentlyEmployed}</div>
          </div>

          
          <div className="details-container">
                <div className="details-container-left">Company Name   </div>
                <div>:</div>
                <div className="details-container-right">{details?.companyName}</div>
          </div>



          
          <div className="details-container">
                <div className="details-container-left">Job Title   </div>
                <div>:</div>
                <div className="details-container-right">{details?.jobTitle}</div>
          </div>



          <div className="details-container">
                <div className="details-container-left">Last Job Title   </div>
                <div>:</div>
                <div className="details-container-right">{details?.jobTitle1}</div>
          </div>



          <div className="details-container">
                <div className="details-container-left">Last Company Name   </div>
                <div>:</div>
                <div className="details-container-right">{details?.companyName1}</div>
          </div>



          <div className="details-container">
                <div className="details-container-left">Date In Service   </div>
                <div>:</div>
                <div className="details-container-right">{details?.DOS}</div>
          </div>



          <div className="details-container">
                <div className="details-container-left">Reason for Leaving   </div>
                <div>:</div>
                <div className="details-container-right">{details?.RFL}</div>
          </div>


          <div className="details-container">
            <h2>Availability</h2>
          </div>



          <div className="details-container">
                <div className="details-container-left">Hours Available to Work  </div>
                <div>:</div>
                <div className="details-container-right">{details?.HAW}</div>
          </div>


          <div className="details-container">
                <div className="details-container-left">Days   </div>
                <div>:</div>
                <div className="details-container-right">{details?.day}</div>
          </div>


          <div className="details-container">
                <div className="details-container-left">Can You Work Evenings?</div>
                <div>:</div>
                <div className="details-container-right">{details?.WorkE}</div>
          </div>


          <div className="details-container">
                <div className="details-container-left">Can You Work Nights?</div>
                <div>:</div>
                <div className="details-container-right">{details?.WorkN}</div>
          </div>


          <div className="details-container">
                <div className="details-container-left">Earliest Start Time</div>
                <div>:</div>
                <div className="details-container-right">{st?(<><>{st}</></>):(<></>)}</div>
          </div>


          <div className="details-container">
                <div className="details-container-left">Latest Finish Time</div>
                <div>:</div>
                <div className="details-container-right">{et?(<><>{et}</></>):(<></>)}</div>
          </div>



          <div className="details-container">
              <h2>Education</h2>
          </div>


          <div className="details-container">
                <div className="details-container-left"> Highest Level of Education Completed: </div>
                <div>:</div>
                <div className="details-container-right">{details?.highEducatioin}</div>
          </div>
          {/* <h4><span>First Name:</span>{details?.firstName}</h4>
          <h4><span>Last Name:</span>{details?.lastName}</h4> */}

            
        </Modal>
    </div>
  );
};

export default ApplicationSend;
