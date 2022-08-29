import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Body from "../components/Body";
import { Button, Checkbox, Form, Input,Col, Row,Card,Select,message,Skeleton } from 'antd';
import API from "../../api/API";
import cookie from 'react-cookies';
import { useNavigate ,useSearchParams} from 'react-router-dom';



export const EditUserForm = (props) => {
     const navigate = useNavigate();
     const [params, setParams] = useSearchParams();
     const [loading, setLoading] = useState(false);
     const [user_type, setUserType] = useState("Recruiter");
     const [user_details, setUserDetails] = useState({});
     const userTypes=['Admin','Manager','Team Leader','Recruiter'];
     const [companies, setCompanies] = useState([]);
     const [managers,setManagers]= useState([]);
     const [teamLeaders,setTeamLeaders]= useState([]);
     const userDetails=cookie.load('userDetails');
     const [accessList,setAccessList]= useState({ Jobs:[], Candidates:[], Users:[],'Job Opening Status':[], 'Job Types':[],
                                                  'Work Experiences':[], 'Skill Set':[], 'Candidate Stages':[], 'Candidate Status':[],
                                                   'Candidate Sources':[],'Departments':[]});
     const [form] = Form.useForm();
     const verifyAccess=(section, action)=>{
       return Object.keys(userDetails.access).indexOf(section)>=0 && Object.values(userDetails.access)[Object.keys(userDetails.access).indexOf(section)].includes(action);
    }
      useEffect(() => {
        
         if(!userDetails){
           navigate('/login');
         }
         if(!verifyAccess('Users','Edit')){
           navigate('/401');
         }
        setLoading(true);
         console.log(loading);
          const hide = message.loading('Loading', 0);
            API.post('/getUserDetailsForEdit',{'id':params.get("id")})
                  .then(response=>{
                     setTimeout(hide, 0);
                      if(response.data.status){
                        let temp_user_details=response.data.user_details;
                        temp_user_details.manager_id=temp_user_details.manager_id!=0?temp_user_details.manager_id:null;
                        temp_user_details.leader_id=temp_user_details.leader_id!=0?temp_user_details.leader_id:null;
                          setUserType(temp_user_details.user_type);
                          setUserDetails(response.data.user_details);
                          setTeamLeaders(response.data.leaders);
                          setCompanies(response.data.companies);
                          setManagers(response.data.managers);
                           setLoading(false);
                          form.setFieldsValue(temp_user_details);
                      }else{
                          message.error('Error occurred');
                      }
                      
                  });
           
        }, []);
       const onCompanyChange=(data) =>{
          API.post('/getListsOfManagers',{'company_id':data})
            .then(response=>{
              if(response.data.status){
                    setManagers(response.data.managers);
                     form.setFieldsValue({ manager_id: null });
                }else{
                    message.error('Error occurred');
                }
                
            });
       }
       const onUserTypeChange=(data) =>{
         setUserType(data);
       }
       const onManagerChange=(data)=>{
         var  hide2 = message.loading('Loading', 0);
            API.post('/getListsOfTeamLeaders',{'manager_id':data})
                  .then(response=>{
                    setTimeout(hide2, 0);
                    if(response.data.status){
                          setTeamLeaders(response.data.leaders);
                           form.setFieldsValue({ leader_id: null});
                      }else{
                          message.error('Error occurred');
                      }
                      
                  });
       }
       const onTeamLeaderChange=(data)=>{
         
       }
       const onFinish = (formData) => {
         console.log(formData);

           const hide = message.loading('Loading', 0);
              API.post('/updateUserDetails',formData)
                  .then(response=>{
                     setTimeout(hide, 0);
                    if(response.data.status){
                         navigate('/users');
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
                           <h2>Edit User </h2>
                           {loading ?  
                             <Skeleton /> :
                             <Form name="user_details" form={form}    labelCol={{span: 8}}  wrapperCol={{span: 16}}  onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
                               <Form.Item label="" name="id" >
                                        <Input type="hidden"/>
                               </Form.Item>   
                               <Row>
                                  <Col span={12}>
                                      <Form.Item label="Name" name="name" rules={[ { required: true, message: 'Name is required!' }]}  >
                                        <Input />
                                      </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                      <Form.Item label="User Type" name="user_type" rules={[ { required: true, message: 'User Type is required!' }]}  >
                                        <Select placeholder="Select User Type" onChange={onUserTypeChange}>
                                          {userTypes.map((userType) => (
                                                    <Select.Option key={userType} value={userType}>{userType}</Select.Option>
                                           ))}
                                            
                                          </Select>
                                      </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                      <Form.Item label="Primary Email" name="email" rules={[ { required: true, message: 'Email is required!' }]}  >
                                        <Input />
                                      </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                      <Form.Item label="Personal Email" name="personal_email" rules={[ { required: true, message: 'Personal Email is required!' }]}  >
                                        <Input />
                                      </Form.Item>
                                  </Col>
                                  
                                  <Col span={12}>
                                      <Form.Item label="Phone Number" name="phone_number" rules={[ { required: true, message: 'Phone Number is required!' }]}  >
                                        <Input />
                                      </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                      <Form.Item label="Alt. Phone Number" name="alt_phone_number"  >
                                        <Input />
                                      </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                      <Form.Item label="Company" name="company_id" rules={[ { required: true, message: 'Company Details is required!' }]}  >
                                         <Select placeholder="Select Company" onChange={onCompanyChange} allowClear 
                                          >
                                          {companies.map((company) => (
                                                    <Select.Option key={company.id} value={company.id}>{company.name}</Select.Option>
                                           ))}
                                          </Select>
                                      </Form.Item>
                                  </Col>
                                   
                                  <Col span={12}>
                                      <Form.Item label="Employee ID" name="employee_id" rules={[ { required: true, message: 'Name is required!' }]}  >
                                        <Input />
                                      </Form.Item>
                                  </Col>
                                  
                                  
                                  <Col span={12}>
                                  { (user_type === 'Recruiter' || user_type === 'Team Leader' )  && (
                                      <Form.Item label="Manager" name="manager_id" rules={[ { required: true, message: 'Manager Details is required!' }]}  >
                                        <Select placeholder="Select Manager" onChange={onManagerChange}>
                                          {managers.map((manager) => (
                                                    <Select.Option key={manager.id} value={manager.id}>{manager.name}</Select.Option>
                                           ))}
                                            
                                          </Select>
                                      </Form.Item>
                                       )}
                                  </Col>
                                 
                                  
                                  <Col span={12}>
                                    { user_type === 'Recruiter'  && (
                                      <Form.Item label="Team Leader" name="leader_id" rules={[ { required: true, message: 'Team Leader Details is required!' }]}  >
                                        <Select placeholder="Select Manager" onChange={onTeamLeaderChange}>
                                          {teamLeaders.map((teamLeader) => (
                                                    <Select.Option key={teamLeader.id} value={teamLeader.id}>{teamLeader.name}</Select.Option>
                                           ))}
                                            
                                          </Select>
                                      </Form.Item>
                                       )}
                                  </Col>
                                 </Row>
                                 { (userDetails.user_type=='Admin')?
                                     <>
                                       <h4 style={{'marginTop':'2rem'}}>Access management </h4>
                                       <Row className="access_list">
                                     {Object.values(accessList).map((access,index) => (
                                          <Col span={12} className="access_item" key={index}>
                                               <Form.Item name={['access',Object.keys(accessList)[index] ]} label={Object.keys(accessList)[index]} labelCol={{span: 8}} wrapperCol={{span: 16}}>
                                                <Checkbox.Group  style={{ width: '100%'}}>
                                                  <Row>
                                                    <Col span={6}>
                                                      <Checkbox value="View" style={{ lineHeight: '32px',paddingLeft: '10px' }}>
                                                         View
                                                      </Checkbox>
                                                    </Col>
                                                    <Col span={6}>
                                                      <Checkbox value="Add" style={{ lineHeight: '32px',paddingLeft: '10px' }}>
                                                         Add
                                                      </Checkbox>
                                                    </Col>
                                                    <Col span={6}>
                                                      <Checkbox value="Edit" style={{ lineHeight: '32px',paddingLeft: '10px' }}>
                                                         Edit
                                                      </Checkbox>
                                                    </Col>
                                                    <Col span={6}>
                                                      <Checkbox value="Delete" style={{ lineHeight: '32px' }}>
                                                         Delete
                                                      </Checkbox>
                                                    </Col>
                                                  </Row>
                                                </Checkbox.Group>
                                              </Form.Item>
                                          </Col>
                                          ))}

                                       </Row>
                                       </>:''
                                   }    
                                   <h4 style={{'marginTop':'2rem'}}>Reset Password </h4>
                                 <Row >
                                  <Col span={12} >
                                      <Form.Item label="Password" name="password" rules={[ ]}  >
                                        <Input.Password />
                                      </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                      <Form.Item label="Confirm Password" name="confirm_password" rules={[ ({ getFieldValue }) => ({validator(_, value) {if ( (!getFieldValue('password') &&  !value) || getFieldValue('password') === value) {return Promise.resolve();}return Promise.reject(new Error('The two passwords that you entered do not match!'));},}),]}  >
                                        <Input.Password />
                                      </Form.Item>
                                  </Col>
                               </Row>

                                <Form.Item wrapperCol={{offset: 6,span: 16}}
                                >
                                  <Button type="primary" htmlType="submit" className="float-end"  size={'Default'} shape="round">
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

export default connect(mapStateToProps, {})(EditUserForm)