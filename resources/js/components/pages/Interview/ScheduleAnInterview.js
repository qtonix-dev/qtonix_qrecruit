import React, { useEffect,useState } from 'react';
import { connect } from 'react-redux';
import Body from "../components/Body";
import axios from 'axios';
import moment from 'moment';
import { TimePicker, Radio, Button, Checkbox, Form, Input,Col, Row,Card,Select,InputNumber,DatePicker,Upload ,message,RangePicker,Timeline,Skeleton,Rate  } from 'antd';
import API from "../../api/API";
import cookie from 'react-cookies';
import { useNavigate } from 'react-router-dom';
import { UploadOutlined,PlusOutlined,InboxOutlined,DeleteOutlined} from '@ant-design/icons';

export const CreateCandidate = (props) => {
    const navigate = useNavigate();    
    const [form] = Form.useForm();
    const [interviewTypes, setInterviewTypes] = useState([]);
    const [interviewers, setInterviewers] = useState([]);
    const [jobOpenings, setJobOpenings] = useState([]);
    const [candidates,setCandidates]= useState([]);
    const [loading, setLoading] = useState(false);
    var formDisabled = false;
    const userDetails=cookie.load('userDetails');
     const verifyAccess=(section, action)=>{
       return Object.keys(userDetails.access).indexOf(section)>=0 && Object.values(userDetails.access)[Object.keys(userDetails.access).indexOf(section)].includes(action);
    }
    useEffect(() => {
         if(!userDetails){
           navigate(API.defaults.frontURL+'/login');
         }
         if(!verifyAccess('Candidates','Add')){
           navigate(API.defaults.frontURL+'/401');
         }
         setLoading(true);
        formDisabled=true;
        const hide = message.loading('Loading', 0);
                 
         API.post('/getMetadataForInterviewForm',{'user_id':userDetails.id})
                    .then(response=>{
                         formDisabled=false; 
                          setTimeout(hide, 0);
                        if(response.data.status){
                           setInterviewTypes(response.data.interviewTypes);
                           setInterviewers(response.data.interviewers);
                           setJobOpenings(response.data.jobs);
                           setCandidates(response.data.candidates);
                           setLoading(false);
                        }else{
                          message.error(response.data.message);
                        }
                        
                    });

    }, [])

    const onFinish = (formData) => {
        console.log(formData);
        formData.user_id=userDetails.id;
        API.post('/scheduleAnInterview',formData)
              .then(response=>{
                  if(response.data.status){
                      message.success('Interview has been scheduled');
                       //Modal.destroyAll();
                       
                       navigate(API.defaults.frontURL+'/scheduledInterviews');
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
                            <h2>Schedule an Interview</h2>

                             {loading ?  
                             <Skeleton /> :
                                  <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}  disabled={formDisabled} autoComplete="off">
                                      <Row>
                                        <Col  span={16}>
                                           <Form.Item label="Candidate" labelCol={{span: 6}} wrapperCol={{span: 14}}  name="candidate_id" rules={[ { required: true, message: 'Please select a candidate' }]}  >
                                              <Select  placeholder="Select Candidate"  >
                                                {candidates.map((candidate) => (
                                                          <Select.Option key={candidate.id} value={candidate.id}>{candidate.name} - {candidate.current_job_title} </Select.Option>
                                                 ))}
                                                  
                                                </Select>
                                            </Form.Item> 
                                       </Col>
                                        <Col  span={12}>
                                           <Form.Item label="Interview Type" labelCol={{span: 8}} wrapperCol={{span: 14}}  name="interview_type" rules={[ { required: true, message: 'Please select a interview type' }]}  >
                                              <Select  placeholder="Select Interview Type"  >
                                                {interviewTypes.map((type) => (
                                                          <Select.Option key={type.id} value={type.id}>{type.name}</Select.Option>
                                                 ))}
                                                  
                                                </Select>
                                            </Form.Item> 
                                       </Col>
                                       <Col  span={12}>
                                          <Form.Item label="Job Title" labelCol={{span: 8}} wrapperCol={{span: 14}} name="posting_title" rules={[ { required: true, message: 'Please select a job title' }]} >
                                              <Select placeholder="Job Title">
                                                  {jobOpenings.map((job) => (
                                                              <Select.Option key={job.id} value={job.id}>{job.posting_title}</Select.Option>
                                                     ))}
                                              </Select>
                                          </Form.Item>
                                       </Col>
                                       <Col span={12}>
                                          <Form.Item label="Start time" labelCol={{span: 8}} wrapperCol={{span: 14}} name="start_time" rules={[ { required: true, message: 'Please select the start time!' }]}  >
                                              <DatePicker placeholder="Start Date Time" showTime />
                                        </Form.Item>
                                      </Col>
                                      <Col span={12}>
                                          <Form.Item label="End time" labelCol={{span: 8}} wrapperCol={{span: 14}} name="end_time" rules={[ { required: true, message: 'Please select the end time!' }]}  >
                                              <TimePicker placeholder="End Time"  />
                                        </Form.Item>
                                      </Col>
                                      <Col span={24}>
                                           <Form.Item label="Interviewers" labelCol={{span: 4}} wrapperCol={{span: 14 }} name="interviewers" rules={[ { required: true, message: 'Please select atleast one interviewer!' }]}  >
                                                <Select mode="multiple" placeholder="Select interviewers" >
                                                  {interviewers.map((recruiter) => (
                                                            <Select.Option key={recruiter.id} value={recruiter.id}>{recruiter.name}</Select.Option>
                                                   ))}
                                                
                                                </Select>
                                            </Form.Item>
                                      </Col>
                                      <Col span={12}>
                                           <Form.Item label="Location" labelCol={{span: 8}} wrapperCol={{span: 14}} name="location" rules={[ { required: true, message: 'Please type the interview location' }]}  >
                                              <Input />
                                          </Form.Item>
                                      </Col>
                                      <Col span={24}>
                                          <Form.Item name="interview_notes" label="Notes" labelCol={{span: 4}} wrapperCol={{span: 20}} >
                                            <Input.TextArea  />
                                          </Form.Item>
                                       </Col>
                                        
                                    </Row>
                                    <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                                        <Button type="primary" htmlType="submit" className="float-end" style={{ 'borderRadius': '5px' }} size={'Default'} shape="round">
                                            Submit
                                        </Button>
                                    </Form.Item>
                                  </Form>
                              }
                        </Card>
                    </Col>
                </Row>
            </Body>
        </>
    )
}

const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, {})(CreateCandidate)