import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Body from "../components/Body";
import { Button, Checkbox, Form, Input,Col, Row,Card,Select,message,Skeleton } from 'antd';
import API from "../../api/API";
import cookie from 'react-cookies';
import { useNavigate ,useSearchParams} from 'react-router-dom';



export const EditJobTypeForm = (props) => {
     const navigate = useNavigate();
     const [params, setParams] = useSearchParams();
     const [loading, setLoading] = useState(false);
     const [type_details, setTypeDetails] = useState({});
     const userDetails=cookie.load('userDetails');
     const verifyAccess=(section, action)=>{
       return Object.keys(userDetails.access).indexOf(section)>=0 && Object.values(userDetails.access)[Object.keys(userDetails.access).indexOf(section)].includes(action);
    }
      useEffect(() => {
         if(!userDetails){
           navigate('/login');
         }
         if(!verifyAccess('Job Types','Edit')){
           navigate('/401');
         }
        setLoading(true);
         console.log(loading);
          const hide = message.loading('Loading', 0);
            API.post('/getJobTypeDetails',{'id':params.get("id")})
                  .then(response=>{
                     setTimeout(hide, 0);

                     
                    if(response.data.status){
                        setTypeDetails(response.data.type_details);
                         setLoading(false);
                      }else{
                          message.error('Error occurred');
                      }
                      
                  });
           
        }, []);

   
       const onFinish = (formData) => {
           const hide = message.loading('Loading', 0);
              API.post('/updateJobType',formData)
                  .then(response=>{
                     setTimeout(hide, 0);
                    if(response.data.status){
                         navigate('/jobTypes');
                      }else{
                          message.error('Error occurred');
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
                           <h2>Edit Type </h2>
                           {loading ?  
                             <Skeleton /> :
                             <Form name="type_details" labelCol={{span: 8}}  initialValues={{'id': type_details.id,'name': type_details.name}} wrapperCol={{span: 16}}  onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
                               <Form.Item label="" name="id" >
                                        <Input type="hidden"/>
                               </Form.Item>    
                               <Row>
                                  <Col span={12}>
                                      <Form.Item label="Name" name="name"  rules={[ { required: true, message: 'Name is required!' }]}  >
                                        <Input  />
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

export default connect(mapStateToProps, {})(EditJobTypeForm)