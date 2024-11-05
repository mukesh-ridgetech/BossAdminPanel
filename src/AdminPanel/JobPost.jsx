import React, { useState, useEffect } from "react";
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
const { TextArea } = Input;

import { BellOutlined,TranslationOutlined ,TruckOutlined ,CloseCircleOutlined } from "@ant-design/icons";
import { UploadOutlined } from '@ant-design/icons';
import { baseurl } from "../helper/Helper";
import axios from "axios";
import Password from "antd/es/input/Password";
// import { baseurl } from "../helper/Helper";
import '../Style/Sendjob.css'
import { useAuth } from "../context/auth";
// import { baseurl } from "../helper/Helper.jsx";


const NeighbourhoodData = [
  { id: 1, name: "Marbal", value: "Marbal" },
  { id: 1, name: "Granite", value: "Granite" },
  
]

const JobPost = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJobPost, setEditingJobPost] = useState(null);
  const[image1,setImage] = useState();
  const [form] = Form.useForm();
  const [auth, setAuth] = useAuth();
  const [photo, setPhoto] = useState("");
  const [imageTrue,setImageTrue] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");




  const [val, setVal] = useState([{ type: '' }]);

  // Handle add new input field
  const handleAdd1 = () => {
    setVal([...val, { type: '' }]); // Add an empty object for the new input
  };

  // Handle input change
  const handleChange1 = (e, i) => {
    const newData = [...val];
    newData[i].type = e.target.value; // Update the specific input value in the array
    setVal(newData);
  };

  // Handle delete input field
  const handleDelete = (i) => {
    const newData = val.filter((_, index) => index !== i); // Remove the specific input field
    setVal(newData);
  };




  
  // http://localhost:5000/api/amenities/getAmenties
  useEffect(() => {
    fetchJobPost();
  }, []);

  const fetchJobPost = async () => {
    setLoading(true);
    try {
       const respons = await axios.get( baseurl+'/api/jobPost/getAllJobs')
       console.log(respons.data.jobs);

       if(respons.data.success){
        setData(respons.data.jobs);
        message.success('Job post fetched successfully!');
       }
     
    //   message.success('Country codes fetched successfully!');
    } catch (error) {
      console.error('Error fetching jobPost:', error);
      message.error('Error fetching jobPost.');
    } finally {
      setLoading(false);
    }
  };


  const handleStatusToggle = async(record)=>{
    try {
       const response = await axios.patch(`${baseurl}/api/neighbourhood/toggled/${record._id}`)
       console.log(response)

       if(response){
        message.success("Status updated succesfully")
        fetchNeighbourhood()
       }
    } catch (error) {
      console.log(error)
    }
}


  const handleChange = (values) => {
    setSelectedLocation(values);
      console.log(values);
  };
  

  const handleAdd = () => {
    setEditingJobPost(null);
    form.resetFields();
    setIsModalOpen(true);
  };


  const uploadImage = async (file) => {
    console.log(file);
    const formData = new FormData();
    formData.append("image", file.file);
    console.log(file.file.name);

    try {
      const response = await axios.post(
        `${baseUrl}/api/uploadImage/uploadImage1`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    if(response.data){
      console.log("response.data",response.data)
      setImage(response.data.imageUrl)
    }
      

      return response.data.imageUrl; // Assuming the API returns the image URL in the 'url' field
    } catch (error) {
      message.error("Error uploading image. Please try again later.");
      console.error("Image upload error:", error);
      return null;
    }
  };

  const handleEdit = (record) => {
    setImageTrue(true)
    setEditingJobPost(record);
    form.setFieldsValue({
      // name:record.name,
      location:record.location,
      category:record.category,
      jobType:record.jobType,
      jobName:record.jobName,
      jobDescription:record.jobDescription,
      // responsibilities_brief:record.responsibilities_brief,
      // requirements_brief:record.requirements_brief,
      // lastShortDesc:record.lastShortDesc,
      email:record.email,
      responsibility:record.responsibilities,
      requirements:record.requirements,
      upper_jd:record.upper_jd,
      image:image1,
    phoneNumber:record.phone,
    });
    setIsModalOpen(true);
  };



 


  const type = val.map((item)=>{
    return item.type;
})


const Isdata = type.map((item)=>{
       const returndata = {
           value:item
       }

       return  returndata;
})

console.log("is data is",Isdata)




  const handlePost = async(values)=>{
   

    const responsibilities = values.responsibility.split('\n').map(item => item.trim()).filter(item => item);
    // console.log("responsibility",responsibility);
    const requirements = values.requirements.split('\n').map(item => item.trim()).filter(item => item);
    const upper_jd = values.upper_jd.split('\n').map(item => item.trim()).filter(item => item);
    const postdata={
      responsibilities:responsibilities,
      requirements:requirements,
      upper_jd:upper_jd,
      location:values.location,
      category:values.category,
      jobType:values.jobType,
      jobName:values.jobName,
      jobDescription:values.jobDescription,
      email:values.email,
      image:image1,
      phone:values.phoneNumber,
      

    }
     

    try {
      const response = await axios.post(baseurl+'/api/jobPost/createJob',postdata);
      console.log(response.data);

      if(response.data){
        message.success("PostJob created successfully!");
        setIsModalOpen(false);
        setPhoto("");
        fetchJobPost()
        setVal([{type:''}])
      }
    


  } catch (error) {
    console.log(error)
  }

  }

  const handlePut = async(values)=>{
  //   const type = val.map((item)=>{
  //       return item.type;
  //   })

  //   const object = type.map(item => {
  //     return { value: item };
  // });

  //   const postdata={
  //     name:values.name,
  //     type:object,
  //     createdBy:auth.user._id,
  //   }


  const Responsibility = !Array.isArray(values.responsibility) ? values.responsibility?.split('\n').map(item => item.trim()).filter(item => item) : values.responsibility; 
  // console.log("responsibility",Responsibility);
  const requirements = !Array.isArray(values.requirements) ? values.requirements?.split('\n').map(item => item.trim()).filter(item => item) : values.requirements; 
  const jobDetails = !Array.isArray(values.upper_jd) ? values.upper_jd?.split('\n').map(item => item.trim()).filter(item => item) : values.upper_jd; 

  const postdata={
    responsibilities:Responsibility,
    requirements:requirements,
    upper_jd:jobDetails,
    location:values.location,
    category:values.category,
    jobType:values.jobType,
    jobName:values.jobName,
    jobDescription:values.jobDescription,
    phone:values.phoneNumber,
    email:values.email,
    image:image1

  }

    try {
      const response = await axios.put(`${baseurl}/api/jobPost/updateJob/${editingJobPost._id}`,postdata);
      console.log(response.data);

      if(response.data){
        message.success("Job post update successfully!");
        setIsModalOpen(false);
        setPhoto("");
        setVal([{type:''}])
        fetchJobPost()
      }

  } catch (error) {
    console.log(error)
  }
  }
  const handleSubmit = async (values) => {
    if (editingJobPost) {
      await handlePut(values);
    } else {
      await handlePost(values);
    }
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    
// category
{
    title: "Job Category",
    dataIndex: "category",
    key: "category",
  },

  


  {
    title: "Job Name",
    dataIndex: "jobName",
    key: "jobName",
  },

  {
    title: "Job Type",
    dataIndex: "jobType",
    key: "jobType",
  },


//   requirements_brief


  {
    title: "Eduction",
    // dataIndex: "locations",
    key: "upper_jd",
    render: (_, record) => (

         <>
           {
            record?.upper_jd?.map((item)=>{
                return(
                  <>

                  <span>{item},</span> 
                  </>
                )
            })
           }
         </>
),
  },


  {
    title: "Location",
    dataIndex: "location",
    key: "location",
  },


    {
        title: "Requirements",
        // dataIndex: "locations",
        key: "requirements",
        render: (_, record) => (
  
             <>
               {
                record?.requirements?.map((item)=>{
                    return(
                      <>
  
                      <span>{item}</span> <br />
                      </>
                    )
                })
               }
             </>
    ),
      },


      // {
      //   title: "Responsibilities Brief",
      //   dataIndex: "responsibilities_brief",
      //   key: "responsibilities_brief",
      // },
    
        {
            title: "Responsibilities",
            // dataIndex: "locations",
            key: "responsibilities",
            render: (_, record) => (
      
                 <>
                   {
                    record?.responsibilities?.map((item)=>{
                        return(
                          <>
      
                          <span>{item}</span> <br />
                          </>
                        )
                    })
                   }
                 </>
        ),
          },


      // {
      //   title: "Job Description",
      //   dataIndex: "jobDescription",
      //   key: "jobDescription",
      // },

    

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
          <Button onClick={() => handleEdit(record)}>Update</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Post job
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        scroll={{ x: 'max-content' }} 
        // rowKey="_id"
      />


       <Modal
        title={editingJobPost ? 'Edit job Post' : 'Add job post'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >


          <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          >



          <Form.Item
            name="jobName"
            label="Job Name"
            rules={[{ required: true, message: 'Please input the job Name!' }]}
            
           >
            <Input  placeholder="Enter Job Name"/>
          </Form.Item>

          <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Please enter your email' },
          { type: 'email', message: 'Please enter a valid email' },
        ]}
      >
        <Input type="email" placeholder="Enter your email" />
      </Form.Item>

          <Form.Item
            name="jobType"
            label="jobType"
            rules={[{ required: true, message: 'Please input the Job Type!' }]}
            
           >
            <Input  placeholder="Enter Job Type"/>
          </Form.Item>


          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please input the category!' }]}
            
           >
            <Input  placeholder="Enter category"/>
          </Form.Item>


          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: 'Please input the location!' }]}
            
           >
            <Input  placeholder="Enter Location"/>
          </Form.Item>


          <Form.Item
            name="responsibility"
            label="Responsibility"
            rules={[{ required: true, message: 'Please input the Name!' }]}
            
           >
            <TextArea  placeholder="Enter responsibility array"  style={{height:"100px"}}/>
          </Form.Item>

          


          <Form.Item
            name="requirements"
            label="Requirements"
            rules={[{ required: true, message: 'Please input the Name!' }]}
            
           >
            <TextArea  placeholder="Requirements aray"  style={{height:"100px"}}/>
          </Form.Item>

          

          {/* jobDescription */}
          <Form.Item
            name="upper_jd"
            label="Education"
            rules={[{ required: true, message: 'Please input the Name!' }]}
            
           >
            <TextArea  placeholder="Enter Education array"  style={{height:"100px"}}/>
          </Form.Item>

          <Form.Item
            name="jobDescription"
            label="jobDescription"
            rules={[{ required: true, message: 'Please input the Name!' }]}
            
           >
            <TextArea  placeholder="Enter job Description"  style={{height:"100px"}}/>
          </Form.Item>
          {/* responsibilities_brief */}
          {/* lastShortDesc */}
          
          
          <Form.Item
        label="Phone Number"
        name="phoneNumber"
        rules={[
          { required: true, message: 'Please enter your phone number' },
         
        ]}
      >
        <Input placeholder="Enter phone number"  />
      </Form.Item>
       

       {
        editingJobPost?(<>
          <Form.Item
              label="Photo"
              name="photo"
              onChange={(e) => setPhoto(e.target.files[0])}
              
              rules={[
                { required: true, message: "Please upload pdf" },
              ]}
            >
              <Upload
                listType="picture"
                beforeUpload={() => false}
                onChange={uploadImage}
  
                
                showUploadList={false}
                customRequest={({ file, onSuccess }) => {
                  setTimeout(() => {
                    onSuccess("ok");
                  }, 0);
                }}
              >
                <Button icon={<UploadOutlined />}>Upload Photo</Button>
              </Upload>
            </Form.Item>

            {photo && (
              <div>
                <img
                  src={URL.createObjectURL(photo)}
                  alt="Uploaded"
                  height="100px"
                  width="100px"
                />
              </div>
            )}
            
        </>)
        
        
        :
        
        
        (<>
               <Form.Item
              label="Photo"
              name="photo"
              onChange={(e) => setPhoto(e.target.files[0])}
              
              rules={[
                { required: true, message: "Please upload pdf" },
              ]}
            >
              <Upload
                listType="picture"
                beforeUpload={() => false}
                onChange={uploadImage}
  
                
                showUploadList={false}
                customRequest={({ file, onSuccess }) => {
                  setTimeout(() => {
                    onSuccess("ok");
                  }, 0);
                }}
              >
                <Button icon={<UploadOutlined />}>Upload Photo</Button>
              </Upload>
            </Form.Item>
            {photo && (
              <div>
                <img
                  src={URL.createObjectURL(photo)}
                  alt="Uploaded"
                  height="100px"
                  width="100px"
                />
              </div>
            )}
        </>)
       }
              
        
      

              <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingJobPost ? 'Update' : 'Submit'}
            </Button>
          </Form.Item>

          </Form>

        </Modal>
    </div>
  );
};

export default JobPost;