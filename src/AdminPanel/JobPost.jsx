import React, { useState, useEffect } from "react";
import
{
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Upload,
  Switch,
  Checkbox
} from "antd";
const { TextArea } = Input;

import { BellOutlined, TranslationOutlined, TruckOutlined, CloseCircleOutlined, PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
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

const JobPost = () =>
{
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJobPost, setEditingJobPost] = useState(null);
  const [image1, setImage] = useState();
  const [form] = Form.useForm();
  const [auth, setAuth] = useAuth();
  const [photo, setPhoto] = useState("");
  const [imageTrue, setImageTrue] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [educationFields, setEducationFields] = useState(['']);
  const[cross,setCross] = useState(true);
  const [record1, setRecord] = useState();
  



  const [val, setVal] = useState([{ type: '' }]);


  const handleCross = ()=>{
    setCross(false);
  }

  const handleRowClick = (record) => {
    console.log("Clicked row data:", record);
    setRecord(record);
    setImage(record?.image);
    setCross(true);
   
    // Access the clicked row's data here
    // You can now use 'record' to get the details of the clicked row
  };

  // Handle add new input field
  const handleAdd1 = () =>
  {
    setVal([...val, { type: '' }]); // Add an empty object for the new input
  };
  const handleAddEducation = () =>
  {
    if (educationFields.length < 3)
    {
      setEducationFields([...educationFields, '']);
    }
  };
  const handleRemoveEducation = (index) =>
  {
    if (educationFields.length > 1)
    {
      const updatedFields = educationFields.filter((_, i) => i !== index);
      setEducationFields(updatedFields);
    }
  };

  const handleEducationChange = (value, index) =>
  {
    const updatedFields = [...educationFields];
    updatedFields[index] = value;
    setEducationFields(updatedFields);
  };



  // Handle input change
  const handleChange1 = (e, i) =>
  {
    const newData = [...val];
    newData[i].type = e.target.value; // Update the specific input value in the array
    setVal(newData);
  };

  // Handle delete input field
  const handleDelete = (i) =>
  {
    const newData = val.filter((_, index) => index !== i); // Remove the specific input field
    setVal(newData);
  };



  // http://localhost:5000/api/amenities/getAmenties
  useEffect(() =>
  {
    fetchJobPost();
  }, []);

  const fetchJobPost = async () =>
  {
    setLoading(true);
    try
    {
      const respons = await axios.get(baseurl + '/api/jobPost/getAllJobs')
      console.log(respons.data.jobs);

      if (respons.data.success)
      {

        const reversedArr = respons.data.jobs.reverse();
        setData(reversedArr);
        // message.success('Job post fetched successfully!');
      }

      //   message.success('Country codes fetched successfully!');
    } catch (error)
    {
      console.error('Error fetching jobPost:', error);
      message.error('Error fetching jobPost.');
    } finally
    {
      setLoading(false);
    }
  };


  const handleStatusToggle = async (record) =>
  {
    try
    {
      const response = await axios.patch(`${ baseurl }/api/jobPost/toggled/${ record._id }`)
      console.log(response)

      if (response)
      {
        message.success("Status updated succesfully")
        fetchJobPost();
      }
    } catch (error)
    {
      console.log(error)
    }
  }


  const handleChange = (values) =>
  {
    setSelectedLocation(values);
    console.log(values);
  };


  const handleAdd = () =>
  {
    setEditingJobPost(null);
    form.resetFields();
    setIsModalOpen(true);
  };


  const uploadImage = async (file) =>
  {
    console.log(file);
    const formData = new FormData();
    formData.append("image", file.file);
    console.log(file.file.name);

    try
    {
      const response = await axios.post(
        `${ baseurl }/api/uploadImage/uploadImage1`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data)
      {
        console.log("response.data", response.data)
        setImage(response.data.imageUrl)
      }


      return response.data.imageUrl; // Assuming the API returns the image URL in the 'url' field
    } catch (error)
    {
      message.error("Error uploading image. Please try again later.");
      console.error("Image upload error:", error);
      return null;
    }
  };

  const handleEdit = (record) =>
  {
    setImageTrue(true)
    setEditingJobPost(record);
    console.log(record.upper_jd)
    setEducationFields(record.upper_jd || [""]);
    form.setFieldsValue({
      // name:record.name,
      location: record.location,
      category: record.category,
      jobType: record.jobType,
      jobName: record.jobName,
      jobDescription: record.jobDescription,
      // responsibilities_brief:record.responsibilities_brief,
      // requirements_brief:record.requirements_brief,
      // lastShortDesc:record.lastShortDesc,
      email: record.email,
      responsibility: record.responsibilities,
      requirements: record.requirements,
      upper_jd: record.upper_jd.join('\n'),
      image: image1,
      phoneNumber: record.phone,
    });
    setIsModalOpen(true);
  };






  const type = val.map((item) =>
  {
    return item.type;
  })


  const Isdata = type.map((item) =>
  {
    const returndata = {
      value: item
    }

    return returndata;
  })

  console.log("is data is", Isdata)




  const handlePost = async (values) =>
  {


    const responsibilities = values.responsibility.split('\n').map(item => item.trim()).filter(item => item);
    // console.log("responsibility",responsibility);
    const requirements = values.requirements.split('\n').map(item => item.trim()).filter(item => item);
    // const upper_jd = values.upper_jd.split('\n').map(item => item.trim()).filter(item => item);
    const postdata = {
      responsibilities: responsibilities,
      requirements: requirements,
      upper_jd: educationFields,
      location: values.location,
      category: values.category,
      jobType: values.jobType,
      jobName: values.jobName,
      jobDescription: values.jobDescription,
      email: values.email,
      image: image1,
      phone: values.phoneNumber,
      agree:values.agree

    }
    
    

    try
    {
      const response = await axios.post(baseurl + '/api/jobPost/createJob', postdata);
      console.log(response.data);

      if (response.data)
      {
        message.success("Job created Successfully");
        setIsModalOpen(false);
        setPhoto("");
        fetchJobPost()
        setVal([{ type: '' }])
      }



    } catch (error)
    {
      console.log(error)
    }

  }

  const handlePut = async (values) =>
  {
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
    // const jobDetails = !Array.isArray(values.upper_jd) ? values.upper_jd?.split('\n').map(item => item.trim()).filter(item => item) : values.upper_jd;

    const postdata = {
      responsibilities: Responsibility,
      requirements: requirements,
      upper_jd: educationFields,
      location: values.location,
      category: values.category,
      jobType: values.jobType,
      jobName: values.jobName,
      jobDescription: values.jobDescription,
      phone: values.phoneNumber,
      email: values.email,
      image: image1,
      phoneNumber: "123456987",
      agree:values.agree

    }

    try
    {
      const response = await axios.put(`${ baseurl }/api/jobPost/updateJob/${ editingJobPost._id }`, postdata);
      console.log(response.data);

      if (response.data)
      {
        message.success("Job Updated Successfully");
        setIsModalOpen(false);
        setPhoto("");
        setVal([{ type: '' }])
        fetchJobPost()
      }

    } catch (error)
    {
      console.log(error)
    }
  }
  const handleSubmit = async (values) =>
  {
    if (editingJobPost)
    {
      await handlePut(values);
    } else
    {
      await handlePost(values);
    }
  };

  const columns = [

    {
      title: "Job Title",
      dataIndex: "jobName",
      key: "jobName",
    },

    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
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
      title: "Job Type",
      dataIndex: "jobType",
      key: "jobType",
    },
    // category
    {
      title: "Education",
      key: "upper_jd",
      render: (_, record) => (
        <>
          {
            record?.upper_jd?.map((item, index) => (
              <span key={index}>
                {item}{index < record.upper_jd.length - 1 ? ',' : ''}
              </span>
            ))
          }
        </>
      ),
    },

    {
      title: "Job Category",
      dataIndex: "category",
      key: "category",
    },







    //   requirements_brief






    {
      title: "Requirements",
      // dataIndex: "locations",
      key: "requirements",
      render: (_, record) => (

        <>
          {
            record?.requirements?.map((item) =>
            {
              return (
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
            record?.responsibilities?.map((item) =>
            {
              return (
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
      Post a New  Job
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        scroll={{ x: 'max-content' }}
        rowKey={(record) => record._id}
        onRow={(record) => ({
          onClick: () => {
            handleRowClick(record); // Trigger the click handler
          },
        })}
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
            label="Job Title"
            rules={[{ required: true, message: 'Please enter the job title!' }]}

          >
            <Input placeholder="Enter Job title" />
          </Form.Item>
          <Form.Item
            name="category"
            label="Job Category"
            rules={[{ required: true, message: 'Please select the job category!' }]}

          >
            <Select>
              <Option value="Retail and Customer Service">Retail and Customer Service</Option>
              <Option value="Logistics and Warehousing">Logistics and Warehousing</Option>
              <Option value="Hospitality and Administrative Roles">Hospitality and Administrative Roles</Option>
              <Option value="Supervisory and Management Positions">Supervisory and Management Positions</Option>
            </Select>
            {/* <Input placeholder="Enter category" /> */}
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: 'Please enter the location!' }]}

          >
            <Input placeholder="Enter Location" />
          </Form.Item>
          <Form.Item
            name="jobType"
            label="Job Type"
            rules={[{ required: true, message: 'Please select the job type!' }]}

          >
            <Select>
              <Option value="Part Time">Part Time</Option>
              <Option value="Full Time">Full Time</Option>
            </Select>
          </Form.Item>

          {/* jobDescription */}


          <Form.Item
            name="upper_jd"
            label="Education"
            rules={[{ required: true, message: 'Please input the Name!' }]}

          >


            {educationFields.map((field, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Input
                  placeholder="Enter education"
                  value={field}
                  onChange={(e) => handleEducationChange(e.target.value, index)}
                  style={{ width: '90%' }}
                  required
                />
                {educationFields.length > 1 && (
                  <MinusCircleOutlined onClick={() => handleRemoveEducation(index)} />
                )}
                {index === educationFields.length - 1 && educationFields.length < 3 && (
                  <PlusOutlined onClick={handleAddEducation} />
                )}
              </div>
            ))}

          </Form.Item>

          <Form.Item
            name="jobDescription"
            label="Position Overview"
            rules={[{ required: true, message: 'Please enter the Position Overview!' }]}

          >
            <TextArea placeholder="Enter Position Overview" style={{ height: "100px" }} />
          </Form.Item>

          <Form.Item
            name="responsibility"
            label="Key Responsibility"
            rules={[{ required: true, message: 'Please enter the key responsibility!' }]}

          >
            <TextArea placeholder="Enter key responsibilities (comma seperated)" style={{ height: "100px" }} />
          </Form.Item>
          <Form.Item
            name="requirements"
            label="Qualifications & Skills"
            rules={[{ required: true, message: 'Please enter the Qualifications & Skills!' }]}

          >
            <TextArea placeholder="Enter Qualifications & Skills (comma seperated)" style={{ height: "100px" }} />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter  email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input type="email" placeholder="Enter email address" />
          </Form.Item>
















          {/* responsibilities_brief */}
          {/* lastShortDesc */}


          {/* <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              { required: true, message: 'Please enter your phone number' },

            ]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item> */}


          {
            editingJobPost ? (<>

            {
              cross?(<>
               <CloseCircleOutlined style={{width:"30px"}} onClick={handleCross} />
               <img src={`${baseurl}${record1?.image}`} alt="" style={{width:"100px",height:"100px"}} />
              </>):(<>
              
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
                  customRequest={({ file, onSuccess }) =>
                  {
                    setTimeout(() =>
                    {
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
                    customRequest={({ file, onSuccess }) =>
                    {
                      setTimeout(() =>
                      {
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

              
  <Form.Item
        name="agree"
        valuePropName="checked"
        
      >
        <Checkbox>Post this job to facebook Page</Checkbox>
      </Form.Item>  


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
