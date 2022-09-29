import React, { useEffect,useState,useRef  } from 'react';
import { connect } from 'react-redux';
import Body from "../components/Body";
import { Button, Checkbox, Form, Input,Col, Row, Card, Table, message, Divider,Skeleton,Popconfirm   } from 'antd';
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
export const CandidateStage = (props) => {
    const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [statusList, setStatusList] = useState([]);
  

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
    title: 'ID',
    dataIndex: 'id',
    sorter: {
      compare: (a, b) => a.id - b.id,
      
    },
  },
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: {
      compare: (a, b) => a.name.localeCompare(b.name),
      
    },
    ...getColumnSearchProps('name'),
  },
   {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (data) =>(<> {verifyAccess('Candidate Stages','Edit')?  
                          <Link to={API.defaults.frontURL+`/editCandidateStage?id=${data.id}`}>
                            <AiOutlineEdit style={{'marginRight':'10px'}}/>
                          </Link> :''  }
                           {verifyAccess('Candidate Stages','Delete')? 
                          <Popconfirm title="Are you sure to delete?" onConfirm={()=>removeCandidateStage(data.id)}>
                             <AiFillDelete style={{'cursor':'pointer','color':'red'}}/> 
                          </Popconfirm>:''  }
                       </>),
    },
];

  const removeCandidateStage=(id)=>{
      const hide = message.loading('Deleting', 0);
      API.post('/removeCandidateStage',{'id':id})
                  .then(response=>{
                     setTimeout(hide, 0);
                    if(response.data.status){
                        setStatusList(response.data.candidate_stage_list.map(row => ({
                                  key: row.id,
                                  id: row.id,
                                  name: row.name
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
         if(!verifyAccess('Candidate Stages','View')){
           navigate(API.defaults.frontURL+'/401');
         }
         setLoading(true);
        const hide = message.loading('Loading', 0);
            API.post('/getCandidateStageList')
                  .then(response=>{
                     setTimeout(hide, 0);
                     setLoading(false);
                    if(response.data.status){
                        setStatusList(response.data.candidate_stage_list.map(row => ({
                                  key: row.id,
                                  id: row.id,
                                  name: row.name
                                })));

                    }    
                  });
        }, [])



        return (
              <>
                <Body>
                  <h2>Candidate Stage </h2>
                   <Divider orientation="right">
                   {verifyAccess('Candidate Stages','Add')?
                    <Link to={API.defaults.frontURL+'/candidateStageForm'}>
                        <Button type="primary" shape="round" icon={<AiOutlinePlus style={{'marginTop':'-5%'}}/>} size={'Default'}> <span style={{'marginLeft':'5px'}}>Create New Stage List</span>
                        </Button>
                    </Link>:'' }
                   </Divider>
                   {loading ?  <Skeleton />: <Table columns={columns} dataSource={statusList} onChange={onChange} />}
                  
                </Body>
              </>
          )

}


const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, {})(CandidateStage)