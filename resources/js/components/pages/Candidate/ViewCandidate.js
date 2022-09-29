import React, { useEffect,useState } from 'react';
import { connect } from 'react-redux';
import Body from "../components/Body";
import axios from 'axios';
import moment from 'moment';
import {Popconfirm, Table, Modal, Image, Collapse ,Tabs,Tooltip,TimePicker, Avatar,List,Comment, Drawer , Divider, Radio, Button, Checkbox, Form, Input,Col, Row,Card,Select,InputNumber,DatePicker,Upload ,message,RangePicker,Timeline,Skeleton,Rate,Descriptions  } from 'antd';
import API from "../../api/API";
import cookie from 'react-cookies';
import { useNavigate ,useSearchParams} from 'react-router-dom';
import { AiOutlinePlus,AiOutlineEdit,AiFillDelete } from "react-icons/ai";
import {CheckCircleOutlined,StopOutlined, ReloadOutlined , CaretRightOutlined,ExclamationCircleOutlined, FormOutlined, UploadOutlined,PlusOutlined,InboxOutlined,DeleteOutlined,StarFilled,DownloadOutlined,StarOutlined,EditOutlined,FileDoneOutlined,FileProtectOutlined, EditFilled,CalendarOutlined,UserSwitchOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom';

export const ViewCandidate = (props) => {
    const [params, setParams] = useSearchParams();
    const [noteDrawer, setNoteDrawer] = useState(false);
    const [logDrawer, setLogDrawer] = useState(false);
    const [uploadedFile, setUploadedFile] = useState([]);
    const uploadDraggerChange=(e)=>{
        console.log(e);
        if(e.fileList.length && e.fileList[0].response){
          /* API.post('/updateResumeForCandidate',{ 'id':params.get("id"),
             'filenametostore':e.fileList[0].response.filenametostore,
             'originalFileName':e.fileList[0].response.originalFileName,
             'user_id':cookie.load('userDetails').id  }).then(response=>{});*/
             setUploadedFile(e.fileList);
      }
    }
  
    const showNoteDrawer = () => {
        setNoteDrawer(true);
      };
      const showLogDrawer = () => {
        setLogDrawer(true);
      };
      const onNoteClose = () => {
        setNoteDrawer(false);
      };
       const onLogClose = () => {
        setLogDrawer(false);
      };

      
      const [form] = Form.useForm();
    const navigate = useNavigate();   
     const [fileList, setFileList] = useState([ ]);
    const [departments, setDepartments] = useState([]);
    const [candidateDetails, setCandidateDetails] = useState({});
    const [attachmentList, setAttachmentList] = useState([]);
    const [candidateStages, setCandidateStages] = useState([]);
    const [candidateSources, setCandidateSources] = useState([]);
    const [jobOpenings, setJobOpenings] = useState([]);
    const [candidateStatus, setCandidateStatus] = useState([]);
    const [educationDetails, setEducationDetails] = useState([{'institute':'',department:'',degree:'',duration:['',''], currently_persuring:false}]);
    const [experienceDetails, setExperienceDetails] = useState([{'title':'',company:'',summary:'',duration:['',''], currently_working:false}]);
    const [skillSets, setSkillSets] = useState([]);
    const [candidateStage, setCandidateStage] = useState(0);
    const [canidateSkills, setCanidateSkills] = useState([]);
    const [candidateStageName, setCandidateStageName] = useState('');
    const [recruiters, setRecruiters] = useState([]);
    const [notes, setNotes] = useState([]);
    const [callLogs, setCallLogs] = useState([]);
    const [candidateReviews, setCandidateReviews] = useState([]);
    const [candidateTimeline, setCandidateTimeline] = useState([]);
    const [noteTypes, setNoteTypes] = useState([]);
    const [interviewTypes, setInterviewTypes] = useState([]);
    const [interviewers, setInterviewers] = useState([]);
    const [currentTab, setCurrentTab] = useState(1);

    const [loading, setLoading] = useState(false);
    const [appliedFor, setAppliedFor] = useState([]);
    const uploadURL=API.defaults.baseURL+"uploadTempAttachments";

    const [checking_email, setCheckingMail] = useState(false);
    const [hasEmailFeedback, setHasEmailFeedback] = useState(false);
    const [email_exists, setEmailExists] = useState(false);
    const [noteType, setNoteType] = useState('');


    const [interviewList, setInterviewList]= useState([]);
    const [checking_phone, setCheckingPhone] = useState(false);
    const [hasPhoneFeedback, setHasPhoneFeedback] = useState(false);
    const [phone_exists, setPhoneExists] = useState(false);

    
    
       const optionsForRadio = [
          { label: 'Beginner', value: 'Beginner' },
          { label: 'Intermediate', value: 'Intermediate' },
          { label: 'Expert', value: 'Expert' },
        ];
    
    
    var formDisabled = false;
    const userDetails=cookie.load('userDetails');
    const handleTabChange=(value)=>{
      setCurrentTab(value);
    }


     const verifyAccess=(section, action)=>{
       return Object.keys(userDetails.access).indexOf(section)>=0 && Object.values(userDetails.access)[Object.keys(userDetails.access).indexOf(section)].includes(action);
    }
     const normFile = (e) => {
      //console.log('Upload event:', e);

          if (Array.isArray(e)) {
            return e;
          }
          //console.log(e.fileList);
          
          return e?.fileList;
      }; 
      const getShortName=(str)=>{
        var matches = str.match(/\b(\w)/g);
            return matches.join('').substring(0,2);
      }
    const updateTimeline=(data)=>{
       setCandidateTimeline(data.map(row => ({
                                  key: row.id,
                                  name: row.name,
                                  value: row.value,
                                  type: row.type,
                                  datetime:(<span>{moment(row.created_at).fromNow()}</span>)
                                })));
    }
    const statusConfig = {
              title: 'Change Status',
              width:'700px',
              content: (
                <><Form initialValues={{
                          status: candidateDetails.candidate_status,
                          prefix: '86',
                        }}>
                      <Row>
                        <Col  span={24}>
                          <Form.Item name="status" label="Status" labelCol={{span: 4}} wrapperCol={{span: 20}}>
                              <Select placeholder="Candidate Status"  onChange={value=>{cookie.save('newStatus', value);}} >
                                 {candidateStatus.map((status) => (
                                              <Select.Option key={status.id} value={status.id}>{status.name}</Select.Option>
                                     ))}
                              </Select>
                          </Form.Item>
                       </Col>
                    </Row>
                  </Form>
                </>
              ),

                onOk() {
                      API.post('/changeStatusOfCandidate',{'candidate_id':cookie.load('candidateId'),'status': cookie.load('newStatus'),'user_id':userDetails.id})
                    .then(response=>{
                       message.success('Candidate status changed.');
                       updateTimeline(response.data.candidateTimelines);
                    });

                        return true;
                },

                onCancel() {console.log('modal cancelled');},
            };
         const editStatus = ()=> (
               Modal.confirm(statusConfig)
          );  
    const onLogFinish = (formData) => {
           formData.user_id=userDetails.id;
           formData.candidate_id=candidateDetails.id;
           let todayDate= new Date();

                      var start_time_temp=new Date(form.getFieldValue('start_time'));
                      var end_time_temp=new Date(form.getFieldValue('end_time'));


            formData.start_time=start_time_temp.setMinutes(start_time_temp.getMinutes() - todayDate.getTimezoneOffset());
            formData.end_time=end_time_temp.setMinutes(end_time_temp.getMinutes() - todayDate.getTimezoneOffset());

           form.resetFields();
         API.post('/addCallLogsToCandidate',formData)
              .then(response=>{
                 
                  if(response.data.status){
                    message.success('Call log has been added');
                    setCallLogs(response.data.call_logs.map(row => ({
                                  key: row.id,
                                  id: row.id,
                                  user_id: row.user_id,
                                  author: row.name,
                                  content: row.start_time+' - '+row.end_time,
                                  datetime:(<span>{moment(row.created_at).fromNow()}</span>),
                                  start_date:row.start_date,
                                  end_date:row.end_date,
                                  created_at:row.created_at
                                })));
                    setCandidateTimeline(response.data.candidateTimelines.map(row => ({
                                  key: row.id,
                                  name: row.name,
                                  value: row.value,
                                  type: row.type,
                                  secondary_value: row.secondary_value,
                                  note_type_name:row.note_type_name,
                                  datetime:(<span>{moment(row.created_at).fromNow()}</span>)
                                })));
                   
                  }else{
                    message.error(response.data.message);
                  }
                  
              });

      };
        const onAttachmentFinish=() =>{
           form.resetFields();
      /* API.post('/updateResumeForCandidate',{ 'id':params.get("id"),
             'filenametostore':e.fileList[0].response.filenametostore,
             'originalFileName':e.fileList[0].response.originalFileName,
             'user_id':cookie.load('userDetails').id  }).then(response=>{});*/

       API.post('/updateAttachmentsForCandidate',{ 'id': params.get("id"),
             'uploadedFiles':uploadedFile,
             'user_id':cookie.load('userDetails').id  }).then(response=>{
               if(response.data.status){
                   setCandidateTimeline(response.data.candidateTimelines.map(row => ({
                                  key: row.id,
                                  name: row.name,
                                  value: row.value,
                                  type: row.type,
                                  secondary_value: row.secondary_value,
                                  note_type_name:row.note_type_name,
                                  datetime:(<span>{moment(row.created_at).fromNow()}</span>)
                                })));
                   setAttachmentList(response.data.candidateAttachements.map(row => ({
                                  key: row.id,
                                  id: row.id,
                                  batch: row.batch,
                                  file_obj:row.file_obj,
                                  user_name: row.user_name,
                                  user_id: row.user_id,
                                  file: row.file,
                                  file_name: row.file_name,
                                  created_at:(<span>{moment(row.created_at).fromNow()}</span>)
                                })));
                message.success('Attachment has been uploaded.');
               }else{
                   message.error(response.data.message);
              }
             });
    }
    const onRatingFinish= (formData) => {
           formData.user_id=userDetails.id;
           formData.candidate_id=candidateDetails.id;
           form.resetFields();



         API.post('/addRatingReviewForCandidate',formData)
          .then(response=>{
             
              if(response.data.status){
                message.success('Rating has been added');
                setCandidateReviews(response.data.candidateReviews.map(row => ({
                              key: row.id,
                              id: row.id,
                              author: row.name,
                              rating: row.rating,
                              user_id: row.user_id,
                              reviews: row.reviews,
                              datetime:(<span>{moment(row.created_at).fromNow()}</span>)
                            })));
                 setCandidateTimeline(response.data.candidateTimelines.map(row => ({
                                  key: row.id,
                                  name: row.name,
                                  value: row.value,
                                  type: row.type,
                                  secondary_value: row.secondary_value,
                                  note_type_name:row.note_type_name,
                                  datetime:(<span>{moment(row.created_at).fromNow()}</span>)
                                })));
              }else{
                message.error(response.data.message);
              }
              
          });

      };
    const onNoteFinish = (formData) => {
           formData.user_id=userDetails.id;
           formData.candidate_id=candidateDetails.id;
           form.resetFields();
         API.post('/addNotesToCandidate',formData)
              .then(response=>{
                 
                  if(response.data.status){
                    message.success('Note has been added');
                    setNotes(response.data.candidate_notes.map(row => ({
                                  key: row.id,
                                  author: row.name,
                                  content: row.notes+(row.note_type_name?' ('+row.note_type_name+')':'' ),
                                  datetime:(<span>{moment(row.created_at).fromNow()}</span>),
                                  note_type:row.note_type,
                                  notes:row.notes,
                                  user_id:row.user_id
                                })));
                     setCandidateTimeline(response.data.candidateTimelines.map(row => ({
                                  key: row.id,
                                  name: row.name,
                                  value: row.value,
                                  type: row.type,
                                  secondary_value: row.secondary_value,
                                  note_type_name:row.note_type_name,
                                  datetime:(<span>{moment(row.created_at).fromNow()}</span>)
                                })));
                  }else{
                    message.error(response.data.message);
                  }
                  
              });

      };
       const columns = [
  
         {
          title: 'Job title',
          dataIndex: 'posting_title',
          sorter: {
            compare: (a, b) => a.posting_title - b.posting_title,
            
          },
        },
        {
          title: 'Applied on',
          dataIndex: 'applied_date',
          sorter: {
            compare: (a, b)  => new Date(a.applied_date) - new Date(b.applied_date)
          },


        }
    ];



      const showAppliedJobs= () => {
        Modal.info({
          title: 'Associated Job Openings',
           width:'700px',
          content: (
            <div>
              <Table columns={columns} dataSource={appliedFor} />
            </div>
          ),
          onOk() {},
        });
      };
      const showConfirmSubmission = () => {
          Modal.confirm({
            title: 'Do you want to submit the candidate to Manager?',
            icon: <ExclamationCircleOutlined />,
            content: '',
            onOk() {
              API.post('/submitCandidateToManager',{'candidate_id':cookie.load('candidateId'),'user_id':userDetails.id,'manager_id':userDetails.manager_id})
                    .then(response=>{
                      message.success('Candidate submitted to Manager.');
                       setCandidateTimeline(response.data.candidateTimelines.map(row => ({
                                  key: row.id,
                                  name: row.name,
                                  value: row.value,
                                  type: row.type,
                                  secondary_value: row.secondary_value,
                                  note_type_name:row.note_type_name,
                                  datetime:(<span>{moment(row.created_at).fromNow()}</span>)
                                })));
                    });

                        return true;
            },
            onCancel() {
              console.log('Cancel');
            },
          });
        };


        
       
      const showInterviewScheduleModal=()=>{
          Modal.confirm({
              title: 'Schedule Interview',
              width:'900px',
              content: (
                <><Form form={form}>
                      <Row>
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
                              <DatePicker  showTime />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                          <Form.Item label="End time" labelCol={{span: 8}} wrapperCol={{span: 14}} name="end_time" rules={[ { required: true, message: 'Please select the end time!' }]}  >
                              <TimePicker   />
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
                 
                  form.validateFields().then((values) => {
                    console.log(values);
                      API.post('/scheduleAnInterview',{'user_id':userDetails.id,
                                                        'candidate_id':cookie.load('candidateId'),
                                                        'interview_notes': form.getFieldValue('interview_notes'),
                                                        'interview_type': form.getFieldValue('interview_type'),
                                                        'posting_title': form.getFieldValue('posting_title'),
                                                        'location': form.getFieldValue('location'),
                                                        'start_time': form.getFieldValue('start_time'),
                                                        'end_time': form.getFieldValue('end_time'),
                                                        'interviewers': form.getFieldValue('interviewers') })
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


 const interviewColumns = [
  
   
 
  {
    title: 'Type',
    dataIndex: 'interview_type_name',
    sorter: {
      compare: (a, b) => a.interview_type_name.localeCompare(b.interview_type_name),
    },
  },
  {
    title: 'Job Title',
    dataIndex: 'job_title',
    sorter: {
      compare: (a, b) => a.job_title.localeCompare(b.job_title),
    },
  },
  {
    title: 'Interviewer Names',
    dataIndex: 'interviewer_names',
    sorter: {
      compare: (a, b) => a.interviewer_names.localeCompare(b.interviewer_names),
    },
  },
  {
    title: 'Start Date & Time',
    dataIndex: 'start_time',
    sorter: {
      compare: (a, b)  => new Date(a.start_time) - new Date(b.start_time)
      
    },
  },
   {
    title: 'End Date & Time',
    dataIndex: 'end_time',
    sorter: {
      compare: (a, b)  => new Date(a.end_time) - new Date(b.end_time)
      
    },
  },
   {
    title: 'Status',
    dataIndex: 'status',
    sorter: {
      compare: (a, b)  => new Date(a.status) - new Date(b.status)
      
    },
  },
   {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (data) =>(<>  
                              
                               {verifyAccess('Scheduled Interviews','Edit')?
                                <> 
                                  <Tooltip title="Edit Interview Details">
                                    <Link to={API.defaults.frontURL+`/editInterview?id=${data.id}`}>
                                    <AiOutlineEdit style={{'marginRight':'10px'}}/>
                                  </Link> </Tooltip> 
                                 <Tooltip title="Reschedule Interview">
                                      <ReloadOutlined  onClick={()=>rescheduleInterview(data.id)} style={{'verticalAlign':'0px','marginRight':'10px','cursor':'pointer','color':'green'}}/> 
                                 </Tooltip>
                                  <Tooltip title="Complete Interview">
                                    <Popconfirm title="Do you want to mark complete this interview?" onConfirm={()=>completeInterview(data.id)}>
                                     <CheckCircleOutlined  style={{'verticalAlign':'0px','marginRight':'10px','cursor':'pointer','color':'green'}}/> 
                                    </Popconfirm> 
                                 </Tooltip>
                                </>
                                :''  }
                               
                           {verifyAccess('Scheduled Interviews','Delete')?
                             <Tooltip title="Cancel Interview">
                              <Popconfirm title="Are you sure to delete?" onConfirm={()=>cancelInterview(data.id)}>
                                 <StopOutlined  style={{'verticalAlign':'0px','cursor':'pointer','color':'red'}}/> 
                              </Popconfirm> 
                             </Tooltip>
                            :''  }
                       </>),
    },
];

const completeInterview=(id)=>{
      const hide = message.loading('changing status', 0);
      API.post('/completeInterview',{'user_id':userDetails.id,'candidate_id':cookie.load('candidateId'),'interview_id':id})
                  .then(response=>{
                     setTimeout(hide, 0);
                    if(response.data.status){
                      setInterviewList(response.data.interviewList.map(row => ({
                                  key: row.id,
                                  id: row.id,
                                  candidate_name: row.candidate_name,
                                  interviewer_names:row.interviewer_names,
                                  start_time:row.start_time,
                                  end_time:row.end_time,
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
      API.post('/cancelInterview',{'user_id':userDetails.id,'candidate_id':cookie.load('candidateId'),'interview_id':id})
                  .then(response=>{
                     setTimeout(hide, 0);
                    if(response.data.status){
                      setInterviewList(response.data.interviewList.map(row => ({
                                  key: row.id,
                                  id: row.id,
                                  candidate_name: row.candidate_name,
                                  interviewer_names:row.interviewer_names,
                                  start_time:row.start_time,
                                  end_time:row.end_time,
                                  interview_type_name:row.interview_type_name,
                                  job_title:row.job_title,
                                  location:row.location,
                                  interview_notes:row.interview_notes,
                                  status:row.status
                                })));
                    }    
                  });

  }

const editReview=(id)=>{

    let candidateReview= candidateReviews.find(o => o.id == id);
    let tempCurrentTab=currentTab;
     setCurrentTab(0);
  Modal.confirm({
              title: 'Edit',
              width:'700px',
              content: (
                <> <Form  form={form} name="edit-ratings" initialValues={candidateReview} autoComplete="off">
                      <Row>
                       <Col  span={24}>
                          <Form.Item name="rating" label="Rating" labelCol={{span: 6}} wrapperCol={{span: 16}}>
                            <Rate />
                          </Form.Item>
                       </Col>
                       
                        <Col  span={24} >
                            <Form.Item labelCol={{span: 6}} wrapperCol={{span: 16}} label="Review" name="reviews"   >
                              <Input.TextArea />
                            </Form.Item>
                        </Col>
                          
                      </Row>
                  </Form>
                </>
              ),

                onOk(e) {
                   console.log(form);
                  form.validateFields().then((values) => {
                    console.log(values);
                      API.post('/updateExistingRating',{ 'user_id':userDetails.id,
                                                          'rating':form.getFieldValue('rating'),
                                                          'reviews':form.getFieldValue('reviews'),
                                                          'rating_id': candidateReview.id })
                        .then(response=>{
                            if(response.data.status){
                                message.success('Rating has been updated');

                                 
                     
                                setCandidateDetails(response.data.candidate_details);

                                setCandidateReviews(response.data.candidateReviews.map(row => ({
                                          key: row.id,
                                          id: row.id,
                                          author: row.name,
                                          rating: row.rating,
                                          user_id: row.user_id,
                                          reviews: row.reviews,
                                          datetime:(<span>{moment(row.created_at).fromNow()}</span>)
                                        })));
                                 setCandidateTimeline(response.data.candidateTimelines.map(row => ({
                                            key: row.id,
                                            name: row.name,
                                            value: row.value,
                                            type: row.type,
                                            secondary_value: row.secondary_value,
                                            note_type_name:row.note_type_name,
                                            datetime:(<span>{moment(row.created_at).fromNow()}</span>)
                                          })));
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

                onCancel() {   setCurrentTab(tempCurrentTab); form.resetFields();console.log('modal cancelled');},
            });
}
const editNotes=(id)=>{

    let noteDetails= notes.find(o => o.id == id);
    let tempCurrentTab=currentTab;
     setCurrentTab(0);
  Modal.confirm({
              title: 'Edit',
              width:'700px',
              content: (
                <> <Form  form={form} name="edit-notes" initialValues={noteDetails} autoComplete="off">
                      <Row>
                        <Col  span={12}>
                           <Form.Item label="Note Type" labelCol={{span: 6}}  wrapperCol={{span:18}}  name="note_type" rules={[ { required: true, message: 'Please select a note type' }]}  >
                              <Select  placeholder="Select Note Type"  >
                                {noteTypes.map((type) => (
                                          <Select.Option key={type.id} value={type.id}>{type.name}</Select.Option>
                                 ))}
                                  
                                </Select>
                            </Form.Item> 
                       </Col>
                          <Col span={24} >
                              <Form.Item labelCol={{span: 3}} wrapperCol={{span:21}}  label="Edit Note" name="notes" rules={[{ required: true, message: 'Notes is required!' }]}  >
                                      <Input.TextArea />
                              </Form.Item>
                          </Col>
                          
                      </Row>
                  </Form>
                </>
              ),

                onOk(e) {
                   console.log(form);
                  form.validateFields().then((values) => {
                    console.log(values);
                      API.post('/updateNotesOfCandidate',{ 'user_id':userDetails.id,
                                                          'note_type':form.getFieldValue('note_type'),
                                                          'notes':form.getFieldValue('notes'),
                                                          'note_id': noteDetails.id })
                        .then(response=>{
                            if(response.data.status){
                                message.success('Note has been updated');
                                setNotes(response.data.candidate_notes.map(row => ({
                                              key: row.id,
                                              author: row.name,
                                              content: row.notes+(row.note_type_name?' ('+row.note_type_name+')':'' ),
                                              datetime:(<span>{moment(row.created_at).fromNow()}</span>),
                                              note_type:row.note_type,
                                              notes:row.notes,
                                              user_id:row.user_id
                                            })));
                                 setCandidateTimeline(response.data.candidateTimelines.map(row => ({
                                            key: row.id,
                                            name: row.name,
                                            value: row.value,
                                            type: row.type,
                                            secondary_value: row.secondary_value,
                                            note_type_name:row.note_type_name,
                                            datetime:(<span>{moment(row.created_at).fromNow()}</span>)
                                          })));
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

                onCancel() {  setCurrentTab(tempCurrentTab);  form.resetFields(); console.log('modal cancelled');},
            });
}
const editAttachments=(batch)=>{
   
  let attachmentDetails= attachmentList.find(o => o.batch == batch);
//  console.log(attachmentDetails.file_obj);
   attachmentDetails.fileList=  attachmentDetails.file_obj.map(row => ({
                                            key: row.name,
                                            name: row.name,
                                            file: row.url,
                                            url: API.defaults.publicURL+row.url,
                                            file_name: row.name
                                          }));

  console.log(attachmentDetails);

   setFileList(attachmentDetails.fileList);
    let tempCurrentTab=currentTab;
     
     setCurrentTab(0);
      Modal.confirm({
              title: 'Edit',
              width:'900px',
              content: (
                <> <Form  form={form} name="edit-attachments" initialValues={attachmentDetails} autoComplete="off">
                      <Row>
                         <Col span={24}>
                              <Form.Item label=""  wrapperCol={{span: 24}}>
                                  <Form.Item name="fileList" valuePropName="fileList" defaultFileList={[...fileList]} getValueFromEvent={normFile} noStyle >
                                    <Upload.Dragger name="files" action={uploadURL} multiple={true} listType="picture"  onChange={event => uploadDraggerChange(event)}>
                                      <p className="ant-upload-drag-icon">
                                        <InboxOutlined />
                                      </p>
                                      <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                    </Upload.Dragger>
                                  </Form.Item>
                                </Form.Item>

                            </Col>
                         
                      </Row>
                  </Form>
                </>
              ),

                onOk(e) {
                   //console.log(form);
                  form.validateFields().then((values) => {
                    //console.log(values.fileList);
                    //return;

                      API.post('/updateExistingAttachmentsForCandidate',{ 'user_id':userDetails.id,
                                                            'candidate_id':candidateDetails.id,
                                                            'batch':attachmentDetails.batch,
                                                            'attachment_id': attachmentDetails.id,
                                                            'uploadedFiles': values.fileList })
                        .then(response=>{
                            if(response.data.status){
                                message.success('Attachment has been updated');
                                setAttachmentList(response.data.candidateAttachements.map(row => ({
                                                  key: row.batch,
                                                  batch: row.batch,
                                                  user_name: row.user_name,
                                                  user_id: row.user_id,
                                                  file_obj:row.file_obj,
                                                  file: row.file,
                                                  file_name: row.file_name,
                                                  created_at:(<span>{moment(row.created_at).fromNow()}</span>)
                                                })));
                                 setCandidateTimeline(response.data.candidateTimelines.map(row => ({
                                            key: row.id,
                                            name: row.name,
                                            value: row.value,
                                            type: row.type,
                                            secondary_value: row.secondary_value,
                                            note_type_name:row.note_type_name,
                                            datetime:(<span>{moment(row.created_at).fromNow()}</span>)
                                          })));
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

                onCancel() {  setCurrentTab(tempCurrentTab);  form.resetFields(); console.log('modal cancelled');},
            });
}
const editCallLog=(id)=>{

    let callLogDetails= callLogs.find(o => o.id == id);
    let tempCurrentTab=currentTab;
    callLogDetails.start_time=moment(new Date(callLogDetails.start_date), 'DD-MM-YYYY hh:mm:ss');
    callLogDetails.end_time=moment(new Date(callLogDetails.end_date), 'DD-MM-YYYY hh:mm:ss');
    console.log(callLogDetails);
    console.log(id);
     setCurrentTab(0);
  Modal.confirm({
              title: 'Edit',
              width:'700px',
              content: (
                <> <Form  form={form} name="edit-calllogs" initialValues={callLogDetails} autoComplete="off">
                      <Row>
                        <Col span={12} >
                            <Form.Item labelCol={{span: 24}} wrapperCol={{span: 24}} label="Start time" name="start_time" rules={[{type: 'object',required: true,message: 'Please select time!',},]}  >
                                    <TimePicker />
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item labelCol={{span: 24}} wrapperCol={{span: 24}} label="End time" name="end_time" rules={[{type: 'object',required: true,message: 'Please select time!',},]}  >
                                    <TimePicker />
                            </Form.Item>
                        </Col>
                          
                      </Row>
                  </Form>
                </>
              ),

                onOk(e) {
                   console.log(form);
                  form.validateFields().then((values) => {
                    console.log(values);
                    let todayDate= new Date();

                      var start_time_temp=new Date(form.getFieldValue('start_time'));
                      var end_time_temp=new Date(form.getFieldValue('end_time'));


            start_time_temp.setMinutes(start_time_temp.getMinutes() - todayDate.getTimezoneOffset());
           end_time_temp.setMinutes(end_time_temp.getMinutes() - todayDate.getTimezoneOffset());

                      API.post('/updateCallLogOfCandidate',{ 'user_id':userDetails.id,
                                                            'start_time':start_time_temp,
                                                            'end_time':end_time_temp,
                                                            'log_id': callLogDetails.id })
                        .then(response=>{
                            if(response.data.status){
                                message.success('Call Log has been updated');
                                setCallLogs(response.data.call_logs.map(row => ({
                                            key: row.id,
                                            id: row.id,
                                            user_id: row.user_id,
                                            author: row.name,
                                            content: row.start_time+' - '+row.end_time,
                                            datetime:(<span>{moment(row.created_at).fromNow()}</span>),
                                            created_at:row.created_at,
                                            start_date:row.start_date,
                                            end_date:row.end_date,
                                          })));
                                 setCandidateTimeline(response.data.candidateTimelines.map(row => ({
                                            key: row.id,
                                            name: row.name,
                                            value: row.value,
                                            type: row.type,
                                            secondary_value: row.secondary_value,
                                            note_type_name:row.note_type_name,
                                            datetime:(<span>{moment(row.created_at).fromNow()}</span>)
                                          })));
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

                onCancel() {  setCurrentTab(tempCurrentTab);  form.resetFields(); console.log('modal cancelled');},
            });
}
const rescheduleInterview=(id)=>{

    let interviewDetails= interviewList.find(o => o.id == id);
    interviewDetails.start_time=moment(new Date(interviewDetails.start_time), 'DD-MM-YYYY hh:mm:ss');
    interviewDetails.end_time=moment(new Date(interviewDetails.end_time), 'DD-MM-YYYY hh:mm:ss');
    interviewDetails.interview_notes="";

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

   const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
         form.validateFields().then((values) => {
                    console.log(values);
                     
                    }).catch((err) => {

                        console.log(err);
                      });
      };
    useEffect(() => {
         if(!userDetails){
           navigate(API.defaults.frontURL+'/login');
         }
         if(!verifyAccess('Candidates','View')){
           navigate(API.defaults.frontURL+'/401');
         }
         setLoading(true);
        formDisabled=true;
        const hide = message.loading('Loading', 0);
        API.post('/getCandidateDetailsForEdit',{'id':params.get("id"),'user_id':userDetails.id})
              .then(response=>{
                 formDisabled=false; 
                setTimeout(hide, 0);

                if(response.data.status){
                    
                    let tempCandidateDetails=response.data.candidate_details;
                        tempCandidateDetails.candidate_stage_name=response.data.candidateStageLists.findIndex(o => o.id === tempCandidateDetails.stage)>-1?response.data.candidateStageLists.find(o => o.id === tempCandidateDetails.stage).name:'';
                        tempCandidateDetails.candidate_status_name=response.data.candidateStatusLists.findIndex(o => o.id === tempCandidateDetails.candidate_status)>-1?response.data.candidateStatusLists.find(o => o.id === tempCandidateDetails.candidate_status).name:'';
                        tempCandidateDetails.candidate_source_name=response.data.candidateSourceLists.findIndex(o => o.id === tempCandidateDetails.source)>-1?response.data.candidateSourceLists.find(o => o.id === tempCandidateDetails.source).name:'';
                        tempCandidateDetails.candidate_owner_name=response.data.recruiters.findIndex(o => o.id === tempCandidateDetails.candidate_owner)>-1?response.data.recruiters.find(o => o.id === tempCandidateDetails.candidate_owner).name:'';
                        //tempCandidateDetails.candidate_stage=tempCandidateDetails.candidate_stage.stage;
                        tempCandidateDetails.resume_file=[];
                     if(tempCandidateDetails.resume){
                         tempCandidateDetails.resume_file=[{'name':tempCandidateDetails.resume_name,'url':API.defaults.publicURL+tempCandidateDetails.resume}];
                        setFileList(tempCandidateDetails.resume_file);
                      }
                      setCandidateDetails(tempCandidateDetails);
                     tempCandidateDetails.education_details.map(education=>{
                         education.duration=[
                                                     moment(new Date(education.start_year+'-01-01'), 'YYYY'),
                                                     moment(new Date(education.end_year+'-01-01'), 'YYYY')
                                              ];
                     })
                     tempCandidateDetails.experience_details.map(experience=>{
                         experience.duration=[
                                                     moment(new Date(experience.start_year+'-'+(experience.start_month-1)+'-01'), 'YYYY-MM'),
                                                     moment(new Date(experience.end_year+'-'+(experience.end_month-1)+'-01'), 'YYYY-MM')
                                              ];
                     })
                     //console.log(tempCandidateDetails);
                      cookie.save('candidateId', tempCandidateDetails.id);

                      setEducationDetails(tempCandidateDetails.education_details);
                      setExperienceDetails(tempCandidateDetails.experience_details);
                      setNotes(response.data.candidate_notes.map(row => ({
                                  key: row.id,
                                  id: row.id,
                                  author: row.name,
                                  content: row.notes+(row.note_type_name?' ('+row.note_type_name+')':'' ),
                                  datetime:(<span>{moment(row.created_at).fromNow()}</span>),
                                  note_type:row.note_type,
                                  notes:row.notes,
                                  user_id:row.user_id
                                })));
                      setCallLogs(response.data.call_logs.map(row => ({
                                  key: row.id,
                                  id: row.id,
                                  user_id: row.user_id,
                                  author: row.name,
                                  content: row.start_time+' - '+row.end_time,
                                  datetime:(<span>{moment(row.created_at).fromNow()}</span>),
                                  start_date:row.start_date,
                                  end_date:row.end_date,
                                  created_at:row.created_at
                                })));
                    //form.setFieldsValue(response.data.candidate_details);
                    setCanidateSkills(response.data.candidate_details.candidate_skills);
                    /*setAppliedFor(response.data.candidate_details.appliedFor);*/
                     setAppliedFor(response.data.candidate_details.appliedFor.map(row => ({
                                  key: row.id,
                                  posting_title: row.posting_title,
                                  applied_date:row.applied_date
                                })));
                    setCandidateReviews(response.data.candidateReviews.map(row => ({
                                  key: row.id,
                                  id: row.id,
                                  author: row.name,
                                  rating: row.rating,
                                  user_id: row.user_id,
                                  reviews: row.reviews,
                                  datetime:(<span>{moment(row.created_at).fromNow()}</span>)
                                })));
                     setCandidateTimeline(response.data.candidateTimelines.map(row => ({
                                  key: row.id,
                                  name: row.name,
                                  value: row.value,
                                  type: row.type,
                                  secondary_value: row.secondary_value,
                                  note_type_name:row.note_type_name,
                                  datetime:(<span>{moment(row.created_at).fromNow()}</span>)
                                })));
                    setSkillSets(response.data.skillSets);
                    setNoteTypes(response.data.noteTypes);
                    setInterviewTypes(response.data.interviewTypes);
                    setRecruiters(response.data.recruiters);
                    setCandidateStatus(response.data.candidateStatusLists);
                    setCandidateSources(response.data.candidateSourceLists);
                    setCandidateStages(response.data.candidateStageLists);
                    setDepartments(response.data.departments);
                    setJobOpenings(response.data.jobs);
                    setInterviewers(response.data.interviewers);
                    
                    setAttachmentList(response.data.candidateAttachements.map(row => ({
                                  key: row.batch,
                                  batch: row.batch,
                                  user_id: row.user_id,
                                  file_obj:row.file_obj,
                                  user_name: row.user_name,
                                  file: row.file,
                                  file_name: row.file_name,
                                  created_at:(<span>{moment(row.created_at).fromNow()}</span>)
                                })));
                    setNoteType(response.data.noteTypes.length>0?response.data.noteTypes[0].id:'');
                    //console.log(response.data.noteTypes.length>0?response.data.noteTypes[0].id:'');

                     setInterviewList(response.data.interviewList.map(row => ({
                                  key: row.id,
                                  id: row.id,
                                  candidate_name: row.candidate_name,
                                  interviewer_names:row.interviewer_names,
                                  start_time:row.start_time,
                                  end_time:row.end_time,
                                  interview_type_name:row.interview_type_name,
                                  job_title:row.job_title,
                                  location:row.location,
                                  interview_notes:row.interview_notes,
                                  status:row.status
                                })));

                    setLoading(false);
               
                }
                  
              });

    }, [])

    return (

        <>
            <Body>
                {loading ?  
                 <Skeleton /> :
                     <> 
                    <Row className="">
                        <Col span={22} offset={1}> 
                     <Card>
                    <Row className="candidate-details">
                        <Col span={2} offset={1}>
                             <div style={{textAlign:'center'}}>
                                 <Avatar className="name-avatar" size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }} style={{fontSize:'24px !important', 'backgroundColor': ((candidateDetails.rating > 3) ? '#1dca1d' : ((candidateDetails.rating ==3) ? '#cdcd1c' : 'red'))}}>{candidateDetails.name?getShortName(candidateDetails.name.toUpperCase()):''}</Avatar>
                                 <br/><span> {candidateDetails.rating+'.0'} <StarOutlined style={{verticalAlign:1}}/></span>
                             </div>
                        </Col>
                        <Col span={6} style={{padding: '1%',fontSize: '24px'}} >
                             <Row>
                                <Col span={24} > 
                                 {candidateDetails.name}
                                 </Col>
                            </Row>
                            <Row>
                               
                                <Col span={3} > 
                                 <Tooltip title="Download Resume" > <a href={API.defaults.publicURL+candidateDetails.resume} download  style={{margin: '0px 10px'}}><FileDoneOutlined style={{verticalAlign:3}}/></a></Tooltip>
                                </Col>
                                 <Col span={21} style={{padding: '0px 3px'}}> 
                                     <Tooltip title="Edit Status"><Button type="primary" size={'small'} shape="round" style={{padding: '0px 10px'}} onClick={()=>editStatus()}>{candidateDetails.candidate_status_name} </Button> </Tooltip>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={4} style={{marginLeft:'auto'}}  >
                            <Row >
                                <Col span={6} style={{maxWidth:'25%'}}> 
                                       <Link to={API.defaults.frontURL+`/editCandidate?id=${candidateDetails.id}`}><Tooltip title="Edit Details"> <Button type="primary" size={'small'} icon={<EditFilled style={{verticalAlign:0}}/>} shape="round" style={{padding: '0px 10px','width':'40px','height':'40px'}} /></Tooltip></Link>
                                </Col>
                                <Col span={6} style={{maxWidth:'25%'}}> 
                                      <Tooltip title="Associate Job Openings"><Button type="primary" size={'small'} icon={<FileProtectOutlined style={{verticalAlign:0}}/>} shape="round" style={{padding: '0px 10px','width':'40px','height':'40px'}}  onClick={()=>showAppliedJobs()} /></Tooltip>
                                </Col>
                                {userDetails.manager_id==0?'':
                                    <Col span={6} style={{maxWidth:'25%'}}> 
                                          <Tooltip title="Submit to Hiring Manager"><Button type="primary" size={'small'}  icon={<UserSwitchOutlined style={{verticalAlign:0}}/>}  shape="round" style={{padding: '0px 10px','width':'40px','height':'40px'}} onClick={()=>showConfirmSubmission()}/></Tooltip>
                                    </Col>
                               }
                                {verifyAccess('Scheduled Interviews','Add')?
                                <Col span={6} style={{maxWidth:'25%'}}> 
                                      <Tooltip title="Schedule Interview"><Button type="primary" size={'small'} icon={<CalendarOutlined style={{verticalAlign:0}}/>}  shape="round" style={{padding: '0px 10px','width':'40px','height':'40px'}} onClick={() => showInterviewScheduleModal()  }/></Tooltip> 
                                </Col>:''}
                            </Row>
                        </Col>
                       
                        <Col span={22} offset={1} >

                            <Tabs defaultActiveKey="1">
                                <Tabs.TabPane tab="Overview" key="1">
                                    <Card>
                                        <Descriptions
                                            bordered
                                            title="Business Card"
                                            size="small"
                                             column={{
                                                      xxl: 2,
                                                      xl: 2,
                                                      lg: 2,
                                                      md: 2,
                                                      sm: 2,
                                                      xs: 1,
                                                    }}
                                          >
                                            <Descriptions.Item label="Origin">{candidateDetails.candidate_source_name}</Descriptions.Item>
                                            <Descriptions.Item label="Mobile">{candidateDetails.mobileNo}</Descriptions.Item>
                                            <Descriptions.Item label="Alt. Mobile">{candidateDetails.altMobileNo}</Descriptions.Item>
                                            <Descriptions.Item label="Email">{candidateDetails.email}</Descriptions.Item>
                                            <Descriptions.Item label="Exp. in Year(s)">{candidateDetails.exp_in_year}</Descriptions.Item>
                                            <Descriptions.Item label="Current Job Title">{candidateDetails.current_job_title}</Descriptions.Item>
                                            <Descriptions.Item label="Current Employer">{candidateDetails.current_employer}</Descriptions.Item>
                                            <Descriptions.Item label="Skill Set"> {canidateSkills.map((skill,index) => (<span key={index}>{skill.name+' ('+skill.stage+')'}{index!=(skillSets.length-1)?', ':''}</span>))}</Descriptions.Item>
                                          </Descriptions>
                                    </Card>
                                    <Collapse
                                        bordered={false}
                                        defaultActiveKey={['0']}
                                        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                                        className="site-collapse-custom-collapse"
                                      >
                                      <Collapse.Panel header="Details" key="1" className="site-collapse-custom-panel">
                                          <Card style={{border: '1px solid #ffffff'}}>
                                            <Row >
                                                <Col span={24}><h4 style={{marginBottom:'2%'}}>Basic info </h4></Col>
                                                <Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                    <label>Email: </label> <span>{candidateDetails.email}</span>
                                                </Col>
                                                <Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                    <label>Mobile: </label> <span>{candidateDetails.mobileNo}</span>{candidateDetails.altMobileNo?<span>, {candidateDetails.altMobileNo}</span>:''}
                                                </Col>
                                            </Row> 
                                            <Row>
                                                <Col span={24}><h4 style={{marginBottom:'2%'}}>Address </h4></Col>
                                                <Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                    <label>Street: </label> <span>{candidateDetails.street}</span>
                                                </Col>
                                                <Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                    <label>City: </label> <span>{candidateDetails.city}</span>
                                                </Col>
                                                <Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                    <label>State: </label> <span>{candidateDetails.state}</span>
                                                </Col>
                                                <Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                    <label>Zip: </label> <span>{candidateDetails.zip_code}</span>
                                                </Col>
                                                <Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                    <label>Country: </label> <span>{candidateDetails.country}</span>
                                                </Col>

                                            </Row>

                                                <Row>
                                                    <Col span={24}><h4 style={{marginBottom:'2%'}}>Professional Details </h4></Col>
                                                    <Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                        <label>Experience in Year(s): </label> <span>{candidateDetails.exp_in_year}</span>
                                                    </Col>
                                                    <Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                        <label>Highest Qualif. Held: </label> <span>{candidateDetails.highest_qualification}</span>
                                                    </Col>
                                                    <Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                        <label>Current Job Title: </label> <span>{candidateDetails.current_job_title}</span>
                                                    </Col>
                                                    <Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                        <label>Current Employer: </label> <span>{candidateDetails.current_employer}</span>
                                                    </Col>
                                                    <Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                        <label>Current Salary: </label> <span>{candidateDetails.current_salary}</span>
                                                    </Col>
                                                    <Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                        <label>Expected Salary: </label> <span>{candidateDetails.expected_salary}</span>
                                                    </Col>
                                                    <Col span={22} offset={2} style={{marginBottom:'1%'}}>
                                                        <label>Skill Sets: </label> <span> {canidateSkills.map((skill,index) => (<span key={index}>{skill.name+' ('+skill.stage+')'}{index!=(skillSets.length-1)?', ':''}</span>))}</span>
                                                    </Col>

                                                </Row>
                                                <Row>
                                                    <Col span={24}><h4 style={{marginBottom:'2%'}}>Other info </h4></Col>
                                                    <Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                        <label>Candidate Stage: </label> <span>{candidateDetails.candidate_stage_name}</span>
                                                    </Col>
                                                    <Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                        <label>Candidate Status: </label> <span>{candidateDetails.candidate_status_name}</span>
                                                    </Col>
                                                    <Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                        <label>Candidate Source: </label> <span>{candidateDetails.candidate_source_name}</span>
                                                    </Col>
                                                    <Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                        <label>Candidate Owner: </label> <span>{candidateDetails.candidate_owner_name}</span>
                                                    </Col>
                                                    
                                                    <Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                        <label>Reviews: </label> <span>{candidateDetails.rejection_reason}</span>
                                                    </Col>

                                                </Row>
                                                <Row >
                                                 <Col span={24}><h4 style={{marginBottom:'3%'}}>Education Details </h4></Col>
                                                    <Col span={18} offset={2} style={{marginBottom:'3%'}}>
                                                        
                                                              <Timeline >
                                                                    {educationDetails.map((education,index) => (
                                                                        <Timeline.Item key={index} dot={<img src={API.defaults.publicURL+"/images/icons/"+(index+1)+".png"} style={{ width: '75%','height':'auto' }}/>} style={{'padding':'10px'}}>
                                                                            <Row  style={{ 'marginLeft':'10%'}}>
                                                                                <Col span={12} style={{marginBottom:'1%'}}>
                                                                                    <label>Institute/Schools : </label><span> {education.institute}</span>
                                                                                </Col>
                                                                                <Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                                                    <label>Major/Department : </label><span> {education.department}</span>
                                                                                </Col>
                                                                                <Col span={12} style={{marginBottom:'1%'}}>
                                                                                    <label>Degree : </label><span> {education.degree}</span>
                                                                                </Col>
                                                                                <Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                                                    <label>Duration : </label><span> {education.start_year}-{education.end_year}</span>    
                                                                                </Col>
                                                                                {education.currently_persuring?
                                                                                    <Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                                                        <Checkbox  checked disabled/> <span> Currently Pursuing</span> 
                                                                                    </Col>
                                                                                :''}
                                                                                
                                                                            </Row>
                                                                        </Timeline.Item>
                                                                        ))}
                                                                    </Timeline>
                                                         
                                                    </Col>

                                                </Row>
                                                 <Row >
                                                  <Col span={24}><h4 style={{marginBottom:'3%'}}>Experience Details </h4></Col>
                                                     <Col span={18} offset={2} style={{marginBottom:'3%'}}>
                                                 
                                                      <Timeline >
                                                            {experienceDetails.map((experience,index) => (
                                                                <Timeline.Item key={index} dot={<img src={API.defaults.publicURL+"/images/icons/"+(index+1)+".png"} style={{ width: '75%','height':'auto' }}/>} style={{'padding':'10px'}}>
                                                                    <Row  style={{ 'marginLeft':'10%'}}>
                                                                        <Col span={12} style={{marginBottom:'1%'}}>
                                                                            <label>Occupation/Title : </label><span> {experience.title}</span>
                                                                        </Col>
                                                                        <Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                                            <label>Company : </label><span> {experience.company}</span>
                                                                        </Col>
                                                                        <Col span={12} style={{marginBottom:'1%'}}>
                                                                            <label>Summary : </label><span> {experience.summary}</span>
                                                                        </Col>
                                                                        <Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                                            <label>Duration : </label><span> {((experience.start_month>10)?experience.start_month:'0'+experience.start_month)+'-'+experience.start_year} to {((experience.end_month>10)?experience.end_month:'0'+experience.end_month)+'-'+experience.end_year}</span>    
                                                                        </Col>
                                                                        {experience.currently_working?
                                                                            <Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                                                <Checkbox  checked disabled/> <span> Currently Working</span> 
                                                                            </Col>
                                                                        :''}
                                                                        
                                                                    </Row>
                                                                </Timeline.Item>
                                                                ))}
                                                            </Timeline>
                                                           
                                                    </Col>

                                                </Row>
                                                </Card>
                                      </Collapse.Panel>
                                    </Collapse>
                                   
                                      <Tabs defaultActiveKey={1} type="card" style={{marginTop: '3%'}} onChange={(value)=>handleTabChange(value)}>
                                          <Tabs.TabPane tab="Notes"  key={1} >
                                           <Card className="card-container">
                                              <Row style={{padding:'2%'}}>
                                                   <Col span={24} style={{marginBottom:'3%'}}>
                                                   {currentTab==1?
                                                      <Form form={form}  name="notes"   onFinish={onNoteFinish} initialValues={{ note_type: noteType }} onFinishFailed={onFinishFailed} autoComplete="off">
                                                          <Row>
                                                            <Col  span={12}>
                                                               <Form.Item label="Note Type" labelCol={{span: 6}}  wrapperCol={{span:18}}  name="note_type" rules={[ { required: true, message: 'Please select a note type' }]}  >
                                                                  <Select  placeholder="Select Note Type"  >
                                                                    {noteTypes.map((type) => (
                                                                              <Select.Option key={type.id} value={type.id}>{type.name}</Select.Option>
                                                                     ))}
                                                                      
                                                                    </Select>
                                                                </Form.Item> 
                                                           </Col>
                                                              <Col span={24} >
                                                                  <Form.Item labelCol={{span: 3}} wrapperCol={{span:21}}  label="Add Note" name="notes" rules={[{ required: true, message: 'Notes is required!' }]}  >
                                                                          <Input.TextArea />
                                                                  </Form.Item>
                                                              </Col>
                                                              
                                                          </Row>
                                                          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                                                  <Button type="primary" htmlType="submit" className="float-end" style={{ 'borderRadius': '5px' }} size={'Default'} shape="round">
                                                                      Add
                                                                  </Button>
                                                          </Form.Item>
                                                      </Form>
                                                       :''}
                                                      <Divider/>
                                                      <List
                                                          className="comment-list"
                                                          header=""
                                                          itemLayout="horizontal"
                                                          dataSource={notes}
                                                          renderItem={(item) => (
                                                            <li>
                                                              <Comment
                                                                author={item.author}
                                                                avatar={API.defaults.publicURL+"/images/user.png"}
                                                                content={item.content }
                                                                datetime={item.datetime}
                                                                actions={
                                                                  (item.user_id==userDetails.id) ? 
                                                                  [<span  onClick={()=>editNotes(item.id)} style={{marginRight:10,color:'#1890ff',fontSize:12}}> Edit </span> ] 
                                                                  :''
                                                                }
                                                              />
                                                            </li>
                                                          )}
                                                      />
                                                  </Col>
                                                </Row>
                                            </Card>
                                            
                                          </Tabs.TabPane>
                                          <Tabs.TabPane tab="Call Logs"  key={2}>
                                           <Card className="card-container">
                                              <Row style={{padding:'2%'}}>
                                                   <Col span={24} style={{marginBottom:'3%'}}>
                                                   {currentTab==2?
                                                      <Form form={form}  name="callLogs" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}  onFinish={onLogFinish} onFinishFailed={onFinishFailed} autoComplete="off">
                                                          <Row>
                                                              <Col span={12} >
                                                                  <Form.Item labelCol={{span: 24}} wrapperCol={{span: 24}} label="Start time" name="start_time" rules={[{type: 'object',required: true,message: 'Please select time!',},]}  >
                                                                          <TimePicker />
                                                                  </Form.Item>
                                                              </Col>
                                                              <Col span={12} >
                                                                  <Form.Item labelCol={{span: 24}} wrapperCol={{span: 24}} label="End time" name="end_time" rules={[{type: 'object',required: true,message: 'Please select time!',},]}  >
                                                                          <TimePicker />
                                                                  </Form.Item>
                                                              </Col>
                                                               <Col span={24} >
                                                                  <Button type="primary" htmlType="submit" className="float-end" style={{ 'borderRadius': '5px' }} size={'Default'} shape="round">
                                                                      Add
                                                                  </Button>
                                                              </Col>
                                                          </Row>
                                                      </Form>:''}
                                                      <Divider/>
                                                      <List
                                                            className="comment-list"
                                                            header=""
                                                            itemLayout="horizontal"
                                                            dataSource={callLogs}
                                                            renderItem={(item) => (
                                                              <li>
                                                                <Comment
                                                                  author={item.author}
                                                                  avatar={API.defaults.publicURL+"/images/user.png"}
                                                                  content={item.content}
                                                                  datetime={item.datetime}
                                                                  actions={
                                                                    (item.user_id==userDetails.id) ? 
                                                                    [<span  onClick={()=>editCallLog(item.id)} style={{marginRight:10,color:'#1890ff',fontSize:12}}> Edit </span> ] 
                                                                    :''
                                                                  }
                                                                />
                                                              </li>
                                                            )}
                                                          />
                                                  </Col>
                                                </Row>
                                            </Card>
                                            
                                          </Tabs.TabPane>
                                          <Tabs.TabPane tab="Ratings"  key={3}>
                                           <Card className="card-container">
                                              <Row style={{padding:'2%'}}>
                                                   <Col span={24} style={{marginBottom:'3%'}}>
                                                   {currentTab==3?
                                                      <Form form={form}  name="ratings"   onFinish={onRatingFinish} onFinishFailed={onFinishFailed} autoComplete="off">
                                                          <Row>
                                                              <Col  span={24}>
                                                                <Form.Item name="rating" label="Rating" labelCol={{span: 2}} wrapperCol={{span: 20}}  rules={[ { required: true, message: 'Please give a rating' }]}>
                                                                  <Rate />
                                                                </Form.Item>
                                                             </Col>
                                                             
                                                              <Col  span={24} >
                                                                  <Form.Item labelCol={{span:2}} wrapperCol={{span: 24}} label="Reviews" name="rejection_reason"   >
                                                                    <Input.TextArea/>
                                                                  </Form.Item>
                                                              </Col>
                                                               <Col span={24} >
                                                                  <Button type="primary" htmlType="submit" className="float-end" style={{ 'borderRadius': '5px' }} size={'Default'} shape="round">
                                                                      Add
                                                                  </Button>
                                                              </Col>
                                                          </Row>
                                                      </Form>:''}
                                                      <Divider/>
                                                       <List
                                                            className="comment-list"
                                                            header=""
                                                            itemLayout="horizontal"
                                                            dataSource={candidateReviews}
                                                            renderItem={(item) => (
                                                              <li key={item.id}>
                                                                <>
                                                                <Comment
                                                                  author={item.author}
                                                                  avatar={API.defaults.publicURL+"/images/user.png"}
                                                                  content={<Rate disabled key={item.id} defaultValue={item.rating} /> }
                                                                  actions={[item.reviews, (item.user_id==userDetails.id) ?<span  onClick={()=>editReview(item.id)} style={{marginLeft:10,color:'#1890ff',fontSize:12}}> Edit </span>:'']}
                                                                  datetime={item.datetime}
                                                                />
                                                                </>
                                                              </li>
                                                            )}
                                                          />   
                                                  </Col>
                                                </Row>
                                            </Card>
                                            
                                          </Tabs.TabPane>
                                          <Tabs.TabPane tab="Attachments"  key={4} >
                                           <Card className="card-container">
                                              <Row style={{padding:'2%'}}>
                                                   <Col span={24} style={{marginBottom:'3%'}}>
                                                   {currentTab==4?
                                                      <Form form={form}  name="attachments" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}  onFinish={onAttachmentFinish} onFinishFailed={onFinishFailed} autoComplete="off">
                                                          <Row>
                                                             <Col span={16}  offset={4}>
                                                                  <Form.Item label=""  wrapperCol={{span: 24}}>
                                                                      <Form.Item name="resume_file" valuePropName="fileList" defaultFileList={[...fileList]} getValueFromEvent={normFile} noStyle >
                                                                        <Upload.Dragger name="files" action={uploadURL} multiple={true} listType="picture"  onChange={event => uploadDraggerChange(event)}>
                                                                          <p className="ant-upload-drag-icon">
                                                                            <InboxOutlined />
                                                                          </p>
                                                                          <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                                                        </Upload.Dragger>
                                                                      </Form.Item>
                                                                    </Form.Item>

                                                                </Col>
                                                          </Row>
                                                          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                                                  <Button type="primary" htmlType="submit" className="float-end" style={{ 'borderRadius': '5px' }} size={'Default'} shape="round">
                                                                      Add
                                                                  </Button>
                                                          </Form.Item>
                                                      </Form>
                                                      :''}
                                                      <Divider/>
                                                      <List
                                                          className="comment-list"
                                                          header=""
                                                          itemLayout="horizontal"
                                                          dataSource={attachmentList}
                                                          renderItem={(item) => (
                                                            <li key={item.batch}>

                                                              
                                                              <Comment
                                                                  author={item.user_name}
                                                                  avatar={API.defaults.publicURL+"/images/user.png"}
                                                                  content={<>{item.file.map((file,index) => (
                                                                     <Image key={index} src={API.defaults.publicURL+file} style={{'marginBottom':'10px'}}/>
                                                                  ))}</>}
                                                                  datetime={item.created_at}
                                                                   actions={
                                                                      (item.user_id==userDetails.id) ? 
                                                                      [<span  onClick={()=>editAttachments(item.batch)} style={{marginRight:10,color:'#1890ff',fontSize:12}}> Edit </span> ] 
                                                                      :''
                                                                    }
                                                                />
                                                            </li>
                                                          )}
                                                      />
                                                  </Col>
                                                </Row>
                                            </Card>
                                            
                                          </Tabs.TabPane>
                                          <Tabs.TabPane tab="Interviews"  key={5} >
                                           <Card className="card-container" style={{'padding':'0px'}}>
                                              <Row>
                                                 
                                                   <Col span={24} style={{marginBottom:'3%'}}>
                                                      <Table columns={interviewColumns} dataSource={interviewList} />
                                                   </Col>
                                              </Row>
                                            </Card>
                                          </Tabs.TabPane>
                                      </Tabs>
                                 </Tabs.TabPane>
                                 <Tabs.TabPane tab="Timeline" key="2">
                                    <Row style={{padding:'2%'}}>
                                         <Col span={24} style={{marginBottom:'3%'}}>
                                                <Timeline className="comment-list">
                                                            {candidateTimeline.map((item,index) => (
                                                                <Timeline.Item key={index}  style={{ width: '75%','height':'auto' }} >
                                                                  <Comment
                                                                      author={item.name}
                                                                      avatar={API.defaults.publicURL+"/images/user.png"}
                                                                      content={
                                                                                  (item.type=='rating updated' ||item.type=='existing rating updated') ?('updated the ratings to ') 
                                                                                  :item.type=='candidate status updated'? ('status updated to ')
                                                                                  :item.type=='candidate details updated'? ('updated the candidate details')
                                                                                  :item.type=='resume removed'? ('removed the resume') 
                                                                                  :item.type=='resume updated'? ('updated the resume') 
                                                                                  :item.type=='candidate added'? ('added the candidate details')
                                                                                  :item.type=='job added to candidate'? ('job added to candidate details')
                                                                                  :item.type=='candidate submission'? ('submitted candidate details to ')
                                                                                  :item.type=='stage changed'? ('updated the candidate stage to ')
                                                                                  :item.type=='note added'? ('added a note '+(item.note_type_name?'('+item.note_type_name+').':'.' ))
                                                                                  :item.type=='note updated'? ('updated the note '+(item.note_type_name?'('+item.note_type_name+').':'.' ))
                                                                                  :item.type=='call added'? ('added a call.')
                                                                                  :item.type=='call updated'? ('updated the call.')
                                                                                  :item.type=='attachments added'? ('added attachment(s).')
                                                                                  :item.type=='attachments updated'? ('replaced attachment(s).')
                                                                                  :item.type=='interview scheduled'? ('scheduled an inteview on')
                                                                                  :item.type=='interview rescheduled'? ('rescheduled the interview to')
                                                                                  :item.type=='interview cancelled'? ('cancelled the interview.')
                                                                                  :item.type=='interview completed'? ('marked completed the interview.')
                                                                                  :''
                                                                                }
                                                                      actions={[(item.type=='rating updated' ||item.type=='existing rating updated')?(<Rate disabled defaultValue={item.value} /> ) 
                                                                                  :item.type=='candidate status updated'? (item.value)
                                                                                  :item.type=='candidate submission'? (item.value)
                                                                                  :item.type=='stage changed'? (item.value)
                                                                                  :(item.type=='note added' || item.type=='note updated' )? (item.value)
                                                                                  : (item.type=='call added' || item.type=='call updated') ? (item.value)
                                                                                  : (item.type=='interview scheduled' || item.type=='interview rescheduled') ? (item.value)
                                                                                  :'']}
                                                                      datetime={item.datetime}
                                                                    />
                                                                  </Timeline.Item>
                                                                  ))}
                                                    </Timeline>              
                                               
                                        </Col>

                                    </Row>
                                </Tabs.TabPane>
                          </Tabs>
                        
                        </Col>
                    </Row>
                    </Card></Col>
                    </Row>
                    </>
                }
            </Body>
        </>
    )
}

const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, {})(ViewCandidate)