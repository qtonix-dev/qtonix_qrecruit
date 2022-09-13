import React, { useEffect,useState,useRef  } from 'react';
import { connect } from 'react-redux';
import Body from "../components/Body";
import Board, { moveCard } from "@asseinfo/react-kanban";
import "@asseinfo/react-kanban/dist/styles.css";
import { Button, Divider, Card, Skeleton,message,Modal,Row,Form,Col,Rate,Input,Avatar,Tooltip,Tag } from 'antd';
import API from "../../api/API";
import cookie from 'react-cookies';
import { useNavigate } from 'react-router-dom';
import { ExclamationCircleOutlined,StarFilled,EyeFilled} from '@ant-design/icons';
import {Link} from 'react-router-dom';

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
         API.post('/updateRatingReasonOfCandidate',{'candidateId':cookie.load('candidateId'),'rating': cookie.load('rating')})
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
          API.post('/updateRatingReasonOfCandidate',{'candidateId':cookie.load('candidateId'),'rating': cookie.load('rating'),'rejection_reason': cookie.load('reason')})
        .then(response=>{});
    },

    onCancel() {console.log('modal cancelled');},
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
       API.post('/updateCandidateStageOfCandidate',{'candidateId':_card.id,'stage': destination.toColumnId,'user_id':cookie.load('userDetails').id })
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
             <Link to={`/viewCandidate?id=${cardItem.id}`} style={{'float':'right',marginLeft: 'auto'}}>View Details</Link>
            </Row>
          </Card>
        )}
        >
      {controlledBoard}
    </Board>
  );
}  


export const CandidatesKanban = (props) => {
  const [modal, contextHolder] = Modal.useModal();
  const [form] = Form.useForm();
  
  
  const onFinish = (formData) => {
      console.log(formData);
    };
  const onFinishFailed = (errorInfo) => {
          console.log('Failed:', errorInfo);
  };
  const navigate = useNavigate();
  const [reason, setReason] = useState('');
  const [candidateId, setCandidateId] = useState(0);
  const [stageId, setStageId] = useState(0);

  const [loading, setLoading] = useState(false);
  const verifyAccess=(section, action)=>{
       return Object.keys(userDetails.access).indexOf(section)>=0 && Object.values(userDetails.access)[Object.keys(userDetails.access).indexOf(section)].includes(action);
    }


  const userDetails=cookie.load('userDetails');  
        useEffect(() => {
         if(!userDetails){
           navigate('/login');
         }
         if(!verifyAccess('Candidates','Edit')){
           navigate('/401');
         }
        const hide = message.loading('Loading', 0);
        setLoading(true);

          API.post('/getCandidateforStageKanban')
                  .then(response=>{
                    
                    if(response.data.status){

                        board = {
                                  columns:response.data.stages.map(row => ({
                                  key: row.id,
                                  id: row.id,
                                  title: row.title,
                                  class: row.class,
                                  cards: row.cards
                                }))
                                };
                          /*<StarFilled style={{'fontSize': '24px','position': 'absolute','marginLeft': '10px','color': ((data >= 3) ? '#1dca1d' : ((data ==3) ? '#cdcd1c' : 'red'))}}/>*/

                         /* board = {
                                  columns: response.data.stages
                                }*/

                         setLoading(false);
                       setTimeout(hide, 0);

                      }
                      
                  });


        }, [])
        return (
              <>
                <Body className="react-kanban-layout">
                {loading ?  
                  <Skeleton /> :<>
                  <ControlledBoard />
                   {contextHolder}
                   </>
                }
                </Body>
              </>
          )

}


const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, {})(CandidatesKanban)