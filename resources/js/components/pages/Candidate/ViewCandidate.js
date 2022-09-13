import React, { useEffect,useState } from 'react';
import { connect } from 'react-redux';
import Body from "../components/Body";
import axios from 'axios';
import moment from 'moment';
import {Table, Modal, Collapse ,Tabs,Tooltip,TimePicker, Avatar,List,Comment, Drawer , Divider, Radio, Button, Checkbox, Form, Input,Col, Row,Card,Select,InputNumber,DatePicker,Upload ,message,RangePicker,Timeline,Skeleton,Rate,Descriptions  } from 'antd';
import API from "../../api/API";
import cookie from 'react-cookies';
import { useNavigate ,useSearchParams} from 'react-router-dom';
import { ExclamationCircleOutlined, FormOutlined, UploadOutlined,PlusOutlined,InboxOutlined,DeleteOutlined,StarFilled,DownloadOutlined,StarOutlined,EditOutlined,FileDoneOutlined,FileProtectOutlined, EditFilled,CalendarOutlined,UserSwitchOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom';

export const ViewCandidate = (props) => {
    const [params, setParams] = useSearchParams();
    const [noteDrawer, setNoteDrawer] = useState(false);
    const [logDrawer, setLogDrawer] = useState(false);
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

    const [loading, setLoading] = useState(false);
    const [appliedFor, setAppliedFor] = useState([]);
    const uploadURL=API.defaults.baseURL+"uploadTempResumeAttachment";

    const [checking_email, setCheckingMail] = useState(false);
    const [hasEmailFeedback, setHasEmailFeedback] = useState(false);
    const [email_exists, setEmailExists] = useState(false);


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
     const verifyAccess=(section, action)=>{
       return Object.keys(userDetails.access).indexOf(section)>=0 && Object.values(userDetails.access)[Object.keys(userDetails.access).indexOf(section)].includes(action);
    }
    
      const getShortName=(str)=>{
        var matches = str.match(/\b(\w)/g);
            return matches.join('').substring(0,2);
      }
    const updateTimeline=(data)=>{
       setCandidateTimeline(response.data.candidateTimelines.map(row => ({
                                  key: row.id,
                                  name: row.name,
                                  value: row.value,
                                  type: row.type,
                                  datetime:(<span>{moment(row.created_at).fromNow()}</span>)
                                })));
    }
    const onLogFinish = (formData) => {
           formData.user_id=userDetails.id;
           formData.candidate_id=candidateDetails.id;
           form.resetFields();
         API.post('/addCallLogsToCandidate',formData)
              .then(response=>{
                 
                  if(response.data.status){
                    message.success('Call log has been added');
                    setCallLogs(response.data.call_logs.map(row => ({
                                  key: row.id,
                                  author: row.name,
                                  content: row.start_time+' - '+row.end_time,
                                  datetime:(<span>{moment(row.created_at).fromNow()}</span>)
                                })));
                    updateTimeline(response.data.candidateTimelines);
                   
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
                                  content: row.notes,
                                  datetime:(<span>{moment(row.created_at).fromNow()}</span>)
                                })));
                     updateTimeline(response.data.candidateTimelines);
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
                       updateTimeline(response.data.candidateTimelines);
                    });
            },
            onCancel() {
              console.log('Cancel');
            },
          });
        };
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
                },

                onCancel() {console.log('modal cancelled');},
            };
         const editStatus = ()=> (
               Modal.confirm(statusConfig)
          );    


       const callLogConfig = {
              title: 'Add Call log',
              width:'700px',
              content: (
                <><Form form={form}>
                       <Row>
                            <Col span={12} >
                                <Form.Item labelCol={{span: 24}} wrapperCol={{span: 24}} label="Start time" name="start_time" rules={[{type: 'object',required: true,message: 'Please select time!',},]}  >
                                        <TimePicker  />
                                </Form.Item>
                            </Col>
                            <Col span={12} >
                                <Form.Item labelCol={{span: 24}} wrapperCol={{span: 24}} label="End time" name="end_time" rules={[{type: 'object',required: true,message: 'Please select time!',},]}  >
                                        <TimePicker/>
                                </Form.Item>
                            </Col>
                        </Row>
                  </Form>
                </>
              ),

                onOk() {
                   /* console.log(form.getFieldValue('start_time'));
                    console.log(new Date(form.getFieldValue('start_time')));
                    return;*/
                    let todayDate= new Date();

                      var start_time_temp=new Date(form.getFieldValue('start_time'));
                      var end_time_temp=new Date(form.getFieldValue('end_time'));


                      start_time_temp=start_time_temp.setMinutes(start_time_temp.getMinutes() - todayDate.getTimezoneOffset());
                      end_time_temp=end_time_temp.setMinutes(end_time_temp.getMinutes() - todayDate.getTimezoneOffset());
                     // console.log(start_time_temp);
                      //console.log(new Date(start_time_temp));

                      API.post('/addCallLogsToCandidate',{'user_id':userDetails.id,'candidate_id':cookie.load('candidateId'),'start_time': new Date(start_time_temp),'end_time':  new Date(end_time_temp)   })
                    .then(response=>{
                         if(response.data.status){
                                message.success('Call log has been added');
                                setCallLogs(response.data.call_logs.map(row => ({
                                              key: row.id,
                                              author: row.name,
                                              content: row.start_time+' - '+row.end_time,
                                              datetime:(<span>{moment(row.created_at).fromNow()}</span>)
                                            })));
                                updateTimeline(response.data.candidateTimelines);
                              }else{
                                message.error(response.data.message);
                              }
                          
                        
                    });
                },

                onCancel() {console.log('modal cancelled');},
            };
            const addLogOption = ()=> (
               <Button type="dashed" size={'small'} shape="round" style={{padding: '0px 10px'}}  onClick={(event) => { Modal.confirm(callLogConfig); event.stopPropagation(); }}>Add Call Log</Button>

          );
      const notesConfig = {
              title: 'Add Notes',
              width:'700px',
              content: (
                <><Form>
                      <Row>
                        <Col  span={24}>
                          <Form.Item name="notes" label="Notes" labelCol={{span: 4}} wrapperCol={{span: 20}}>
                            <Input.TextArea  onChange={e=>{cookie.save('notes', e.target.value);}}/>
                          </Form.Item>
                       </Col>
                        
                    </Row>
                  </Form>
                </>
              ),

                onOk() {
                      API.post('/addNotesToCandidate',{'user_id':userDetails.id,'candidate_id':cookie.load('candidateId'),'notes': cookie.load('notes') })
                    .then(response=>{
                        if(response.data.status){
                            message.success('Note has been added');
                            setNotes(response.data.candidate_notes.map(row => ({
                                          key: row.id,
                                          author: row.name,
                                          content: row.notes,
                                          datetime:(<span>{moment(row.created_at).fromNow()}</span>)
                                        })));
                            updateTimeline(response.data.candidateTimelines);
                          }else{
                            message.error(response.data.message);
                          }
                          

                    });
                },

                onCancel() {console.log('modal cancelled');},
            };
            

      const addNotesOption = ()=> (
           <Button type="dashed" size={'small'} shape="round" style={{padding: '0px 10px'}}  onClick={(event) => { Modal.confirm(notesConfig); event.stopPropagation(); }}>Add Notes</Button>

      );
      const reviewConfig = {
              title: 'Add ratings and reviews',
              width:'700px',
              content: (
                <><Form>
                      <Row>
                        <Col  span={24}>
                          <Form.Item name="rating" label="Rating" labelCol={{span: 4}} wrapperCol={{span: 20}}>
                            <Rate onChange={value=>{cookie.save('rating', value);}}/>
                          </Form.Item>
                       </Col>
                       
                        <Col  span={24} >
                            <Form.Item labelCol={{span: 4}} wrapperCol={{span: 20}} label="Reviews" name="rejection_reason"   >
                              <Input.TextArea  onChange={event=>{cookie.save('reason', event.target.value);}}/>
                            </Form.Item>
                        </Col>
                        
                    </Row>
                  </Form>
                </>
              ),

                onOk() {
                      API.post('/addRatingReviewForCandidate',{'user_id':userDetails.id,'candidate_id':cookie.load('candidateId'),'rating': cookie.load('rating'),'rejection_reason': cookie.load('reason')})
                    .then(response=>{
                      setCandidateReviews(response.data.candidateReviews.map(row => ({
                                  key: row.id,
                                  author: row.name,
                                  rating: row.rating,
                                  reviews: row.reviews,
                                  datetime:(<span>{moment(row.created_at).fromNow()}</span>)
                                })));
                      updateTimeline(response.data.candidateTimelines);
                    });
                },

                onCancel() {console.log('modal cancelled');},
            };


      const AddReviewOption = ()=> (
           <Button type="dashed" size={'small'} shape="round" style={{padding: '0px 10px'}}  onClick={(event) => { Modal.confirm(reviewConfig); event.stopPropagation(); }}>Add Review</Button>

      );
   const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };
    useEffect(() => {
         if(!userDetails){
           navigate('/login');
         }
         if(!verifyAccess('Candidates','View')){
           navigate('/401');
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
                                  author: row.name,
                                  content: row.notes,
                                  datetime:(<span>{moment(row.created_at).fromNow()}</span>)
                                })));
                      setCallLogs(response.data.call_logs.map(row => ({
                                  key: row.id,
                                  author: row.name,
                                  content: row.start_time+' - '+row.end_time,
                                  datetime:(<span>{moment(row.created_at).fromNow()}</span>)
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
                                  author: row.name,
                                  rating: row.rating,
                                  reviews: row.reviews,
                                  datetime:(<span>{moment(row.created_at).fromNow()}</span>)
                                })));
                     setCandidateTimeline(response.data.candidateTimelines.map(row => ({
                                  key: row.id,
                                  name: row.name,
                                  value: row.value,
                                  type: row.type,
                                  datetime:(<span>{moment(row.created_at).fromNow()}</span>)
                                })));
                    setSkillSets(response.data.skillSets);
                    setRecruiters(response.data.recruiters);
                    setCandidateStatus(response.data.candidateStatusLists);
                    setCandidateSources(response.data.candidateSourceLists);
                    setCandidateStages(response.data.candidateStageLists);
                    setDepartments(response.data.departments);
                    setJobOpenings(response.data.jobs);
                    setLoading(false);
                    console.log(tempCandidateDetails.candidate_stage);

                    /*if(tempCandidateDetails.candidate_stage){
                        setCandidateStageName(response.data.candidateStageLists.find(x => x.id == tempCandidateDetails.candidate_stage).name);
                    }*/
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
                                       <Link to={`/editCandidate?id=${candidateDetails.id}`}><Tooltip title="Edit Details"> <Button type="primary" size={'small'} icon={<EditFilled style={{verticalAlign:0}}/>} shape="round" style={{padding: '0px 10px','width':'40px','height':'40px'}} /></Tooltip></Link>
                                </Col>
                                <Col span={6} style={{maxWidth:'25%'}}> 
                                      <Tooltip title="Associate Job Openings"><Button type="primary" size={'small'} icon={<FileProtectOutlined style={{verticalAlign:0}}/>} shape="round" style={{padding: '0px 10px','width':'40px','height':'40px'}}  onClick={()=>showAppliedJobs()} /></Tooltip>
                                </Col>
                                {userDetails.manager_id==0?'':
                                    <Col span={6} style={{maxWidth:'25%'}}> 
                                          <Tooltip title="Submit to Hiring Manager"><Button type="primary" size={'small'}  icon={<UserSwitchOutlined style={{verticalAlign:0}}/>}  shape="round" style={{padding: '0px 10px','width':'40px','height':'40px'}} onClick={()=>showConfirmSubmission()}/></Tooltip>
                                    </Col>
                               }
                                
                                <Col span={6} style={{maxWidth:'25%'}}> 
                                      <Tooltip title="Schedule Interview"><Button type="primary" size={'small'} icon={<CalendarOutlined style={{verticalAlign:0}}/>}  shape="round" style={{padding: '0px 10px','width':'40px','height':'40px'}}/></Tooltip> 
                                </Col>
                            </Row>
                        </Col>
                       
                        <Col span={22} offset={1}>

                            <Tabs defaultActiveKey="1">
                                <Tabs.TabPane tab="Overview" key="1">
                                    <Collapse defaultActiveKey={['0']}>
                                          <Collapse.Panel header="Basic info" key="1" showArrow={false}>
                                            <Row >
                                               {/* <Col span={24}><h4 style={{marginBottom:'1%'}}>Basic info </h4></Col>*/}
                                                <Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                    <label>Email: </label> <span>{candidateDetails.email}</span>
                                                </Col>
                                                <Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                    <label>Mobile: </label> <span>{candidateDetails.mobileNo}</span>{candidateDetails.altMobileNo?<span>, {candidateDetails.altMobileNo}</span>:''}
                                                </Col>
                                            </Row>
                                          </Collapse.Panel>
                                          <Collapse.Panel header="Address" key="2" showArrow={false}>
                                               <Row>
                                                    {/*<Col span={24}><h4 style={{marginBottom:'1%'}}>Address </h4></Col>*/}
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
                                          </Collapse.Panel>
                                           <Collapse.Panel header="Professional Details" key="3" showArrow={false}>
                                                <Row>
                                                   {/* <Col span={24}><h4 style={{marginBottom:'1%'}}>Professional Details </h4></Col>*/}
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
                                          </Collapse.Panel>
                                          <Collapse.Panel header="Other info" key="4" showArrow={false}>
                                                 <Row>
                                                    {/*<Col span={24}><h4 style={{marginBottom:'1%'}}>Other info </h4></Col>*/}
                                                    {/*<Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                        <label>Experience in Year(s): </label> <span>{candidateDetails.exp_in_year}</span>
                                                    </Col>*/}
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
                                                    {candidateStageName=='Rejected'?
                                                    <Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                        <label>Reason of Rejection: </label> <span>{candidateDetails.rejection_reason}</span>
                                                    </Col>:''}

                                                </Row>
                                          </Collapse.Panel>
                                          <Collapse.Panel header="Educational Details" key="5" showArrow={false}>
                                                 <Row style={{padding:'2%'}}>
                                                    <Col span={24} style={{marginBottom:'3%'}}>
                                                        
                                                              {/*<h4 style={{marginBottom:'3%'}}>Educational Details</h4>*/}
                                                              {/* <Divider />*/}
                                                              <Timeline >
                                                                    {educationDetails.map((education,index) => (
                                                                        <Timeline.Item key={index} dot={<img src={"/images/icons/"+(index+1)+".png"} style={{ width: '75%','height':'auto' }}/>} style={{'padding':'10px'}}>
                                                                            <Row  style={{ 'marginLeft':'10%'}}>
                                                                                <Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                                                    <label>Institute/Schools : </label><span> {education.institute}</span>
                                                                                </Col>
                                                                                <Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                                                    <label>Major/Department : </label><span> {education.department}</span>
                                                                                </Col>
                                                                                <Col span={10} offset={2} style={{marginBottom:'1%'}}>
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
                                          </Collapse.Panel>
                                          <Collapse.Panel header="Experience Details" key="6" showArrow={false}>
                                                 <Row style={{padding:'2%'}}>
                                                     <Col span={24} style={{marginBottom:'3%'}}>
                                                 
                                                      {/*<h4 style={{marginBottom:'3%'}}>Experience Details</h4>*/}
                                                       {/*<Divider />*/}
                                                      <Timeline >
                                                            {experienceDetails.map((experience,index) => (
                                                                <Timeline.Item key={index} dot={<img src={"/images/icons/"+(index+1)+".png"} style={{ width: '75%','height':'auto' }}/>} style={{'padding':'10px'}}>
                                                                    <Row  style={{ 'marginLeft':'10%'}}>
                                                                        <Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                                            <label>Occupation/Title : </label><span> {experience.title}</span>
                                                                        </Col>
                                                                        <Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                                            <label>Company : </label><span> {experience.company}</span>
                                                                        </Col>
                                                                        <Col span={10} offset={2} style={{marginBottom:'1%'}}>
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
                                          </Collapse.Panel>
                                          <Collapse.Panel header="Notes" key="7" showArrow={false} extra={addNotesOption()}>
                                                 <Row style={{padding:'2%'}}>
                                                     <Col span={24} style={{marginBottom:'3%'}}>
                                                             {/*<Form form={form}  name="notes" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}  onFinish={onNoteFinish} onFinishFailed={onFinishFailed} autoComplete="off">
                                                                <Row>
                                                                    <Col span={24} >
                                                                        <Form.Item labelCol={{span: 24}} wrapperCol={{span: 24}} label="Add Note" name="notes" rules={[{ required: true, message: 'Notes is required!' }]}  >
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
                                                            <Divider/>*/}
                                                             <List
                                                                className="comment-list"
                                                                header=""
                                                                itemLayout="horizontal"
                                                                dataSource={notes}
                                                                renderItem={(item) => (
                                                                  <li>
                                                                    <Comment
                                                                      author={item.author}
                                                                      avatar="/images/user.png"
                                                                      content={item.content}
                                                                      datetime={item.datetime}
                                                                    />
                                                                  </li>
                                                                )}
                                                              />
                                                           
                                                    </Col>

                                                </Row>
                                          </Collapse.Panel>
                                          <Collapse.Panel header="Call Logs" key="8" showArrow={false} extra={addLogOption()}>
                                                 <Row style={{padding:'2%'}}>
                                                     <Col span={24} style={{marginBottom:'3%'}}>
                                                             {/*<Form form={form}  name="notes" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}  onFinish={onLogFinish} onFinishFailed={onFinishFailed} autoComplete="off">
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
                                                            </Form>
                                                            <Divider/>*/}
                                                             <List
                                                                className="comment-list"
                                                                header=""
                                                                itemLayout="horizontal"
                                                                dataSource={callLogs}
                                                                renderItem={(item) => (
                                                                  <li>
                                                                    <Comment
                                                                      author={item.author}
                                                                      avatar="/images/user.png"
                                                                      content={item.content}
                                                                      datetime={item.datetime}
                                                                    />
                                                                  </li>
                                                                )}
                                                              />
                                                           
                                                    </Col>

                                                </Row>
                                          </Collapse.Panel>

                                          <Collapse.Panel header="Reviews" key="9" showArrow={false} extra={AddReviewOption()}>
                                                 <Row style={{padding:'2%'}}>
                                                     <Col span={24} style={{marginBottom:'3%'}}>
                                                          <List
                                                                className="comment-list"
                                                                header=""
                                                                itemLayout="horizontal"
                                                                dataSource={candidateReviews}
                                                                renderItem={(item) => (
                                                                  <li>
                                                                    <Comment
                                                                      author={item.author}
                                                                      avatar="/images/user.png"
                                                                      content={<Rate disabled defaultValue={item.rating} />}
                                                                      actions={[ item.reviews]}
                                                                      datetime={item.datetime}
                                                                    />
                                                                  </li>
                                                                )}
                                                              />   
                                                           
                                                    </Col>

                                                </Row>
                                          </Collapse.Panel>
                                    </Collapse>
                                    

                                    
                                   
                                   
                                       {/* <Row style={{padding:'2%'}}>
                                            <Col span={24} style={{marginBottom:'3%'}}>
                                                
                                                      <h4 style={{marginBottom:'3%'}}>Educational Details</h4>
                                                       <Divider />
                                                      <Timeline >
                                                            {educationDetails.map((education,index) => (
                                                                <Timeline.Item key={index} dot={<img src={"/images/icons/"+(index+1)+".png"} style={{ width: '75%','height':'auto' }}/>} style={{'padding':'10px'}}>
                                                                    <Row  style={{ 'marginLeft':'10%'}}>
                                                                        <Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                                            <label>Institute/Schools : </label><span> {education.institute}</span>
                                                                        </Col>
                                                                        <Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                                            <label>Major/Department : </label><span> {education.department}</span>
                                                                        </Col>
                                                                        <Col span={10} offset={2} style={{marginBottom:'1%'}}>
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
                                            <Col span={24} style={{marginBottom:'3%'}}>
                                                 
                                                      <h4 style={{marginBottom:'3%'}}>Experience Details</h4>
                                                       <Divider />
                                                      <Timeline >
                                                            {experienceDetails.map((experience,index) => (
                                                                <Timeline.Item key={index} dot={<img src={"/images/icons/"+(index+1)+".png"} style={{ width: '75%','height':'auto' }}/>} style={{'padding':'10px'}}>
                                                                    <Row  style={{ 'marginLeft':'10%'}}>
                                                                        <Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                                            <label>Occupation/Title : </label><span> {experience.title}</span>
                                                                        </Col>
                                                                        <Col span={10} offset={2} style={{marginBottom:'1%'}}>
                                                                            <label>Company : </label><span> {experience.company}</span>
                                                                        </Col>
                                                                        <Col span={10} offset={2} style={{marginBottom:'1%'}}>
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
                                        </Row>*/}
                                </Tabs.TabPane>
                                 <Tabs.TabPane tab="Timeline" key="2">
                                    <Row style={{padding:'2%'}}>
                                         <Col span={24} style={{marginBottom:'3%'}}>
                                              <List
                                                    className="comment-list"
                                                    header=""
                                                    itemLayout="horizontal"
                                                    dataSource={candidateTimeline}
                                                    renderItem={(item) => (
                                                      <li>
                                                        <Comment
                                                          author={item.name}
                                                          avatar="/images/user.png"
                                                          content={
                                                                      item.type=='rating updated'?('updated the ratings to ') 
                                                                      :item.type=='candidate status updated'? ('status updated to ')
                                                                      :item.type=='candidate details updated'? ('updated the candidate details')
                                                                      :item.type=='resume removed'? ('removed the resume') 
                                                                      :item.type=='resume updated'? ('updated the resume') 
                                                                      :item.type=='candidate added'? ('added the candidate details')
                                                                      :item.type=='job added to candidate'? ('job added to candidate details')
                                                                      :item.type=='candidate submission'? ('submitted candidate details to ')
                                                                      :item.type=='stage changed'? ('updated the candidate stage to ')
                                                                      :item.type=='note added'? ('added a note.')
                                                                      :item.type=='call added'? ('added a call.')
                                                                      :''
                                                                    }
                                                          actions={[item.type=='rating updated'?(<Rate disabled defaultValue={item.value} /> ) 
                                                                      :item.type=='candidate status updated'? (item.value)
                                                                      :item.type=='candidate submission'? (item.value)
                                                                      :item.type=='stage changed'? (item.value)
                                                                      :item.type=='note added'? (item.value)
                                                                      :item.type=='call added'? (item.value)
                                                                      :'']}
                                                          datetime={item.datetime}
                                                        />
                                                      </li>
                                                    )}
                                                  />   
                                               
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
                {/*<Row className="candidate-details">
                    <Col span={20} offset={2}>

                        <Card>
                             
                            {loading ?  
                             <Skeleton /> :
                             <>  
                                    <Card>
                                        <Row style={{padding:'2%'}}>  
                                            <Col span={12}>    
                                                     <Row ><Col span={24}><span style={{'marginBottom':'0','fontSize':'24px'}}>{candidateDetails.name}</span>  <StarFilled style={{'marginLeft': '20px','fontSize': '32px','color': ((candidateDetails.rating > 3) ? '#1dca1d' : ((candidateDetails.rating ==3) ? '#cdcd1c' : 'red'))}}/><span > ({candidateDetails.rating+'.0'})</span> </Col></Row>
                                                     <Row ><Col span={24} style={{'color':'#898989'}}><span>{candidateDetails.current_job_title} at {candidateDetails.current_employer}</span></Col></Row>
                                                     <Row ><Col span={24} style={{'marginTop':'1%'}}><label>Exp. in Year: </label><span> {candidateDetails.exp_in_year}</span></Col></Row>
                                                     <Row ><Col span={24}><label>Highest Qualification: </label><span> {candidateDetails.highest_qualification}</span></Col></Row>
                                                     <Row ><Col span={24}><label>Current Salary: </label><span> {candidateDetails.current_salary}</span></Col></Row>
                                                     <Row ><Col span={24}><label>Expected Salary: </label><span> {candidateDetails.expected_salary}</span></Col></Row>
                                                     <Row ><Col span={24}><label>Skills: </label> {canidateSkills.map((skill,index) => (<span key={index}>{skill.name+' ('+skill.stage+')'}{index!=(skillSets.length-1)?', ':''}</span>))}</Col></Row>

                                                   
                                                     <Row ><Col span={24}><label>Applied For: </label><span> {jobOpenings.map((job,index) => (<span key={index}>{job.posting_title}{index!=(jobOpenings.length-1)?', ':''}</span>))}</span></Col></Row>
                                                     <Row ><Col span={24}><label>Candidate Stage: </label><span> {candidateDetails.candidate_stage_name}</span></Col></Row>
                                                     {candidateDetails.candidate_stage_name=='Rejected'?<Row ><Col span={24}><label>Reason of Rejection: </label><span> {candidateDetails.rejection_reason}</span></Col></Row>:''}
                                                     <Row ><Col span={24}><label>Candidate Status: </label><span> {candidateDetails.candidate_status_name}</span></Col></Row>
                                                     <Row ><Col span={24}><label>Source: </label><span> {candidateDetails.candidate_source_name}</span></Col></Row>
                                                     <Row ><Col span={24}><label>Candidate Owner: </label><span> {candidateDetails.candidate_owner_name}</span></Col></Row>
                                            </Col>
                                            <Col span={12}>
                                                <Row style={{padding:'2%'}}>     
                                                     <Col span={24}><label>Email: </label> <span>{candidateDetails.email}</span></Col>
                                                     <Col span={24}><label>Mobile: </label> <span>{candidateDetails.mobileNo}</span></Col>
                                                     <Col span={24}><label>Alt. Mobile: </label> <span>{candidateDetails.altMobileNo}</span></Col>
                                                     <Col span={24}><label>Address: </label> <span>{candidateDetails.street}, {candidateDetails.city}, {candidateDetails.state}, {candidateDetails.country}</span></Col>
                                                     <Col span={24}><label>Zip: </label> <span>{candidateDetails.zip_code}</span></Col>
                                                     <Col span={24}><label>Resume: </label> <a href={API.defaults.publicURL+candidateDetails.resume} download>Download</a></Col>
                                                     <Col span={8}> <Button type="primary" onClick={showNoteDrawer}>View notes</Button></Col>
                                                     <Col span={8}> <Button type="primary" onClick={showLogDrawer}>View call logs</Button></Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Card>
                                    <Row style={{padding:'2%'}}>
                                        <Col span={12}>
                                             <Card>
                                                  <h4 style={{marginBottom:'3%'}}>Educational Details</h4>
                                                   <Divider />
                                                  <Timeline >
                                                        {educationDetails.map((education,index) => (
                                                            <Timeline.Item key={index} dot={<img src={"/images/icons/"+(index+1)+".png"} style={{ width: '75%','height':'auto' }}/>} style={{'padding':'10px'}}>
                                                                <Row  style={{ 'marginLeft':'10%'}}>
                                                                    <Col span={24}>
                                                                        <label>Institute/Schools : </label><span> {education.institute}</span>
                                                                    </Col>
                                                                    <Col span={24}>
                                                                        <label>Major/Department : </label><span> {education.department}</span>
                                                                    </Col>
                                                                    <Col span={24}>
                                                                        <label>Degree : </label><span> {education.degree}</span>
                                                                    </Col>
                                                                    <Col span={24}>
                                                                        <label>Duration : </label><span> {education.start_year}-{education.end_year}</span>    
                                                                    </Col>
                                                                    {education.currently_persuring?
                                                                        <Col span={24}>
                                                                            <Checkbox  checked disabled/> <span> Currently Pursuing</span> 
                                                                        </Col>
                                                                    :''}
                                                                    
                                                                </Row>
                                                            </Timeline.Item>
                                                            ))}
                                                        </Timeline>
                                             </Card>   
                                        </Col>
                                        <Col span={12}>
                                             <Card>
                                                  <h4 style={{marginBottom:'3%'}}>Experience Details</h4>
                                                   <Divider />
                                                  <Timeline >
                                                        {experienceDetails.map((experience,index) => (
                                                            <Timeline.Item key={index} dot={<img src={"/images/icons/"+(index+1)+".png"} style={{ width: '75%','height':'auto' }}/>} style={{'padding':'10px'}}>
                                                                <Row  style={{ 'marginLeft':'10%'}}>
                                                                    <Col span={24}>
                                                                        <label>Occupation/Title : </label><span> {experience.title}</span>
                                                                    </Col>
                                                                    <Col span={24}>
                                                                        <label>Company : </label><span> {experience.company}</span>
                                                                    </Col>
                                                                    <Col span={24}>
                                                                        <label>Summary : </label><span> {experience.summary}</span>
                                                                    </Col>
                                                                    <Col span={24}>
                                                                        <label>Duration : </label><span> {((experience.start_month>10)?experience.start_month:'0'+experience.start_month)+'-'+experience.start_year} to {((experience.end_month>10)?experience.end_month:'0'+experience.end_month)+'-'+experience.end_year}</span>    
                                                                    </Col>
                                                                    {experience.currently_working?
                                                                        <Col span={24}>
                                                                            <Checkbox  checked disabled/> <span> Currently Working</span> 
                                                                        </Col>
                                                                    :''}
                                                                    
                                                                </Row>
                                                            </Timeline.Item>
                                                            ))}
                                                        </Timeline>
                                             </Card>   
                                        </Col>
                                    </Row> 
                                    <Drawer title="Notes" placement="right" onClose={onNoteClose} visible={noteDrawer}>
                                        <Form form={form}  name="notes" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}  onFinish={onNoteFinish} onFinishFailed={onFinishFailed} autoComplete="off">
                                            <Row>
                                                <Col span={24} >
                                                    <Form.Item labelCol={{span: 24}} wrapperCol={{span: 24}} label="Add Note" name="notes" rules={[{ required: true, message: 'Notes is required!' }]}  >
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
                                        <Divider/>
                                         <List
                                            className="comment-list"
                                            header="Notes"
                                            itemLayout="horizontal"
                                            dataSource={notes}
                                            renderItem={(item) => (
                                              <li>
                                                <Comment
                                                  author={item.author}
                                                  avatar="https://www.pngmart.com/files/22/User-Avatar-Profile-Download-PNG-Isolated-Image.png"
                                                  content={item.content}
                                                  datetime={item.datetime}
                                                />
                                              </li>
                                            )}
                                          />
                                    </Drawer>
                                    <Drawer title="Call Logs" placement="right" onClose={onLogClose} visible={logDrawer}>
                                        <Form form={form}  name="notes" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}  onFinish={onLogFinish} onFinishFailed={onFinishFailed} autoComplete="off">
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
                                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                                    <Button type="primary" htmlType="submit" className="float-end" style={{ 'borderRadius': '5px' }} size={'Default'} shape="round">
                                                        Add
                                                    </Button>
                                            </Form.Item>
                                        </Form>
                                        <Divider/>
                                         <List
                                            className="comment-list"
                                            header="Call Logs"
                                            itemLayout="horizontal"
                                            dataSource={callLogs}
                                            renderItem={(item) => (
                                              <li>
                                                <Comment
                                                  author={item.author}
                                                  avatar="https://www.pngmart.com/files/22/User-Avatar-Profile-Download-PNG-Isolated-Image.png"
                                                  content={item.content}
                                                  datetime={item.datetime}
                                                />
                                              </li>
                                            )}
                                          />
                                    </Drawer>
                                
                             </>
                         }

                        </Card>
                    </Col>
                </Row>*/}
            </Body>
        </>
    )
}

const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, {})(ViewCandidate)