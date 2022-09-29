import React, { useEffect,useState,useRef  } from 'react';
import { connect } from 'react-redux';
import Body from "../components/Body";
import { Select,DatePicker, TimePicker, Modal,Tooltip, Button, Checkbox, Form, Input,Col, Row, Card, Table, message, Divider,Skeleton,Popconfirm,Rate,Statistic   } from 'antd';
import { AiOutlinePlus,AiOutlineEdit,AiFillDelete } from "react-icons/ai";
import { ReloadOutlined,StarFilled,SearchOutlined,UndoOutlined,EyeFilled,StopOutlined,CheckCircleOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom';
import API from "../../api/API";
import cookie from 'react-cookies';
import { useNavigate } from 'react-router-dom';
import Highlighter from 'react-highlight-words';
import moment from 'moment';

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; 
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

const onChange = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra);
};
export const ScheduledInterviewsCalender = (props) => {
  const navigate = useNavigate(); 
    const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [candidateStages, setCandidateStages] = useState([]);
  const [interviewList, setInterviewList]= useState([]);
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');


    const [interviewTypes, setInterviewTypes] = useState([]);
    const [interviewers, setInterviewers] = useState([]);
    const [jobOpenings, setJobOpenings] = useState([]);

const rescheduleInterview=(id)=>{

    let interviewDetails= interviewList.find(o => o.id == id);
    interviewDetails.start_time=moment(new Date(interviewDetails.start_time), 'DD-MM-YYYY hh:mm:ss');
    interviewDetails.end_time=moment(new Date(interviewDetails.end_time), 'DD-MM-YYYY hh:mm:ss');
    interviewDetails.interview_notes="";
/*
    form.setFieldsValue(interviewDetails);*/
  Modal.confirm({
              title: 'Reschedule Interview',
              width:'900px',
              content: (
                <><Form form={form} initialValues={interviewDetails} >
                      <Row>
                       <Col span={12}>
                          <Form.Item label="Start time" labelCol={{span: 8}} wrapperCol={{span: 14}} name="start_time" rules={[ { required: true, message: 'Please select the start time!' }]}  >
                              <DatePicker  showTime />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                          <Form.Item label="End time" labelCol={{span: 8}} wrapperCol={{span: 14}} name="end_time" rules={[ { required: true, message: 'Please select the end time!' }]}  >
                              <DatePicker  showTime    />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                          <Form.Item name="interview_notes" label="Notes" labelCol={{span: 4}} wrapperCol={{span: 20}} >
                            <Input.TextArea  />
                          </Form.Item>
                       </Col>
                        
                    </Row>
                  </Form>
                </>
              ),

                onOk(e) {
                 
                  form.validateFields().then((values) => {
                    console.log(values);
                      API.post('/rescheduleInterview',{ 'user_id':userDetails.id,
                                                        'start_time': form.getFieldValue('start_time'),
                                                        'end_time': form.getFieldValue('end_time'),
                                                        'interview_notes':form.getFieldValue('interview_notes'),
                                                        'interview_id': id })
                        .then(response=>{
                            if(response.data.status){
                                message.success('Interview has been rescheduled');
                                 Modal.destroyAll();
                              }else{
                                message.error(response.data.message);
                              }
                              

                        });
                        return true;
                    }).catch((err) => {

                        console.log(err);
                        return false;
                      });
                },

                onCancel() {console.log('modal cancelled');},
            });
}
const completeInterview=(id)=>{
      const hide = message.loading('changing status', 0);
      API.post('/completeInterview',{'user_id':userDetails.id,'interview_id':id})
                  .then(response=>{
                     setTimeout(hide, 0);
                    if(response.data.status){
                      setInterviewList(response.data.interviewList.map(row => ({
                                  key: row.id,
                                  id: row.id,
                                  title: row.candidate_name,
                                  candidate_name: row.candidate_name,
                                  candidate_id: row.candidate_id,
                                  interviewer_names:row.interviewer_names,
                                  interviewers:row.interviewers.split(', ').map(item => parseInt(item)),
                                  interview_type:row.interview_type,
                                  posting_id:row.posting_id,
                                  start_time:row.start_time,
                                  start:new Date(row.start_time),
                                  end_time:row.end_time,
                                  end:new Date(row.end_time),
                                  interview_type_name:row.interview_type_name,
                                  job_title:row.job_title,
                                  location:row.location,
                                  interview_notes:row.interview_notes,
                                  status:row.status
                                })));
                    }    
                  });

  }
const cancelInterview=(id)=>{
      const hide = message.loading('changing status', 0);
      API.post('/cancelInterview',{'user_id':userDetails.id,'interview_id':id})
                  .then(response=>{
                     setTimeout(hide, 0);
                    if(response.data.status){
                      setInterviewList(response.data.interviewList.map(row => ({
                                  key: row.id,
                                  id: row.id,
                                  title: row.candidate_name,
                                  candidate_name: row.candidate_name,
                                  candidate_id: row.candidate_id,
                                  interviewer_names:row.interviewer_names,
                                  interviewers:row.interviewers.split(', ').map(item => parseInt(item)),
                                  interview_type:row.interview_type,
                                  posting_id:row.posting_id,
                                  start_time:row.start_time,
                                  start:new Date(row.start_time),
                                  end_time:row.end_time,
                                  end:new Date(row.end_time),
                                  interview_type_name:row.interview_type_name,
                                  job_title:row.job_title,
                                  location:row.location,
                                  interview_notes:row.interview_notes,
                                  status:row.status
                                })));
                    }    
                  });

  }
  const openCreateInterview=function(){
    
     Modal.confirm({
              title: 'Schedule Interview',
              width:'900px',
              content: (
                <><Form form={form} >
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
                            <Form.Item label="Job Title" labelCol={{span: 8}} wrapperCol={{span: 14}} name="posting_id" rules={[ { required: true, message: 'Please select a job title' }]} >
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
                  </Form>
                </>
              ),

                onOk(e) {
                 
                  form.validateFields().then((formData) => {
                    console.log(formData);
                            formData.user_id=userDetails.id;
                      API.post('/scheduleAnInterview',formData)
                        .then(response=>{
                            if(response.data.status){
                                message.success('Interview has been scheduled');
                                 Modal.destroyAll();
                              }else{
                                message.error(response.data.message);
                              }
                              

                        });
                        return true;
                    }).catch((err) => {

                        console.log(err);
                        return false;
                      });
                },

                onCancel() {console.log('modal cancelled');},
            });




  }

  const handleEventClick=function(arg){
     console.log(arg);
     let interviewDetails= interviewList.find(o => o.id == arg.event.id);
    interviewDetails.start_time=moment(new Date(interviewDetails.start_time), 'DD-MM-YYYY hh:mm:ss');
    interviewDetails.end_time=moment(new Date(interviewDetails.end_time), 'DD-MM-YYYY hh:mm:ss');
  /*interviewDetails.interviewers=interviewDetails.interviewers.split(', ');
    interviewDetails.interviewers=interviewDetails.interviewers.map(item => parseInt(item));*/
     Modal.confirm({
              title: 'Schedule Interview',
              width:'900px',
              content: (
                <><Form form={form} initialValues={interviewDetails}>
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
                            <Form.Item label="Job Title" labelCol={{span: 8}} wrapperCol={{span: 14}} name="posting_id" rules={[ { required: true, message: 'Please select a job title' }]} >
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
                  </Form>
                </>
              ),

                onOk(e) {
                 
                  form.validateFields().then((formData) => {
                    console.log(formData);
                            formData.user_id=userDetails.id;
                            
                            formData.interview_id=arg.event.id;
                      API.post('/updateInterviewDetails',formData)
                        .then(response=>{
                            if(response.data.status){
                                message.success('Interview details has been updated');
                                 Modal.destroyAll();
                              }else{
                                message.error(response.data.message);
                              }
                              

                        });
                        return true;
                    }).catch((err) => {

                        console.log(err);
                        return false;
                      });
                },

                onCancel() {console.log('modal cancelled');},
            });




  }
  const handleDateClick=function(arg){
    console.log(arg);
    let interviewDetails= {};
    interviewDetails.start_time=moment(new Date(arg.dateStr), 'DD-MM-YYYY hh:mm:ss');

    Modal.confirm({
              title: 'Schedule Interview',
              width:'900px',
              content: (
                <><Form form={form} initialValues={interviewDetails}>
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
                  </Form>
                </>
              ),

                onOk(e) {
                 
                  form.validateFields().then((formData) => {
                    console.log(formData);
                            formData.user_id=userDetails.id;
                      API.post('/scheduleAnInterview',formData)
                        .then(response=>{
                            if(response.data.status){
                                message.success('Interview has been scheduled');
                                 Modal.destroyAll();
                              }else{
                                message.error(response.data.message);
                              }
                              

                        });
                        return true;
                    }).catch((err) => {

                        console.log(err);
                        return false;
                      });
                },

                onCancel() {console.log('modal cancelled');},
            });
  }
  const userDetails=cookie.load('userDetails');

     const verifyAccess=(section, action)=>{
       return Object.keys(userDetails.access).indexOf(section)>=0 && Object.values(userDetails.access)[Object.keys(userDetails.access).indexOf(section)].includes(action);
    }
        useEffect(() => {
         if(!userDetails){
           navigate(API.defaults.frontURL+'/login');
         }
         if(!verifyAccess('Scheduled Interviews','View')){
           navigate(API.defaults.frontURL+'/401');
         }
        const hide = message.loading('Loading', 0);
        setLoading(true);
            API.post('/getScheduledInterviewLists',{user_id:userDetails.id})
                  .then(response=>{
                    setLoading(false);
                     setTimeout(hide, 0);
                    if(response.data.status){

                           setInterviewTypes(response.data.interviewTypes);
                           setInterviewers(response.data.interviewers);
                           setJobOpenings(response.data.jobs);
                           setCandidates(response.data.candidates);


                         setInterviewList(response.data.interviewList.map(row => ({
                                  key: row.id,
                                  id: row.id,
                                  title: row.candidate_name,
                                  candidate_name: row.candidate_name,
                                  candidate_id: row.candidate_id,
                                  interviewer_names:row.interviewer_names,
                                  interviewers:row.interviewers.split(', ').map(item => parseInt(item)),
                                  interview_type:row.interview_type,
                                  posting_id:row.posting_id,
                                  start_time:row.start_time,
                                  start:new Date(row.start_time),
                                  end_time:row.end_time,
                                  end:new Date(row.end_time),
                                  interview_type_name:row.interview_type_name,
                                  job_title:row.job_title,
                                  location:row.location,
                                  interview_notes:row.interview_notes,
                                  status:row.status
                                })));
                      }
                      
                  });
        }, [])
        return (
              <>
                <Body>
                  <h2>Scheduled Interviews</h2>
                   <Divider orientation="right">
                    {verifyAccess('Scheduled Interviews','Add')?
                    
                        <Button type="primary" onClick={()=>openCreateInterview()} shape="round" icon={<AiOutlinePlus style={{'marginTop':'-5%'}}/>} size={'Default'}> <span style={{'marginLeft':'5px'}}>Schedule an Interview</span>
                        </Button>
                    :''}
                   </Divider>
                    {loading ?  <Skeleton />: 
                      <>
                         <Row>
                             <Col span={20} offset={2}>
                                  <FullCalendar
                                          defaultView="dayGridMonth"
                                          header={{
                                            left: "prev,next today",
                                            center: "title",
                                            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
                                          }}
                                          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                          weekends={true}
                                          events={interviewList}
                                          dateClick={(arg)=>handleDateClick(arg)}
                                          eventClick={(arg)=>handleEventClick(arg)}
                                          eventLimit={3}
                                        />
                            </Col>
                        </Row>
                  </>
                }
                </Body>
              </>
          )

}


const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, {})(ScheduledInterviewsCalender)