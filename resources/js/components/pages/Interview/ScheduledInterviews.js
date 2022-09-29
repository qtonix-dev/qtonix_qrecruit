import React, { useEffect,useState,useRef  } from 'react';
import { connect } from 'react-redux';
import Body from "../components/Body";
import { DatePicker, TimePicker, Modal,Tooltip, Button, Checkbox, Form, Input,Col, Row, Card, Table, message, Divider,Skeleton,Popconfirm,Rate,Statistic   } from 'antd';
import { AiOutlinePlus,AiOutlineEdit,AiFillDelete } from "react-icons/ai";
import { ReloadOutlined,StarFilled,SearchOutlined,UndoOutlined,EyeFilled,StopOutlined,CheckCircleOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom';
import API from "../../api/API";
import cookie from 'react-cookies';
import { useNavigate } from 'react-router-dom';
import Highlighter from 'react-highlight-words';
import moment from 'moment';

const onChange = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra);
};
export const ScheduledInterviews = (props) => {
  const navigate = useNavigate(); 
    const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [candidateStages, setCandidateStages] = useState([]);
  const [interviewList, setInterviewList]= useState([]);
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <Row
          style={{
            padding: 8,
          }}
        >
         <Col span={20} >
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{
              marginBottom: 8,
              display: 'block',
            }}
          />
          </Col>
          <Col span={4} >
            <UndoOutlined onClick={() => { handleReset(clearFilters); confirm({closeDropdown: false});setSearchText(selectedKeys[0]); setSearchedColumn(dataIndex); }} size="small" style={{ marginLeft: 10 }}/>
          </Col>
        </Row>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined
          style={{
            color: filtered ? '#1890ff' : undefined,
          }}
        />
      ),
      onFilter: (value, record) =>
        record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      render: (text) =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: '#ffc069',
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
          />
        ) : (
          text
        ),
    });




 const columns = [
  
   
  {
    title: 'Candidate Name',
    dataIndex: 'candidate_name',
    sorter: {
      compare: (a, b) => a.candidate_name.localeCompare(b.candidate_name),
    },

     ...getColumnSearchProps('candidate_name'),
    render: (data,record) =>(<>     <Link to={API.defaults.frontURL+`/viewCandidate?id=${record.id}`}>
                                          {record.candidate_name}
                                      </Link>{/*{
                                      verifyAccess('Candidates','View')?
                                        <Link to={`/viewCandidate?id=${record.id}`}>
                                          {record.candidate_name}
                                      </Link>: <span>{record.candidate_name}</span>  }*/} 

                           
                        
                       </>),
      
  },
  
  {
    title: 'Type',
    dataIndex: 'interview_type_name',
    sorter: {
      compare: (a, b) => a.interview_type_name.localeCompare(b.interview_type_name),
    },
     ...getColumnSearchProps('interview_type_name'),
  },
  {
    title: 'Job Title',
    dataIndex: 'job_title',
    sorter: {
      compare: (a, b) => a.job_title.localeCompare(b.job_title),
    },
     ...getColumnSearchProps('job_title'),
  },
  {
    title: 'Interviewer Names',
    dataIndex: 'interviewer_names',
    sorter: {
      compare: (a, b) => a.interviewer_names.localeCompare(b.interviewer_names),
    },
     ...getColumnSearchProps('interviewer_names'),
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
    title: 'Notes',
    dataIndex: 'interview_notes',
    sorter: {
      compare: (a, b)  => new Date(a.interview_notes) - new Date(b.interview_notes)
      
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
      API.post('/cancelInterview',{'user_id':userDetails.id,'interview_id':id})
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
        }, [])
        return (
              <>
                <Body>
                  <h2>Scheduled Interviews</h2>
                   <Divider orientation="right">
                    {verifyAccess('Scheduled Interviews','Add')?
                    <Link to={API.defaults.frontURL+'/scheduleAnInterview'}>
                        <Button type="primary" shape="round" icon={<AiOutlinePlus style={{'marginTop':'-5%'}}/>} size={'Default'}> <span style={{'marginLeft':'5px'}}>Schedule an Interview</span>
                        </Button>
                    </Link>:'' }
                   </Divider>
                    {loading ?  <Skeleton />: 
                      <>
                         
                        <Table columns={columns} dataSource={interviewList} onChange={onChange} />
                  </>
                }
                </Body>
              </>
          )

}


const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, {})(ScheduledInterviews)