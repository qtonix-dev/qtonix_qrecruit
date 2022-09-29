import React, { useEffect,useState } from 'react';
import { connect } from 'react-redux';
import Body from "../components/Body";
import axios from 'axios';
import moment from 'moment';
import { Radio, Button, Checkbox, Form, Input,Col, Row,Card,Select,InputNumber,DatePicker,Upload ,message,RangePicker,Timeline,Skeleton,Rate } from 'antd';
import API from "../../api/API";
import cookie from 'react-cookies';
import { useNavigate ,useSearchParams} from 'react-router-dom';
import { UploadOutlined,PlusOutlined,InboxOutlined,DeleteOutlined} from '@ant-design/icons';

export const EditCandidate = (props) => {
    const [params, setParams] = useSearchParams();
    const navigate = useNavigate();    
    const [form] = Form.useForm();
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
    const [loading, setLoading] = useState(false);
    const [appliedFor, setAppliedFor] = useState([]);
    const uploadURL=API.defaults.baseURL+"uploadTempResumeAttachment";

    const [checking_email, setCheckingMail] = useState(false);
    const [hasEmailFeedback, setHasEmailFeedback] = useState(false);
    const [email_exists, setEmailExists] = useState(false);


    const [checking_phone, setCheckingPhone] = useState(false);
    const [hasPhoneFeedback, setHasPhoneFeedback] = useState(false);
    const [phone_exists, setPhoneExists] = useState(false);

    const onEmailBlurHandler = (e) => {
        if(e.target.value){
            setHasEmailFeedback(true);
            setCheckingMail(true);
             API.post('/checkDuplicacyWithEmail',{'candidate_id':params.get("id"),'email':e.target.value})
                  .then(response=>{
                       setCheckingMail(false);

                    if(response.data.candidate_found){
                        formDisabled=true;
                        setEmailExists(true);
                    }else{
                        formDisabled=false;
                        setEmailExists(false);
                    }


                      
                  });
        }
        
    }
     const onMobileBlurHandler = (e) => {
          if(e.target.value){
                setHasPhoneFeedback(true);
                setCheckingPhone(true);
                 API.post('/checkDuplicacyWithMobileNo',{'candidate_id':params.get("id"),'mobileNo':e.target.value})
                      .then(response=>{
                       setCheckingPhone(false);

                    if(response.data.candidate_found){
                        formDisabled=true;
                        setPhoneExists(true);
                    }else{
                        formDisabled=false;
                        setPhoneExists(false);
                    }


                  
              });
          }
    }    
    const handleEduFormChange = (index, event) => {
       let data = [...educationDetails];
       data[index][event.target.name] = event.target.value;
       setEducationDetails(data);
    }
    const handleEduDateRangeChange = (index, value) => {
       
       let data = [...educationDetails];
       data[index]['duration'] = value;
       setEducationDetails(data);
    }
    const handleExpFormChange = (index, event) => {
       let data = [...experienceDetails];
       data[index][event.target.name] = event.target.value;
       setExperienceDetails(data);
    }
    const handleExpDateRangeChange = (index, value) => {
       
       let data = [...experienceDetails];
       data[index]['duration'] = value;
       setExperienceDetails(data);
    }
    const removeEduFields = (index) => {
        let data = [...educationDetails];
        data.splice(index, 1)
        //form.resetFields(["educations"]);
        setEducationDetails(data)
    }
    const removeExpFields = (index) => {
        let data = [...experienceDetails];
        data.splice(index, 1)
        //form.resetFields(["experiences"]);
        setExperienceDetails(data)
    }
    const handleStageChange=(value) => {
        //console.log(value);
        setCandidateStage(value);
        if(value){
            console.log(candidateStages.find(x => x.id == value).name);
          setCandidateStageName(candidateStages.find(x => x.id == value).name);
        }else{
           setCandidateStageName(""); 
        }
        
    }
    const onJobChange=(data)=>{
           setAppliedFor(data);
    }
    const onSkillChange=(data)=>{
        let tempVar=[];
            data.forEach(function(item,index){
                 skillSets.forEach(function(item1,index1){
                     if(item==item1.id){
                       let index2=canidateSkills.findIndex( item2 => item2.id === item1.id );
                       if(index2!==-1){
                           tempVar.push(canidateSkills[index2]);
                       }else{
                           tempVar.push({
                               skill_id:item1.id,
                               name:item1.name,
                               stage :'Beginner'

                           });
                       }

                     }
                 });
            });
            console.log(tempVar);
            setCanidateSkills(tempVar);
       }
       const optionsForRadio = [
          { label: 'Beginner', value: 'Beginner' },
          { label: 'Intermediate', value: 'Intermediate' },
          { label: 'Expert', value: 'Expert' },
        ];
    const normFile = (e) => {
      console.log('Upload event:', e);

      if (Array.isArray(e)) {
        return e;
      }
      //console.log(e.fileList);
      if(e.fileList.length==0){
           API.post('/removeResumeFromCandidate',{'id':params.get("id"),'user_id':cookie.load('userDetails').id}).then(response=>{});
      }
      return e?.fileList;
    };
    const onCheckBoxChange= (e) => {
        console.log('checked = ', e.target.checked);
        //etRemotePosition(e.target.checked);
    };
    
    var formDisabled = false;
    const userDetails=cookie.load('userDetails');
     const verifyAccess=(section, action)=>{
       return Object.keys(userDetails.access).indexOf(section)>=0 && Object.values(userDetails.access)[Object.keys(userDetails.access).indexOf(section)].includes(action);
    }
    useEffect(() => {
         if(!userDetails){
           navigate(API.defaults.frontURL+'/login');
         }
         if(!verifyAccess('Candidates','Edit')){
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
                        tempCandidateDetails.candidate_stage=tempCandidateDetails.candidate_stage.stage;
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
                      setEducationDetails(tempCandidateDetails.education_details);
                      setExperienceDetails(tempCandidateDetails.experience_details);
                      
                    form.setFieldsValue(response.data.candidate_details);
                    setCanidateSkills(response.data.candidate_details.candidate_skills);
                    setSkillSets(response.data.skillSets);
                    setRecruiters(response.data.recruiters);
                    setCandidateStatus(response.data.candidateStatusLists);
                    setCandidateSources(response.data.candidateSourceLists);
                    setCandidateStages(response.data.candidateStageLists);
                    setDepartments(response.data.departments);
                    setJobOpenings(response.data.jobs);
                    setLoading(false);
                    console.log(tempCandidateDetails.candidate_stage);

                    if(tempCandidateDetails.candidate_stage){
                        setCandidateStageName(response.data.candidateStageLists.find(x => x.id == tempCandidateDetails.candidate_stage).name);
                    }
                }
                  
              });

    }, [])
    const onRecruiterChange = () => {}
    const uploadDraggerChange=(e)=>{
        if(e.fileList.length && e.fileList[0].response){
           API.post('/updateResumeForCandidate',{'id':params.get("id"),'filenametostore':e.fileList[0].response.filenametostore,'originalFileName':e.fileList[0].response.originalFileName,'user_id':cookie.load('userDetails').id  }).then(response=>{});
      }
    }
    const onRadioChange = (index, event) => {
         let data = [...canidateSkills];
           data[index]['stage'] = event.target.value;
       setCanidateSkills(data);
    };
    const onDepartmentChange = () => {}
    const onFinish = (formData) => {
        formData.educations=educationDetails;
        formData.experiences=experienceDetails;
        formData.canidateSkills=canidateSkills;
        formData.user_id=userDetails.id;
          const hide = message.loading('Loading', 0);
         API.post('/updateCandidateDetails',formData)
              .then(response=>{
                 setTimeout(hide, 0);
                if(response.data.status){
                     navigate(API.defaults.frontURL+'/candidates');
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
                            <h2>Edit Candidate Details</h2>

                             {loading ?  
                             <Skeleton /> :
                            <Form form={form} disabled={formDisabled} name="job" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={{ rating: 3}} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
                                <h4 style={{marginBottom:'3%'}}>Basic info </h4>
                                <Row>
                                    <Form.Item label="" name="id" >
                                            <Input type="hidden"/>
                                   </Form.Item>
                                    <Col span={12}>
                                        <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Name is required!' }]}  >
                                            <Input />
                                        </Form.Item>
                                    </Col>  
                                    <Col span={12}>
                                        <Form.Item label="Email" name="email" rules={[{type: 'email',message: 'The input is not valid E-mail!'},{ required: true, message: 'Email is required!' }]}  hasFeedback={hasEmailFeedback} validateStatus={checking_email ?"validating"  : email_exists ? "error" : "success"} help={checking_email ?  "Checking email"  : email_exists ?  "email already exists with another candidate" : ""}  >
                                            <Input type="email"  onBlur={onEmailBlurHandler} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Mobile" name="mobileNo" rules={[{ required: true, message: 'Mobile is required!' }]}  style={{'width':'100%'}} hasFeedback={hasPhoneFeedback} validateStatus={checking_phone ?"validating"  : phone_exists ? "error" : "success"} help={checking_phone ?  "Checking Phone"  : phone_exists ?  "phone number already exists with another candidate" : ""} >
                                            <InputNumber prefix="+91" style={{ width: '100%' }} onBlur={onMobileBlurHandler}/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Alternate Mobile" name="altMobileNo" rules={[]}  style={{'width':'100%'}}>
                                            <InputNumber prefix="+91" style={{ width: '100%' }} />
                                        </Form.Item>
                                    </Col>


                                </Row>

                                <h4  style={{marginBottom:'3%'}}>Address </h4>
                                <Row>
                                    <Col span={12}>
                                        <Form.Item label="Street" name="street" rules={[{ required: true, message: 'Street is required!' }]}  >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="City" name="city" rules={[{ required: true, message: 'city is required!' }]}  >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="State" name="state" rules={[{ required: true, message: 'state is required!' }]}  >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Zip" name="zip_code" rules={[{ required: true, message: 'Zip Code is required!' }]}  >
                                            <InputNumber  style={{ width: '100%' }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Country" name="country" rules={[{ required: true, message: 'Country is required!' }]}  >
                                            <Input />
                                        </Form.Item>
                                    </Col>

                                </Row>

                                <h4  style={{marginBottom:'3%'}}>Professional Details </h4>
                                <Row>
                                    <Col span={12}>
                                        <Form.Item label="Experience in Year(s)" name="exp_in_year" rules={[{ required: true, message: 'Experience is required!' }]}  >
                                            <InputNumber />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Highest Qualif. Held" name="highest_qualification" rules={[{ required: true, message: 'Highest Qualification is required!' }]}  >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Current Job Title" name="current_job_title" rules={[{ required: true, message: 'current job title is required!' }]}  >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Current Employer" name="current_employer" rules={[{ required: true, message: 'Current Employer is required!' }]}  >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Current Salary" name="current_salary" rules={[{ required: true, message: 'Current Salary is required!' }]}  >
                                            <Input  addonBefore="₹" addonAfter="Per Month"/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Expected Salary" name="expected_salary" rules={[{ required: true, message: 'Expected Salary is required!' }]}  >
                                            <Input  addonBefore="₹" addonAfter="Per Month"/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Skill Sets" name="skills" rules={[ { required: true, message: 'Please select atleast one skill!' }]}  >
                                        <Select  mode="multiple" placeholder="Select Skill" onChange={onSkillChange} allowClear >
                                          {skillSets.map((skill) => (
                                                    <Select.Option key={skill.id} value={skill.id}>{skill.name}</Select.Option>
                                           ))}
                                            
                                          </Select>
                                      </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                             { canidateSkills.length ? <h4> Skill Stages </h4> : <></>}
                                        {canidateSkills.map((skills,index) => (
                                            <>
                                                <Input key={'skillsid_'+index} type="hidden"  value={skills.skill_id} />
                                                <Input key={'skillsname_'+index} type="hidden"  value={skills.name} />
                                                <Form.Item key={'skillsstage_'+index} label={skills.name}   labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
                                                         <Radio.Group
                                                            options={optionsForRadio}
                                                            onChange={event => onRadioChange(index, event)}
                                                            defaultValue={skills.stage}
                                                            optionType="button"
                                                            buttonStyle="solid"

                                                          >
                                                          </Radio.Group>
                                                </Form.Item>
                                            </>
                                        ))}
                                    </Col>
                                </Row>

                                <h4 style={{marginBottom:'3%'}}>Other info </h4>
                                <Row>
                                    <Col span={12}>
                                        <Form.Item label="Applied For" name="applied_for"  >

                                            <Select placeholder="Applied For" mode="multiple" onChange={onJobChange} allowClear>
                                                {jobOpenings.map((job) => (
                                                            <Select.Option key={job.id} value={job.id}>{job.posting_title}</Select.Option>
                                                   ))}


                                            </Select>
                                        </Form.Item>
                                      
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Candidate Stage" name="candidate_stage" rules={[{ required: true, message: 'Candidate Stage is required!' }]}  >

                                            <Select placeholder="Candidate Stage" onSelect={value=> handleStageChange(value)}>
                                                {candidateStages.map((stage) => (
                                                            <Select.Option key={stage.id} value={stage.id}>{stage.name}</Select.Option>
                                                   ))}


                                            </Select>
                                        </Form.Item>
                                      
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Candidate Status" name="candidate_status" rules={[{ required: true, message: 'Candidate Status is required!' }]}  >

                                            <Select placeholder="Candidate Status"  >
                                               {candidateStatus.map((status) => (
                                                            <Select.Option key={status.id} value={status.id}>{status.name}</Select.Option>
                                                   ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    

                                    <Col span={12}>
                                        <Form.Item label="Source" name="source" rules={[{ required: true, message: 'Source is required!' }]}  >

                                            <Select placeholder="Source" >
                                               {candidateSources.map((source) => (
                                                    <Select.Option key={source.id} value={source.id}>{source.name}</Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item label="Candidate Owner" name="candidate_owner" rules={[ { required: true, message: 'Candidate Owner Set is required!' }]}  >
                                            <Select placeholder="Select Candidate Owner" >
                                              {recruiters.map((recruiter) => (
                                                        <Select.Option key={recruiter.id} value={recruiter.id}>{recruiter.name}</Select.Option>
                                               ))}
                                            
                                            </Select>
                                        </Form.Item>
                                    </Col>

                                    {/*{ candidateStageName!='Rejected'?
                                        <></>:*/}
                                         <Col  span={24}>
                                              <Form.Item labelCol={{span: 4}} wrapperCol={{span: 12}} name="rating" label="Candidate Rating">
                                                <Rate />
                                              </Form.Item>
                                         </Col>
                                        <Col  span={24} >
                                            <Form.Item labelCol={{span: 4}} wrapperCol={{span: 12}} label="Reviews " name="rejection_reason" rules={[{ required: true, message: 'Reason is required!' }]}  >
                                                    <Input.TextArea />
                                            </Form.Item>
                                        </Col>
                                   {/* }*/}
                                </Row>

                                <h4 style={{marginBottom:'3%'}}>Educational Details</h4>
                                
                                <Timeline >
                                {educationDetails.map((education,index) => (
                                    <Timeline.Item key={index} dot={<img src={API.defaults.publicURL+"/images/icons/"+(index+1)+".png"} style={{ width: '75%','height':'auto' }}/>}>
                                        <Row>
                                            
                                           
                                            <Col span={12}>
                                                <Form.Item label="Institute/Schools" rules={[{ required: true, message: 'Institute is required!' }]}  >
                                                    <Input name="institute" value={education.institute} onChange={event => handleEduFormChange(index, event)}/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="Major/Department" rules={[{ required: true, message: 'Major/Department is required!' }]}  >
                                                    <Input name="department" value={education.department}  onChange={event => handleEduFormChange(index, event)}/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="Degree"   rules={[{ required: true, message: 'Degree is required!' }]}  >
                                                    <Input name="degree" value={education.degree}  onChange={event => handleEduFormChange(index, event)}/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="Duration"  rules={[{ required: true, message: 'Duration is required!' }]}  >
                                                    <DatePicker.RangePicker value={education.duration}  picker="year" name="duration" onChange={value => handleEduDateRangeChange(index, value)}/>
                                                </Form.Item>

                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="Currently Pursuing" valuePropName="checked">
                                                    <Checkbox  name="currently_persuring" {...education.currently_persuring?checked:''}   onChange={event => handleEduFormChange(index, event)}/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                {index!=0?<DeleteOutlined  className='float-end' style={{'padding':'1%','color':'red','fontSize':'18px'}} onClick={() => removeEduFields(index)}/>:''}
                                            </Col>
                                            
                                        </Row>
                                    </Timeline.Item>
                                    ))}
                                </Timeline>
                                <Row style={{'marginBottom':'3%'}}>
                                   <Col span={16}  offset={4}>
                                        <Button type="primary" icon={<PlusOutlined style={{ color: "white", fontSize: "16px" }} />} style={{ 'borderRadius': '5px' }} size={'Default'} shape="round" onClick={()=>{setEducationDetails(educationDetails => [...educationDetails, {'institute':'',department:'',degree:'',duration:['',''], currently_persuring:false}])}}>Add Education Details</Button>
                                    </Col>
                                </Row>
                                <h4 style={{marginBottom:'3%'}}>Experience Details</h4>
                                
                                <Timeline>
                                {experienceDetails.map((experience,index) => (
                                    <Timeline.Item key={index} dot={<img src={API.defaults.publicURL+"/images/icons/"+(index+1)+".png"} style={{ width: '75%','height':'auto' }}/>}>
                                        <Row>
                                            
                                            <Col span={12}>
                                                <Form.Item label="Occupation/Title"  rules={[{ required: true, message: 'Occupation/Title is required!' }]}  >
                                                    <Input  name="title"  value={experience.title} onChange={event => handleExpFormChange(index, event)} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="Company" rules={[{ required: true, message: 'Company is required!' }]}  >
                                                    <Input  name="company" value={experience.company} onChange={event => handleExpFormChange(index, event)}/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="Summary"  rules={[{ required: true, message: 'Summary is required!' }]}  >
                                                    <Input  name="summary" value={experience.summary} onChange={event => handleExpFormChange(index, event)}/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                 <Form.Item label="Work Duration"  rules={[{ required: true, message: 'Work Duration is required!' }]}  >
                                                    <DatePicker.RangePicker value={[experience.duration?experience.duration[0]:'', experience.duration?experience.duration[1]:'']} picker="month"  name="duration" onChange={event => handleExpDateRangeChange(index, event)} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="I currently work here" valuePropName="checked">
                                                    <Checkbox  name="currently_working" {...experience.currently_working?checked:''}  onChange={event => handleExpFormChange(index, event)} />
                                                </Form.Item>
                                            </Col>
                                             <Col span={12}>
                                                {index!=0?<DeleteOutlined  className='float-end' style={{'padding':'1%','color':'red','fontSize':'18px'}} onClick={() => removeExpFields(index)}/>:''}
                                            </Col>
                                            
                                            
                                        </Row>
                                    </Timeline.Item>
                                      ))}
                                         

                                </Timeline>
                                <Row style={{'marginBottom':'3%'}}>
                                   <Col span={16}  offset={4}>
                                        <Button type="primary" icon={<PlusOutlined style={{ color: "white", fontSize: "16px" }} />} style={{ 'borderRadius': '5px' }} size={'Default'} shape="round" onClick={()=>{setExperienceDetails(experienceDetails => [...experienceDetails, {'title':'',company:'',summary:'',duration:['',''], currently_working:false}])}}>Add Experience Details</Button>
                                    </Col>
                                </Row>
                                <h4  style={{marginBottom:'3%'}}>Attachment Information</h4>
                                <Row>

                                   <Col span={24}  >
                                    <Form.Item label=""  wrapperCol={{span: 12}}>
                                        <Form.Item name="resume_file" valuePropName="fileList" defaultFileList={[...fileList]} getValueFromEvent={normFile} noStyle >
                                          <Upload.Dragger name="files" action={uploadURL} listType="picture"  maxCount={1} onChange={event => uploadDraggerChange(event)}>
                                            <p className="ant-upload-drag-icon">
                                              <InboxOutlined />
                                            </p>
                                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                          </Upload.Dragger>
                                        </Form.Item>
                                      </Form.Item>

                                  </Col>

                                </Row>


                                <Form.Item wrapperCol={{ offset: 6, span: 16 }}
                                >
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

export default connect(mapStateToProps, {})(EditCandidate)