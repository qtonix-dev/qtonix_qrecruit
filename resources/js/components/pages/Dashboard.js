import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Body from "./components/Body";
import { Button, Checkbox, Form, Input,Col, Row,Card } from 'antd';
import API from "../api/API";
import cookie from 'react-cookies';
import { useNavigate } from 'react-router-dom';



export const Dashboard = (props) => {
   const navigate = useNavigate();
       useEffect(()=>{
        const userDetails=cookie.load('userDetails');
         if(!userDetails){
           navigate('/login');
         }
    },[])
        return (
              <>
                <Body>
                  <h1>Dashboard</h1>
                </Body>
              </>
          )

}


const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, {})(Dashboard)