import React, { useEffect,useState } from 'react';
import { connect } from 'react-redux';
import Body from "../components/Body";
import { Button, Checkbox, Form, Input,Col, Row,Card,Select,message,Skeleton } from 'antd';
import API from "../../api/API";
import cookie from 'react-cookies';
import { useNavigate } from 'react-router-dom';
const { Option } = Select;


export const CreateUsersForm = (props) => {
     const navigate = useNavigate(); 
     const userTypes=['Admin','Manager','Team Leader','Recruiter'];
     const [user_type, setUserType] = useState("Recruiter");
      const userDetails=cookie.load('userDetails');
     const [loading, setLoading] = useState(false);
     const [companies, setCompanies] = useState([]);
     const [managers,setManagers]= useState([]);
     const [teamLeaders,setTeamLeaders]= useState([]);
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
         if(!verifyAccess('Users','Add')){
           navigate('/401');
         }
         setLoading(true);
           const hide1 = message.loading('Loading', 0);
            API.post('/getCompanyList')
                  .then(response=>{
                    setLoading(false);
                     setTimeout(hide1, 0);
                    if(response.data.status){
                          setCompanies(response.data.companies);
                      }else{
                          message.error('Error occurred');
                      }
                      
                  });

        }, [])
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
       const onTeamLeaderChange=(data)=>{
         
       }
       const onManagerChange=(data)=>{
            API.post('/getListsOfTeamLeaders',{'manager_id':data})
                  .then(response=>{
                    if(response.data.status){
                          setTeamLeaders(response.data.leaders);
                            form.setFieldsValue({ leader_id: null});
                      }else{
                          message.error('Error occurred');
                      }
                      
                  });
       }
   
       const onFinish = (formData) => {
           const hide = message.loading('Loading', 0);
              API.post('/saveUserDetails',formData)
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
                           <h2>Create New User</h2>
                           {loading ?  <Skeleton />:
                             <Form name="user_details" form={form} labelCol={{span: 8}} wrapperCol={{span: 16}} initialValues={{user_type:'Recruiter' }} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
                                  
                               <Row>
                                  <Col span={12}>
                                      <Form.Item label="Name" name="name" rules={[ { required: true, message: 'Name is required!' }]}  >
                                        <Input />
                                      </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                      <Form.Item label="User Type" name="user_type" rules={[ { required: true, message: 'User Type is required!' }]}  >
                                        <Select placeholder="Select User Type" onChange={onUserTypeChange} allowClear>
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
                                         <Select placeholder="Select Company" onChange={onCompanyChange} allowClear>
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
                                    { (user_type === 'Recruiter' || user_type === 'Team Leader')  && (
                                      <Form.Item label="Manager" name="manager_id" rules={[ { required: true, message: 'Manager Details is required!' }]}  >
                                        <Select placeholder="Select Manager" onChange={onManagerChange} allowClear>
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
                                  
                                 
                                  <Col span={12}>
                                      <Form.Item label="Password" name="password" rules={[ { required: true, message: 'Password is required!' }]}  >
                                        <Input.Password />
                                      </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                      <Form.Item label="Confirm Password" name="confirm_password" rules={[ { required: true, message: 'Please confirm your password!'},({ getFieldValue }) => ({validator(_, value) {if (!value || getFieldValue('password') === value) {return Promise.resolve();}return Promise.reject(new Error('The two passwords that you entered do not match!'));},}),]}  >
                                        <Input.Password />
                                      </Form.Item>
                                  </Col>
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

export default connect(mapStateToProps, {})(CreateUsersForm)