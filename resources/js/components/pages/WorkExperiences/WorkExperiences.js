import React, { useEffect,useState,useRef   } from 'react';
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
export const WorkExperiences = (props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [workExperiences, setWorkExperiences] = useState([]);
   
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
            <UndoOutlined onClick={() => { handleReset(clearFilters); confirm({closeDropdown: false}); setSearchText(selectedKeys[0]); setSearchedColumn(dataIndex); }} size="small" style={{ marginLeft: 10 }}/>
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
      render: (data) =>(<>  
                          {verifyAccess('Work Experiences','Edit')?  
                          <Link to={API.defaults.frontURL+`/editWorkExperience?id=${data.id}`}>
                            <AiOutlineEdit style={{'marginRight':'10px'}}/>
                          </Link> :''  } 
                          {verifyAccess('Work Experiences','Delete')?  
                          <Popconfirm title="Are you sure to delete?" onConfirm={()=>removeWorkExperience(data.id)}>
                             <AiFillDelete style={{'cursor':'pointer','color':'red'}}/> 
                          </Popconfirm>:''  }
                       </>),
    },
];

  const removeWorkExperience=(id)=>{
      const hide = message.loading('Deleting', 0);
      API.post('/removeWorkExperience',{'id':id})
                  .then(response=>{
                     setTimeout(hide, 0);
                    if(response.data.status){
                        setWorkExperiences(response.data.workExperiences.map(row => ({
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
    const userDetails=cookie.load('userDetails');
         if(!userDetails){
           navigate(API.defaults.frontURL+'/login');
         }
         if(!verifyAccess('Work Experiences','View')){
           navigate(API.defaults.frontURL+'/401');
         }
         setLoading(true);
        const hide = message.loading('Loading', 0);
            API.post('/getWorkExperiences')
                  .then(response=>{
                     setTimeout(hide, 0);
                     setLoading(false);
                    if(response.data.status){
                        setWorkExperiences(response.data.workExperiences.map(row => ({
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
                  <h2>Work Experiences</h2>
                   <Divider orientation="right">
                   {verifyAccess('Work Experiences','Add')?  
                    <Link to={API.defaults.frontURL+'/createWorkExperience'}>
                        <Button type="primary" shape="round" icon={<AiOutlinePlus style={{'marginTop':'-5%'}}/>} size={'Default'}> <span style={{'marginLeft':'5px'}}>Create New Experiences</span>
                        </Button>
                    </Link>:''  }
                   </Divider>
                   {loading ?  <Skeleton />: <Table columns={columns} dataSource={workExperiences} onChange={onChange} />}
                  
                </Body>
              </>
          )

}


const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, {})(WorkExperiences)