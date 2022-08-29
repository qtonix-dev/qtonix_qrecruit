import React, { useEffect,useState } from 'react';
import { connect } from 'react-redux';
import Body from "../components/Body";
import axios from 'axios';
import moment from 'moment';
import { Button, Checkbox, Form, Input,Col, Row,Card,Select,InputNumber,DatePicker,Upload ,message,Skeleton } from 'antd';
import API from "../../api/API";
import cookie from 'react-cookies';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { UploadOutlined,InboxOutlined } from '@ant-design/icons';

export const JobForm = (props) => {
      var formDisabled=false;
     const [loading, setLoading] = useState(false);
     const navigate = useNavigate(); 
     const uploadURL=API.defaults.baseURL+"uploadTempJobSummaryAttachment";
     const [departments, setDepartments] = useState([]);
     const [statusList, setStatusList] = useState([]);
     const [jobTypes, setJobTypes] = useState([]);
     const [workExperiences, setWorkExperiences] = useState([]);
     const [skillSets, setSkillSets] = useState([]);
     const [recruiters, setRecruiters] = useState([]);
     const [managers, setManagers] = useState([]);
     const [descriptions, setDescription] = useState('');
     const [requirements, setRequirements] = useState('');
     const [benefits, setBenefits] = useState('');

     const [is_remotePosition, setRemotePosition] = useState(false);
     const [form] = Form.useForm();
     const userDetails=cookie.load('userDetails');
     const verifyAccess=(section, action)=>{
       return Object.keys(userDetails.access).indexOf(section)>=0 && Object.values(userDetails.access)[Object.keys(userDetails.access).indexOf(section)].includes(action);
    }
      useEffect(() => {
        
         if(!userDetails){
           navigate('/login');
         }
         if(!verifyAccess('Jobs','Add')){
           navigate('/401');
         }
         setLoading(true);
        formDisabled=true;
            API.post('/getMetadataForJobForm')
                  .then(response=>{
                    setLoading(false);
                     formDisabled=false;
                    if(response.data.status){
                          setDepartments(response.data.departments);
                          setManagers(response.data.managers);
                          setStatusList(response.data.statusList);
                          setJobTypes(response.data.jobTypes);
                          setWorkExperiences(response.data.workExperiences);
                          setSkillSets(response.data.skillSets);
                      }
                      
                  });
        }, [])

      const onManagerChange=(data)=>{
            API.post('/getListsOfRecruiters',{'manager_id':data})
                  .then(response=>{
                    if(response.data.status){
                          setRecruiters(response.data.recruiters);
                            form.setFieldsValue({ assigned_recruiter_ids: []});
                      }else{
                          message.error('Error occurred');
                      }
                      
                  });
       }

       const onSkillChange=(data)=>{
       }
       const onRecruiterChange=(data)=>{
       }
       
       const onDepartmentChange=(data) =>{

       }
       const onExperienceChange=(data) =>{

       }
       const onTypeChange=(data) =>{

       }
       const onStatusChange=(data) =>{

       }
       const normFile = (e) => {
          console.log('Upload event:', e);

          if (Array.isArray(e)) {
            return e;
          }

          return e?.fileList;
        };
       const onCheckBoxChange= (e) => {
        console.log('checked = ', e.target.checked);
        setRemotePosition(e.target.checked);
      };
       const onFinish = (formData) => {
             const hide = message.loading('Loading', 0);
              API.post('/saveJobDetails',formData)
                  .then(response=>{
                     setTimeout(hide, 0);
                    if(response.data.status){
                         navigate('/jobOpenings');
                      }else{
                          message.error(response.data.message);
                      }
                      
                  });

          };
       const onFinishFailed = (errorInfo) => {
            console.log('Failed:', errorInfo);
          };
        return (
              <>
                <Body>
                  <Row>
                      <Col span={20} offset={2}>
                        
                         <Card>
                           <h2>Post a Job</h2>
                           {loading ?  <Skeleton />:
                             <Form form={form} disabled={formDisabled} initialValues={{ no_of_positions: 1, date_opened: moment(new Date(), 'YYYY-MM-DD')}} name="job" labelCol={{span: 8}} wrapperCol={{span: 16}} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
                                  
                               <Row>
                                  <Col span={12}>
                                      <Form.Item label="Posting Title" name="posting_title" rules={[ { required: true, message: 'Posting Title is required!' }]}  >
                                        <Input />
                                      </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                      <Form.Item label="Department" name="department_id" rules={[ { required: true, message: 'Department is required!' }]}  >
                                        <Select placeholder="Select Department" onChange={onDepartmentChange} allowClear>
                                          {departments.map((deparment) => (
                                                    <Select.Option key={deparment.id} value={deparment.id}>{deparment.name}</Select.Option>
                                           ))}
                                            
                                          </Select>
                                      </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                      <Form.Item label="Job Title" name="job_title" rules={[ { required: true, message: 'Job Title is required!' }]}  >
                                        <Input />
                                      </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                      <Form.Item label="Hiring Manager" name="manager_id" rules={[ { required: true, message: 'Manager Details is required!' }]}  >
                                        <Select placeholder="Select Manager" onChange={onManagerChange} allowClear>
                                          {managers.map((manager) => (
                                                    <Select.Option key={manager.id} value={manager.id}>{manager.name}</Select.Option>
                                           ))}
                                            
                                          </Select>
                                      </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                      <Form.Item label="Recruiters" name="assigned_recruiter_ids" rules={[ { required: true, message: 'Please select atleast one recruiter!' }]}  >
                                        <Select mode="multiple" placeholder="Select Recruiters" onChange={onRecruiterChange} allowClear >
                                          {recruiters.map((recruiter) => (
                                                    <Select.Option key={recruiter.id} value={recruiter.id}>{recruiter.name}</Select.Option>
                                           ))}
                                            
                                          </Select>
                                      </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                      <Form.Item label="Number of Position" name="no_of_positions" rules={[ { required: true, message: 'No. of position should be greater than zero(0)!' }]}  >
                                        <InputNumber  min="1" />
                                      </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                      <Form.Item label="Target Date" name="target_date" rules={[ { required: true, message: 'Target Date is required!' }]}  >
                                        <DatePicker  />
                                      </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                      <Form.Item label="Date Opened"  name="date_opened" rules={[ { required: true, message: 'Date Opened is required!' }]}  >
                                        <DatePicker />
                                      </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                      <Form.Item label="Job Status" name="job_status_id" rules={[ { required: true, message: 'Job Status is required!' }]}  >
                                        <Select  placeholder="Select Job Status" onChange={onStatusChange} allowClear >
                                          {statusList.map((status) => (
                                                    <Select.Option key={status.id} value={status.id}>{status.name}</Select.Option>
                                           ))}
                                            
                                          </Select>
                                      </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                      <Form.Item label="Job Type" name="job_type_id" rules={[ { required: true, message: 'Job Type is required!' }]}  >
                                        <Select  placeholder="Select Job Type" onChange={onTypeChange} allowClear >
                                          {jobTypes.map((jobType) => (
                                                    <Select.Option key={jobType.id} value={jobType.id}>{jobType.name}</Select.Option>
                                           ))}
                                            
                                          </Select>
                                      </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                      <Form.Item label="Work Experience" name="experience_id" rules={[ { required: true, message: 'Work Experience is required!' }]}  >
                                        <Select placeholder="Select Work Experience" onChange={onExperienceChange} allowClear >
                                          {workExperiences.map((workExperience) => (
                                                    <Select.Option key={workExperience.id} value={workExperience.id}>{workExperience.name}</Select.Option>
                                           ))}
                                            
                                          </Select>
                                      </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                      <Form.Item label="Salary" name="salary" rules={[ { required: true, message: 'Salary is required!' }]}  >
                                        <InputNumber  min="1" />
                                      </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                      <Form.Item label="Skill Sets" name="skillset_ids" rules={[ { required: true, message: 'Please select atleast one skill!' }]}  >
                                        <Select  mode="multiple" placeholder="Select Skill Sets" onChange={onSkillChange} allowClear >
                                          {skillSets.map((skill) => (
                                                    <Select.Option key={skill.id} value={skill.id}>{skill.name}</Select.Option>
                                           ))}
                                            
                                          </Select>
                                      </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                  </Col>
                                  <Col span={12}>
                                      <Form.Item name="is_remotePosition"  wrapperCol={{ offset: 8, span: 16 }} valuePropName="checked">
                                        <Checkbox onChange={onCheckBoxChange} >Remote Job</Checkbox>
                                      </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                  </Col>
                                   <Col span={12}>
                                   { (!is_remotePosition)  && (
                                 
                                      <Form.Item label="City" name="city" rules={[ { required: true, message: 'City is required!' }]}  >
                                        <Input />
                                      </Form.Item>
                                       )}
                                  </Col>
                                  { (!is_remotePosition )  && (
                                  <Col span={12}>
                                      <Form.Item label="State" name="state" rules={[ { required: true, message: 'State is required!' }]}  >
                                        <Input />
                                      </Form.Item>
                                  </Col>
                                  )}
                                   <Col span={24} style={{'height':'250px'}} >
                                      <Form.Item label="Job Description"  name="description" labelCol={{span: 4}} wrapperCol={{span: 20}} rules={[ { required: true, message: 'Job Description is required!' }]}>
                                           <ReactQuill theme="snow" value={descriptions} onChange={setDescription} style={{'height':'200px'}} />
                                      </Form.Item>
                                  </Col>
                                  <Col span={24} style={{'height':'250px'}} >
                                      <Form.Item label="Requirements"  name="requirements" labelCol={{span: 4}} wrapperCol={{span: 20}} rules={[ { required: true, message: 'Requirements is required!' }]}>
                                           <ReactQuill theme="snow" value={requirements} onChange={setRequirements} style={{'height':'200px'}} />
                                      </Form.Item>
                                  </Col>
                                  <Col span={24} style={{'height':'250px'}} >
                                      <Form.Item label="Benefits"  name="benefits" labelCol={{span: 4}} wrapperCol={{span: 20}} rules={[ { required: true, message: 'Benifits is required!' }]}>
                                           <ReactQuill theme="snow" value={benefits} onChange={setBenefits} style={{'height':'200px'}} />
                                      </Form.Item>
                                  </Col>
                                  <Col span={24}  >

                                      {/*<Form.Item
                                        name="attachment"
                                        label="Attachment"
                                        valuePropName="fileList"
                                        getValueFromEvent={normFile}
                                        labelCol={{span: 4}} wrapperCol={{span: 8}}
                                      >
                                        <Upload name="files" action={uploadURL} listType="picture"  maxCount={1}>
                                          <Button icon={<UploadOutlined />}>Click to upload</Button>
                                        </Upload>
                                      </Form.Item>*/}
                                      <Form.Item label="Attachment"  labelCol={{span: 4}} wrapperCol={{span: 12}}>
                                        <Form.Item name="attachment" valuePropName="fileList" getValueFromEvent={normFile} noStyle >
                                          <Upload.Dragger name="files" action={uploadURL} listType="picture"  maxCount={1}>
                                            <p className="ant-upload-drag-icon">
                                              <InboxOutlined />
                                            </p>
                                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                          </Upload.Dragger>
                                        </Form.Item>
                                      </Form.Item>

                                  </Col>
                               </Row>

                                <Form.Item wrapperCol={{offset: 6,span: 16}}>
                                  <Button type="primary" htmlType="submit" className="float-end" style={{'borderRadius':'5px'}} size={'Default'} shape="round">
                                    Submit
                                  </Button>
                                </Form.Item>
                              </Form> }
                          </Card>
                      </Col>
                    </Row>
                </Body>
              </>
          )

}


const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, {})(JobForm)