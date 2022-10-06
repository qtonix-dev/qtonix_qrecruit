import React, { useEffect,useState,useRef  } from 'react';
import { connect } from 'react-redux';
import Body from "../components/Body";
import { Switch, Tag, Button, Checkbox, Form, Input,Col, Row, Card, Table, message, Divider,Skeleton,Popconfirm,Rate,Statistic,Modal,Avatar,Tooltip   } from 'antd';
import { AiOutlinePlus,AiOutlineEdit,AiFillDelete } from "react-icons/ai";
import { ExclamationCircleOutlined,StarFilled,EyeFilled,SearchOutlined,UndoOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom';
import API from "../../api/API";
import cookie from 'react-cookies';
import { useNavigate } from 'react-router-dom';
import Highlighter from 'react-highlight-words';


import Board, { moveCard } from "@asseinfo/react-kanban";
import "@asseinfo/react-kanban/dist/styles.css";

var board = {
      columns: []
    };
const config = {
  title: 'Please give a rating to the candidate',
  width:'700px',
  content: (
    <><Form>
          <Row>
            <Col  span={24}>
              <Form.Item name="rating" label="Candidate Rating" labelCol={{span: 6}} wrapperCol={{span: 16}}>
                <Rate onChange={value=>{cookie.save('rating', value);}}/>
              </Form.Item>
           </Col>
        </Row>
      </Form>
    </>
  ),

    onOk() {
         API.post('/updateRatingReasonOfCandidate',{'candidate_id':cookie.load('candidateId'),'rating': cookie.load('rating')})
          .then(response=>{});

    },

    onCancel() {console.log('modal cancelled');},
};

const rejectionConfig = {
  title: 'Please give a rating and review to the candidate',
  width:'700px',
  content: (
    <><Form>
          <Row>
            <Col  span={24}>
              <Form.Item name="rating" label="Rating" labelCol={{span: 6}} wrapperCol={{span: 16}}>
                <Rate onChange={value=>{cookie.save('rating', value);}}/>
              </Form.Item>
           </Col>
           
            <Col  span={24} >
                <Form.Item labelCol={{span: 6}} wrapperCol={{span: 16}} label="Review" name="rejection_reason"   >
                  <Input.TextArea  onChange={event=>{cookie.save('reason', event.target.value);}}/>
                </Form.Item>
            </Col>
            
        </Row>
      </Form>
    </>
  ),

    onOk() {
          API.post('/updateRatingReasonOfCandidate',{user_id:cookie.load('userDetails').id,'candidate_id':cookie.load('candidateId'),'rating': cookie.load('rating'),'rejection_reason': cookie.load('reason')})
        .then(response=>{});
    },

    onCancel() {console.log('modal cancelled');},
};
const onChange = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra);
};

const ControlledBoard=() =>{
     const [controlledBoard, setBoard] = useState(board);
     const handleCardMove=(_card, source, destination)=> {
   
    
    const updatedBoard = moveCard(controlledBoard, source, destination);
      
      cookie.save('candidateId', _card.id);
      cookie.save('stageId', destination.toColumnId);

      /*if(board.columns.find(o => o.id == destination.toColumnId).title=='Rejected'){
          Modal.confirm(rejectionConfig);
      }else{

         Modal.confirm(config);
      }*/
       Modal.confirm(rejectionConfig);
     // setBoard(updatedBoard); 
       API.post('/updateCandidateStageOfCandidate',{user_id:cookie.load('userDetails').id,'candidate_id':_card.id,'stage': destination.toColumnId,'user_id':cookie.load('userDetails').id })
        .then(response=>{
          if(response.data.status){
              setBoard(updatedBoard);   
           }
            
        });
    
  }
  const updateBoard=()=>{
    setBoard(updatedBoard);   
  }
  const getShortName=(str)=>{
    var matches = str.match(/\b(\w)/g);
        return matches.join('').substring(0,2);
  }

  return (
    <Board 
        onCardDragEnd={handleCardMove} 
        disableColumnDrag
        renderColumnHeader={(columnItem) => (
           <div key={columnItem.id} className={'react-kanban-column-header ' +columnItem.title.toLowerCase() }>
               <div >
                   <span> {columnItem.title} </span>
               </div>
           </div>
          )} 
        renderCard={(cardItem, {  }) => (
          <Card  style={{'width':'230px','marginTop': '5px','borderRadius':10}} className="kanban-card" key={cardItem.id}>

            <p style={{'borderBottom':'1px solid #cecece','paddingBottom':'10px','fontWeight':600}} ><span  style={{'backgroundColor':'#2db7f5','color':'white','borderRadius':'5px','padding':'5px','fontSize':'14px'}}>{cardItem.current_job_title}</span>  <StarFilled style={{'marginLeft':'auto','verticalAlign':0,'float':'right','color': ((cardItem.rating > 3) ? '#1dca1d' : ((cardItem.rating ==3) ? '#cdcd1c' : 'red'))}}/></p>
              
            <p>
              Rating : {cardItem.rating+'.0'} <br/>
              Exp (in yr) : {cardItem.exp_in_year}<br/>
              Email: {cardItem.email}<br/>
              Mobile No.: {cardItem.mobileNo}<br/>
              Current Employer: {cardItem.current_employer}<br/>
              Status: {cardItem.candidate_status_name}
             </p> 
            <Row>
            <Tooltip title={cardItem.name} placement="top">
               <Avatar size="small" style={{ backgroundColor: '#f56a00' }}>{getShortName(cardItem.name.toUpperCase())}</Avatar>
            </Tooltip>
             <Link to={API.defaults.frontURL+`/viewCandidate?id=${cardItem.id}`} style={{'float':'right',marginLeft: 'auto'}}>View Details</Link>
            </Row>
          </Card>
        )}
        >
      {controlledBoard}
    </Board>
  );
}  
export const Candidates = (props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
   const [reason, setReason] = useState('');
  const [candidateId, setCandidateId] = useState(0);
  const [stageId, setStageId] = useState(0);

  const [candidates, setCandidates] = useState([]);
  const [candidateStages, setCandidateStages] = useState([]);
  const [modal, contextHolder] = Modal.useModal();
  const [form] = Form.useForm();
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [view, setView]= useState('table');
   const onSwitchChange = (checked) => {
      if(checked){
        setView('calendar');
      }else{
        setView('table');
      }
  };
  const onFinish = (formData) => {
      console.log(formData);
    };
  const onFinishFailed = (errorInfo) => {
          console.log('Failed:', errorInfo);
  };
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
                                <Link to={API.defaults.frontURL+`/viewCandidate?id=${data.id}`}>
                                <EyeFilled style={{'marginRight':'10px'}}/>
                              </Link>:''  }
                                {verifyAccess('Candidates','Edit')?
                                <Link to={API.defaults.frontURL+`/editCandidate?id=${data.id}`}>
                                <AiOutlineEdit style={{'marginRight':'10px'}}/>
                              </Link>:''  }
                           {verifyAccess('Candidates','Delete')?
                          <Popconfirm title="Are you sure to delete?" onConfirm={()=>removeCandidate(data.id)}>
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
           navigate(API.defaults.frontURL+'/login');
         }
         if(!verifyAccess('Candidates','View')){
           navigate(API.defaults.frontURL+'/401');
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
                         board = {
                                  columns:response.data.stages.map(row => ({
                                  key: row.id,
                                  id: row.id,
                                  title: row.title,
                                  class: row.class,
                                  cards: row.cards,
                                  name:row.name
                                }))
                                };




                      }
                      
                  });
        }, [])
        return (
              <>
                <Body>
                  <h2>Candidates</h2>
                   <Divider orientation="right">
                    {verifyAccess('Candidates','Add')?
                    <Link to={API.defaults.frontURL+'/createCandidate'}>
                        <Button type="primary" shape="round" icon={<AiOutlinePlus style={{'marginTop':'-5%'}}/>} size={'Default'}> <span style={{'marginLeft':'5px'}}>Add Candidate</span>
                        </Button>
                    </Link>:'' }
                   </Divider>
                    {loading ?  <Skeleton />: 
                      <>
                      <Row style={{marginBottom:10}}> 
                             <Col span={1} offset={21}> Table </Col>
                             <Col span={1}> <Switch  onChange={onSwitchChange} /></Col>
                             <Col span={1}> Kanban </Col>  
                         </Row>
                        { view=='table'?
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
                        </>:<>
                  <ControlledBoard />
                   {contextHolder}
                   </>
                } </> }
                </Body>
              </>
          )

}


const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, {})(Candidates)