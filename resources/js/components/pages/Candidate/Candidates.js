import React, { useEffect,useState,useRef  } from 'react';
import { connect } from 'react-redux';
import Body from "../components/Body";
import { Button, Checkbox, Form, Input,Col, Row, Card, Table, message, Divider,Skeleton,Popconfirm,Rate,Statistic   } from 'antd';
import { AiOutlinePlus,AiOutlineEdit,AiFillDelete } from "react-icons/ai";
import { StarFilled,SearchOutlined,UndoOutlined,EyeFilled} from '@ant-design/icons';
import {Link} from 'react-router-dom';
import API from "../../api/API";
import cookie from 'react-cookies';
import { useNavigate } from 'react-router-dom';
import Highlighter from 'react-highlight-words';

const onChange = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra);
};
export const Candidates = (props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [candidateStages, setCandidateStages] = useState([]);

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
     ...getColumnSearchProps('name'),
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
    title: 'Stage',
    dataIndex: 'stage',
    sorter: {
      compare: (a, b) => a.stage.localeCompare(b.stage),
    },
    ...getColumnSearchProps('stage'),
    render: (data) =>(<>  
                        <div className="circle-area"><span className={"circle "+data.toLowerCase()}></span> {data}</div>
                       </>),
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
    ...getColumnSearchProps('candidate_source_name'),
  },
  {
    title: 'Candidate owner',
    dataIndex: 'candidate_owner_name',
    sorter: {
      compare: (a, b) => a.candidate_owner_name.localeCompare(b.candidate_owner_name),
      
    },
    ...getColumnSearchProps('candidate_owner_name'),
  },
   {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (data) =>(<>  
                              {verifyAccess('Candidates','View')?
                                <Link to={`/viewCandidate?id=${data.id}`}>
                                <EyeFilled style={{'marginRight':'10px'}}/>
                              </Link>:''  }
                                {verifyAccess('Candidates','Edit')?
                                <Link to={`/editCandidate?id=${data.id}`}>
                                <AiOutlineEdit style={{'marginRight':'10px'}}/>
                              </Link>:''  }
                           {verifyAccess('Candidates','Delete')?
                          <Popconfirm title="Are you sure to delete?" onConfirm={()=>removeUser(data.id)}>
                             <AiFillDelete style={{'cursor':'pointer','color':'red'}}/> 
                          </Popconfirm>:''  }
                       </>),
    },
];

const removeCandidate=(id)=>{
      const hide = message.loading('Deleting', 0);
      API.post('/removeCandidate',{'id':id})
                  .then(response=>{
                     setTimeout(hide, 0);
                    if(response.data.status){
                        setCandidates(response.data.candidates.map(row => ({
                                  key: row.id,
                                  id: row.id,
                                  rating: row.rating,
                                  name:row.name,
                                  city:row.city,
                                  stage:row.candidate_stage.name,
                                  modified_date:row.modified_date,
                                  candidate_source_name:row.candidate_source_name,
                                  candidate_owner_name:row.candidate_owner_name
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
           navigate('/login');
         }
         if(!verifyAccess('Candidates','View')){
           navigate('/401');
         }
        const hide = message.loading('Loading', 0);
        setLoading(true);
            API.post('/getFilteredCandidateLists',{user_id:userDetails.id})
                  .then(response=>{
                    setLoading(false);
                     setTimeout(hide, 0);
                    if(response.data.status){
                      var stages=response.data.stages;
                        stages.map(stage=>{
                          stage.count=response.data.candidates.filter(function(candidate){
                                          return candidate.candidate_stage.stage ==  stage.id;
                                      }).length;
                        }
                        );

                        setCandidateStages(stages);

                          setCandidates(response.data.candidates.map(row => ({
                                  key: row.id,
                                  id: row.id,
                                  rating: row.rating,
                                  name:row.name,
                                  city:row.city,
                                  stage:row.candidate_stage.name,
                                  modified_date:row.modified_date,
                                  candidate_source_name:row.candidate_source_name,
                                  candidate_owner_name:row.candidate_owner_name
                                })));
                      }
                      
                  });
        }, [])
        return (
              <>
                <Body>
                  <h2>Candidates</h2>
                   <Divider orientation="right">
                    {verifyAccess('Candidates','Add')?
                    <Link to='/createCandidate'>
                        <Button type="primary" shape="round" icon={<AiOutlinePlus style={{'marginTop':'-5%'}}/>} size={'Default'}> <span style={{'marginLeft':'5px'}}>Add Candidate</span>
                        </Button>
                    </Link>:'' }
                   </Divider>
                    {loading ?  <Skeleton />: 
                      <>
                          <Row className="ant-row-statistic" style={{justifyContent:'space-around',marginBottom:25}}>
                              {candidateStages.map((stages) => (
                            <Col span={Math.floor(24/candidateStages.length)} key={stages.id} className="canididate-stages"> 
                              <Card className={stages.name.toLowerCase()}>
                              <Statistic title={<span>{stages.name}</span>} value={stages.count} />
                              </Card>
                             
                            </Col>
                             )) }
                          </Row>
                        <Table columns={columns} dataSource={candidates} onChange={onChange} />
                  </>
                }
                </Body>
              </>
          )

}


const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, {})(Candidates)