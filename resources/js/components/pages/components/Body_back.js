import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import cookie from 'react-cookies';
import 'antd/dist/antd.css';
import {Link} from 'react-router-dom';
import { LaptopOutlined, NotificationOutlined, UserOutlined,
          MenuFoldOutlined,MenuUnfoldOutlined,FundProjectionScreenOutlined,
          SolutionOutlined,SettingOutlined,PoweroffOutlined, TeamOutlined,
          FileAddOutlined,ArrowRightOutlined,SearchOutlined,CloseOutlined,IdcardOutlined} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu,Dropdown,Input,Cascader,Badge } from 'antd';
import { useNavigate } from 'react-router-dom';
import API from "../../api/API";
import axios from 'axios';

export const Body = (props) => {
    const { Header, Content, Footer, Sider } = Layout;
    const { Search } = Input;
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [searchCategory, setSearchCategory] = useState(['all']);
    const [searchResults, setSearchResults] = useState([]);
    const [searchText, setSearchText] = useState([]);
    const [openedSearchInput, toggleSearchInput] = useState(false);
    const handleLogout=()=>{
      cookie.remove('userDetails');
      userDetails={};
      
    }
    const handleChangeSearchCategory=(value)=>{
       setSearchCategory(value);
       getSearchResults({'input':searchText,'type':value.length?value[0]:'all'});
    }
    const getSearchResults=(formData)=>{
        API.post('/getSearchResults',formData)
              .then(response=>{
                  if(response.data.status){
                    var searchResults=response.data.results;
                    searchResults.map(result=>{
                        result.key=result.resultType+'_'+result.id;
                        if(result.resultType=='users'){
                           result.label= <div className="search-result">
                                             <Link to={`/editUser?id=${result.id}`}>
                                                 <UserOutlined /><span><b> {result.employee_id+' - '+result.name +' ('+result.user_type+') '}</b></span><br/>
                                             <span>{result.phone_number+' - '+result.email}</span>
                                             </Link> 
                                         </div>;
                        }else if(result.resultType=='candidate'){
                           result.label=  <Badge.Ribbon text={result.candidate_stage_name} color="cyan"> 
                                             <div className="search-result">
                                                <Link to={`/editCandidate?id=${result.id}`}>
                                                   <IdcardOutlined /><span><b> {result.current_job_title+' - '+result.name}</b></span><br/>
                                                   <span>{result.mobileNo+' - '+result.email}</span>
                                                </Link> 
                                               </div>
                                          </Badge.Ribbon>;
                        }else if(result.resultType=='job'){
                           result.label=  <Badge.Ribbon text={result.job_status} color="blue">
                                             <div className="search-result">
                                               <Link to={`/editJobDetails?id=${result.id}`}>
                                                   <SolutionOutlined /><span><b> {result.posting_title+' - '+result.job_title}</b></span><br/>
                                                   <span>{'Manager: - '+result.hiring_manager_name}</span><br/>
                                                   <span>{'Recruiters: - '+result.recruiter_names}</span>
                                               </Link> 
                                               </div>
                                          </Badge.Ribbon>;
                        }

                        
                     })
                    setSearchResults(searchResults);

                     
                  }else{
                      message.error('Error occurred');
                  }
                  
              });
    }
    const onSearch=(e)=>{
      if(e.target.value.length>=3){
          setSearchText(e.target.value);
          getSearchResults({'input':e.target.value,'type':searchCategory.length?searchCategory[0]:'all'});
      }else{
          setSearchResults([]);
      }
    }
     let userDetails={};
       const cascaderOptions=[
                  {
                    label: 'All',
                    value: 'all',
                  },
                  {
                    label: 'Candidates',
                    value: 'candidates',
                  },
                  {
                    label: 'Job Openings',
                    value: 'jobs',
                  },
                  {
                    label: 'Users',
                    value: 'users',
                  },
                ];
      var sidebarItems = [
              {
                key:'dashboard' ,
                label: <Link to='/dashboard'>Dashboard</Link>,
                icon: <FundProjectionScreenOutlined />,
                className: '', 
              },
              {
                key:'jobOpenings' ,
                label: <Link to='/jobOpenings'>Job Openings</Link>,
                icon: <SolutionOutlined /> , 
              },
              {
                key:'candidates' ,
                label: <Link to='/candidates'>Candidates</Link>,
                icon: <IdcardOutlined />,  
              },
              
              {
                key:'users' ,
                label: <Link to='/users'>Users</Link>,
                icon: <UserOutlined />, 
              },
              {
                label: 'Settings' ,
                key: 'settings',
                icon : <SettingOutlined />,
                children: [
                            { key: 'departments' , label: <Link to='/departments'>Departments</Link>,className: '',icon:<ArrowRightOutlined /> },
                            { key: 'jobOpeningStatus', label:<Link to='/jobOpeningStatus'>Job Opening Status</Link>,className: '',icon:<ArrowRightOutlined />  },
                            { key: 'jobType', label:<Link to='/jobTypes'>Job Types</Link>,className: '',icon:<ArrowRightOutlined />   },
                            { key: 'workExperiences', label:<Link to='/workExperiences'>Work Experiences</Link>,className: '',icon:<ArrowRightOutlined />   },
                            { key: 'skillSet', label:<Link to='/skillSets'>Skill Set</Link>,className: '',icon:<ArrowRightOutlined />   },
                            { key: 'candidateStages', label:<Link to='/candidateStages'>Candidate Stages</Link>,className: '',icon:<ArrowRightOutlined />   },
                            { key: 'candidateStatus', label:<Link to='/candidateStatus'>Candidate Status</Link>,className: '',icon:<ArrowRightOutlined />   },
                            { key: 'candidateSources', label:<Link to='/candidateSources'>Candidate Sources</Link>,className: '',icon:<ArrowRightOutlined />   }
                          ],
              },
              {
                key:'logout' ,
                label: <Link to='/login' onClick={()=>handleLogout()}>Logout</Link>,
                className: 'marginLeftAuto',
                icon:<PoweroffOutlined />
              }
            ];
            const editMenu = <Menu
                      items={[
                          {
                            key: 'editProfile',
                            label: <Link to='/editProfile'>Edit Profile</Link>,
                          },
                          {
                            key: 'logout',
                            label: <Link to='/login' onClick={()=>handleLogout()}>Logout</Link>,
                          },
                          
                         ]}
                      />
                  ;
       const createMenu = <Menu
                      items={[
                          {
                            key: 'createCandidate',
                            label: <Link to='/createCandidate'>Candidates</Link>,
                          },
                          {
                            key: 'postJob',
                            label: <Link to='/postJob'>Job</Link>,
                          },
                          {
                            key: 'createUser',
                            label: <Link to='/createUser'>User</Link>,
                          },
                          {
                            key: 'createSkillSet',
                            label: <Link to='/createSkillSet'>Skill</Link>,
                          },
                          {
                            key: 'candidateStages',
                            label: <Link to='/candidateStageForm'>Stage</Link>,
                          },
                          {
                            key: 'candidateStatus',
                            label: <Link to='/candidateStatusForm'>Status</Link>,
                          },
                          {
                            key: 'candidateSources',
                            label: <Link to='/candidateSourceForm'>Source</Link>,
                          },
                          {
                            key: 'createJobOpeningStatus',
                            label: <Link to='/createJobOpeningStatus'>Opening Status</Link>,
                          },
                          {
                            key: 'createJobType',
                            label: <Link to='/createJobType'>Job Type</Link>,
                          },
                          {
                            key: 'createDepartment',
                            label: <Link to='/createDepartment'>Department</Link>,
                          },
                          
                         ]}
                      />
                  ;


           
      var headerItems = [
          {
            key:'toggle' ,
            label:  (collapsed ? <MenuUnfoldOutlined className="sidebar-trigger"  onClick={() => setCollapsed(!collapsed)}/> : <MenuFoldOutlined  className="sidebar-trigger"  onClick={() => setCollapsed(!collapsed)}/>)
           ,
            className: 'no-hover'
          },
          {
            key:'search-input' ,
            label: (openedSearchInput?
              <><Dropdown  overlay={<Menu items={searchResults}/>} >
                  <Input 
                  placeholder="Search Name, Email, Phone, Job Title" 
                  style={{ width: 450,paddingTop:20,marginRight:10 }} 
                  addonBefore={
                    <Cascader placeholder="All" style={{ width: 110 }} defaultValue={['all']} options={cascaderOptions}  onChange={value=>handleChangeSearchCategory(value)}/> 
                  }  
                  onChange={onSearch}  
                  suffix={<SearchOutlined />}
                  allowClear/>
                   </Dropdown>
                <CloseOutlined onClick={()=>toggleSearchInput(false)}/>
              </>
              :<SearchOutlined onClick={()=>toggleSearchInput(true)}/>),
            className: 'no-hover marginLeftAuto'
          },
          
          {
            key:'create' ,
            label:  <Dropdown overlay={createMenu} placement="bottom"><FileAddOutlined /></Dropdown>,
            className: 'no-hover '
          },
          {
            key:'edit' ,
            label:  <Dropdown overlay={editMenu} placement="bottom"><UserOutlined /></Dropdown>,
            className: 'no-hover'
          }
        ];
    useEffect(() => {
        userDetails=cookie.load('userDetails');
        
    }, [cookie]);
  return (
      <>
      <Layout>
          <Sider trigger={null} collapsible collapsed={collapsed}>
             <div className="header-logo-new">
                <Link to='/'>
                 
                  { collapsed ? <img src="/images/logo-sm.png" style={{ width: "50px" }} />:
                                 <img src="/images/logo.png" style={{ width: "75%" }} />
                 }

                </Link>
            </div>
           <Menu theme="dark" mode="inline"   defaultSelectedKeys={['/']} items={sidebarItems} />
          </Sider>
        <Layout className="site-layout">
          <Header className="header">
           
            <Menu theme="dark" mode="horizontal"   defaultSelectedKeys={['/']} items={headerItems} />
          </Header>
          <Content
            style={{
              padding: '0 5px',
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
                  padding: '0 3%',
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
        </Layout>
        
      </>
    );
  
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Body);
