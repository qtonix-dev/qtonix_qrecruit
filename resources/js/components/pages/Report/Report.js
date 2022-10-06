import React, { useEffect,useState } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import Body from "../components/Body";
import {Table, Modal, Select,Button, Checkbox, Form, Input,Col, Row,Card,Space,message,Skeleton,Statistic,DatePicker } from 'antd';
import API from "../../api/API";
import cookie from 'react-cookies';
import { useNavigate } from 'react-router-dom';
import { StarFilled} from '@ant-design/icons';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar,Pie } from 'react-chartjs-2';




export const Report = (props) => {
const [barData, setBarData] = useState({labels : [],datasets: [{label: 'Candidates',data: [],backgroundColor: '#e60049'}]});
  
 const columns = [
  
   {
    title: 'Rating',
    dataIndex: 'rating',
    sorter: {
      compare: (a, b) => a.rating - b.rating,
      
    },
    render: (data) =>(<>  
                         <span>{parseInt(data).toFixed(1)}</span> <StarFilled style={{'fontSize': '24px','position': 'absolute','marginLeft': '10px','color': ((data > 3) ? '#1dca1d' : ((data ==3) ? '#cdcd1c' : 'red'))}}/>
                       </>),
  },
  {
    title: 'Candidate Name',
    dataIndex: 'name',
    sorter: {
      compare: (a, b) => a.name.localeCompare(b.name),
    },
  },
  {
    title: 'City',
    dataIndex: 'city',
    sorter: {
      compare: (a, b) => a.city.localeCompare(b.city),
    },
  },
  {
    title: 'Last Modified',
    dataIndex: 'modified_date',
    sorter: {
      compare: (a, b)  => new Date(a.modified_date) - new Date(b.modified_date)
      
    },
  },
  {
    title: 'Source',
    dataIndex: 'candidate_source_name',
    sorter: {
      compare: (a, b) => a.candidate_source_name.localeCompare(b.candidate_source_name),
      
    },
  }
];
  const openReportModal= (name, candidates) => {
        Modal.info({
          title: name+' - Candidates',
           width:'900px',
           closable:true,
          content: (
            <div style={{'marginTop':10}}>
              <Table columns={columns} dataSource={candidates} />
            </div>
          ),
          onOk() {},
        });
      };
   const navigate = useNavigate();
   const [loading, setLoading] = useState(false); 
   const [dataLoaded, setDataLoaded] = useState(false); 
   const [reportData, setReportData] = useState(false); 
  const [candidateStages, setCandidateStages] = useState([]);
    const [form] = Form.useForm();
    var formDisabled = false;
      const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };  
      const onFinish = (formData) => {
        //console.log(formData);
        formDisabled=true;
          setDataLoaded(false);
        //formData.user_id=cookie.load('userDetails').id;
           API.post('/getReportOfUser',formData)
                  .then(response=>{
                            
                    if(response.data.status){
                         formDisabled=false; 
                      
                       setBarData({
                              labels : Object.keys(response.data.candidate_inflow),
                              datasets: [
                                {
                                  label: 'Candidates',
                                  data: Object.values(response.data.candidate_inflow),
                                  backgroundColor: '#e60049',
                                }
                              ],
                            })   
                      setCandidateStages(response.data.stages);
                      setDataLoaded(true);
                      }
                      
                  });
      };
 ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);     
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Candidate Inflow',
    },
  },
};
  const [users, setUsers] = useState([]);
     useEffect(()=>{
        formDisabled=true;
        const userDetails=cookie.load('userDetails');
         if(!userDetails){
           navigate(API.defaults.frontURL+'/login');
         }
          const hide = message.loading('Loading', 0);
        setLoading(true);
            API.post('/getMetaDataForReport',{user_id:userDetails.id})
                  .then(response=>{
                            
                    if(response.data.status){
                         formDisabled=false; 
                      setUsers(response.data.users);
                        setLoading(false);
                       setTimeout(hide, 0);

                      }
                      
                  });





    },[])
        return (
              <>
                <Body>
                  <h1>Reports</h1>
                   {loading ?  
                      <Skeleton /> :
                      <> 
                        <Form form={form} onFinish={onFinish}  initialValues={{ range: [ moment(new Date(), 'YYYY-MM-DD').subtract(1, 'months'), moment(new Date(), 'YYYY-MM-DD') ]}}  onFinishFailed={onFinishFailed}  disabled={formDisabled} autoComplete="off">
                          <Row>
                            <Col span={6}> 
                              <Form.Item label="Candidate" labelCol={{span: 6}} wrapperCol={{span: 14}}  name="user_id" rules={[ { required: true, message: 'Please select a user' }]}  >
                                  <Select  
                                      placeholder="Select User"
                                       filterOption={(input, option) =>  option.children.join().toLowerCase().includes(input.toLowerCase())}
                                        showSearch >
                                      {users.map((user) => (
                                                <Select.Option key={user.id} value={user.id}>{user.name} - {user.user_type} </Select.Option>
                                       ))}
                                      
                                    </Select>
                                </Form.Item> 
                            </Col> 
                            <Col span={8}> 
                               <Form.Item label="Range"   name="range" rules={[{ required: true, message: 'Range is required!' }]}  >
                                    <DatePicker.RangePicker />
                                </Form.Item>
                            </Col>
                            <Col span={10}> 
                                <Form.Item 
                                >
                                    <Button type="primary" htmlType="submit" className="" style={{ 'borderRadius': '5px' }} size={'Default'} shape="round">
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Col>  
                          </Row>
                          {dataLoaded ? <>
                                    <Row className="ant-row-statistic" style={{justifyContent:'space-around',marginBottom:25}}>
                                        {candidateStages.map((stages,index) => (
                                      <Col span={Math.floor(24/candidateStages.length)} key={stages.id} className="canididate-stages" > 
                                        <Card className={stages.name.toLowerCase()}  style={{cursor:'pointer'}} onClick={()=>openReportModal(stages.name, stages.candidates)}>
                                        <Statistic title={<span>{stages.name}</span>} value={stages.candidates.length} />
                                        </Card>
                                       
                                      </Col>

                                       )) }
                                        <Col span={16} style={{marginTop:25}}>
                                            <Bar options={options} data={barData} />
                                       </Col>
                                    </Row>
                            </> : <></> }
                        </Form>
                      </>
                    }
                </Body>
              </>
          )

}


const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, {})(Report)