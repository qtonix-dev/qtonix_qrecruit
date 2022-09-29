import React, { useEffect,useState,useRef   } from 'react';
import { connect } from 'react-redux';
import Body from "../components/Body";
import { Button, Checkbox, Form, Input,Col, Row, Card, Table, message, Divider,Popconfirm,Skeleton } from 'antd';
import { AiOutlinePlus,AiOutlineEdit,AiFillDelete } from "react-icons/ai";
import { SearchOutlined,UndoOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom';
import API from "../../api/API";
import cookie from 'react-cookies';
import { useNavigate } from 'react-router-dom';
import Highlighter from 'react-highlight-words';


const onChange = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra);
};
export const JobOpenings = (props) => {
     const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
     const [jobs, setJobs] = useState([]);

  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {

    setSearchText('');
    clearFilters();
  };
  const getColumnSearchProps = (dataIndex) => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <Row style={{padding: 8}}>
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
      onFilter: (value, record) =>{
        return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
      },
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
    title: 'Job Opening ID',
    dataIndex: 'job_opening_id',
    sorter: {
      compare: (a, b) => a.job_opening_id - b.job_opening_id,
      
    },
    ...getColumnSearchProps('job_opening_id'),
  },
  {
    title: 'Posting Title',
    dataIndex: 'posting_title',
    sorter: {
      compare: (a, b) => a.posting_title.localeCompare(b.posting_title),
      
    },
    ...getColumnSearchProps('posting_title'),
  },
  {
    title: 'Assigned Recruiter(s)',
    dataIndex: 'recruiter_names',
    sorter: {
      compare: (a, b) => a.recruiter_names.localeCompare(b.recruiter_names),
      
    },
    ...getColumnSearchProps('recruiter_names'),
  },
  {
    title: 'Target Date',
    dataIndex: 'target_date',
    sorter: {
      compare: (a, b)  => new Date(a.target_date) - new Date(b.target_date)
      
    },
  },
  {
    title: 'Job Opening Status',
    dataIndex: 'job_status',
    sorter: {
      compare: (a, b) => a.job_status.localeCompare(b.job_status),
      
    },
    ...getColumnSearchProps('job_status'),
  },
   {
    title: 'City',
    dataIndex: 'city',
    sorter: {
      compare: (a, b) => a.city.localeCompare(b.city),
      
    },
    ...getColumnSearchProps('city'),
  },
   {
    title: 'Department Name',
    dataIndex: 'department_name',
    sorter: {
      compare: (a, b) => a.department_name.localeCompare(b.department_name),
      
    },
    ...getColumnSearchProps('department_name'),
  },
   {
    title: 'Hiring Manager',
    dataIndex: 'hiring_manager_name',
    sorter: {
      compare: (a, b) => a.hiring_manager_name.localeCompare(b.hiring_manager_name),
      
    },
    ...getColumnSearchProps('hiring_manager_name'),
  },
  {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (data) =>(<>
                          {
                            data.editable==true?
                            <>
                            {verifyAccess('Jobs','Edit')?
                              <Link to={API.defaults.frontURL+`/editJobDetails?id=${data.id}`}>
                                <AiOutlineEdit style={{'marginRight':'10px'}}/>
                              </Link>  :''  }
                              {verifyAccess('Jobs','Delete')?
                              <Popconfirm title="Are you sure to delete?" onConfirm={()=>removeJob(data.id)}>
                                 <AiFillDelete style={{'cursor':'pointer','color':'red'}}/> 
                              </Popconfirm>:''  }
                            </>
                          : ''
                          }
                       </>
                      ),
    },
];

  const removeJob=(id)=>{
      const hide = message.loading('Deleting', 0);
      API.post('/removeJob',{'id':id,'user_id':userDetails.id})
                  .then(response=>{
                     setTimeout(hide, 0);
                    if(response.data.status){
                        setJobs(response.data.jobs.map(row => ({
                                  key: row.id,
                                  id: row.id,
                                  job_opening_id: row.job_opening_id,
                                  posting_title:row.posting_title,
                                  recruiter_names:row.recruiter_names.join(', '),
                                  target_date:row.target_date,
                                  job_status:row.job_status,
                                  city:row.city,
                                  department_name:row.department_name,
                                  hiring_manager_name:row.hiring_manager_name,
                                  editable:row.editable
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
         if(!verifyAccess('Jobs','View')){
           navigate(API.defaults.frontURL+'/401');
         }
         setLoading(true);
        const hide = message.loading('Loading', 0);
            API.post('/getFilteredJobLists',{'user_id':userDetails.id})
                  .then(response=>{
                    setLoading(false);
                     setTimeout(hide, 0);
                    if(response.data.status){
                          setJobs(response.data.jobs.map(row => ({
                                  key: row.id,
                                  id: row.id,
                                  job_opening_id: row.job_opening_id,
                                  posting_title:row.posting_title,
                                  recruiter_names:row.recruiter_names.join(', '),
                                  target_date:row.target_date,
                                  job_status:row.job_status,
                                  city:row.city,
                                  department_name:row.department_name,
                                  hiring_manager_name:row.hiring_manager_name,
                                  editable:row.editable
                                })));
                      }
                      
                  });
        }, [])



        return (
              <>
                <Body>
                  <h2>Job Openings</h2>
                   <Divider orientation="right">
                   {verifyAccess('Jobs','Add')?
                    <Link to={API.defaults.frontURL+'/postJob'}>
                        <Button type="primary" shape="round" icon={<AiOutlinePlus style={{'marginTop':'-5%'}}/>} size={'Default'}> <span style={{'marginLeft':'5px'}}>Post a Job</span>
                        </Button>
                    </Link>:''  }
                   </Divider>
                  {loading ?  <Skeleton />:<Table columns={columns} dataSource={jobs} onChange={onChange} />}
                </Body>
              </>
          )

}


const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, {})(JobOpenings)