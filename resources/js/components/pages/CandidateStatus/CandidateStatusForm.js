import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Body from "../components/Body";
import { Button, Checkbox, Form, Input,Col, Row,Card,Select,message } from 'antd';
import API from "../../api/API";
import cookie from 'react-cookies';
import { useNavigate } from 'react-router-dom';



export const CandidateStatusForm = (props) => {
     const navigate = useNavigate();
     const userDetails=cookie.load('userDetails');
     const verifyAccess=(section, action)=>{
       return Object.keys(userDetails.access).indexOf(section)>=0 && Object.values(userDetails.access)[Object.keys(userDetails.access).indexOf(section)].includes(action);
    }
      useEffect(() => {
         if(!userDetails){
           navigate('/login');
         }
         if(!verifyAccess('Candidate Status','Add')){
           navigate('/401');
         }  
        }, [])

   
       const onFinish = (formData) => {
           const hide = message.loading('Loading', 0);
              API.post('/saveCandidateStatus',formData)
                  .then(response=>{
                     setTimeout(hide, 0);
                    if(response.data.status){
                         navigate('/candidateStatus');
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
                           <h2>Create New Status</h2>
                             <Form name="status" labelCol={{span: 8}} wrapperCol={{span: 16}} initialValues={{ }} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
                                  
                               <Row>
                                  <Col span={12}>
                                      <Form.Item label="Name" name="name" rules={[ { required: true, message: 'Status is required!' }]}  >
                                        <Input />
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
                          </Card>
                      </Col>
                    </Row>
                </Body>
              </>
          )

}


const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, {})(CandidateStatusForm)