import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import NewBody from "./components/Body";
import { Button, Checkbox, Form, Input,Col, Row,Card } from 'antd';
import API from "../api/API";
import cookie from 'react-cookies';
import { useNavigate } from 'react-router-dom';



export const DashboardNew = (props) => {
   const navigate = useNavigate();
       useEffect(()=>{
        const userDetails=cookie.load('userDetails');
         if(!userDetails){
           navigate('/login');
         }
    },[])
        return (
              <>
                <NewBody>
                  <h1>Dashboard</h1>
                </NewBody>
              </>
          )

}


const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, {})(DashboardNew)