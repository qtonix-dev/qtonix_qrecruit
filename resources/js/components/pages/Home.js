import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Body from "./components/Body";
import { Button, Checkbox, Form, Input,Col, Row,Card } from 'antd';
import API from "../api/API";
import cookie from 'react-cookies';
import { useNavigate } from 'react-router-dom';

export const Home = (props) => {
     const navigate = useNavigate();
    useEffect(()=>{
        
           navigate('/login');
         
    },[])

  return (
    <div>Home</div>
  )
}

const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, {})(Home)