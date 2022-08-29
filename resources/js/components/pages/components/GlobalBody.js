import React, { useEffect } from "react";
import { connect } from "react-redux";
import cookie from 'react-cookies';
import 'antd/dist/antd.css';
import {Link} from 'react-router-dom';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';


export const GlobalBody = (props) => {
    const { Header, Content, Footer, Sider } = Layout;

    const navigate = useNavigate();

    
     let userDetails={};
     var headerItems=[
              {
                key:'login' ,
                label: <Link to='/login'>Login</Link>,
                className: 'marginLeftAuto', 
              }
            ];
      
    useEffect(() => {
        
    }, [cookie]);
  return (
      <>
        <Layout>
          <Header className="header">
            <div className="header-logo">
                <Link to='/'>
                  <img src="/images/22.png" style={{ width: "100%" }} />
                </Link>
            </div>
            <Menu theme="dark" mode="horizontal"   defaultSelectedKeys={['/']} items={headerItems} />
          </Header>
          <Content
            style={{
              padding: '0 50px',
            }}
          >
            <Layout
              className="site-layout-background"
              style={{
                padding: '24px 0',
              }}
            >
             
              <Content
                style={{
                  padding: '0 5%',
                  minHeight: (window.innerHeight-180),
                }}
              >
                {props.children}
              </Content>
            </Layout>
          </Content>
          <Footer
            style={{
              textAlign: 'center',
            }}
          >
            QRecruit @2022
          </Footer>
        </Layout>
        
      </>
    );
  
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(GlobalBody);
