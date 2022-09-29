import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Body from "./components/Body";
import { Button, Checkbox, Form, Input,Col, Row,Card } from 'antd';
import API from "../api/API";
import cookie from 'react-cookies';
import { useNavigate } from 'react-router-dom';



export const UnAuthenticated = (props) => {
   const navigate = useNavigate();
       useEffect(()=>{
        const userDetails=cookie.load('userDetails');
         if(!userDetails){
           navigate(API.defaults.frontURL+'/login');
         }
    },[])
        return (
              <>
                <Body>
                  <h1>401 Unauthenticated</h1>
                </Body>
              </>
          )

}


const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, {})(UnAuthenticated)