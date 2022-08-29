import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import cookie from 'react-cookies';
import 'antd/dist/antd.css';
import {Link} from 'react-router-dom';
import { LaptopOutlined, NotificationOutlined, UserOutlined,
          MenuOutlined ,FundProjectionScreenOutlined,
          SolutionOutlined,SettingOutlined,PoweroffOutlined, TeamOutlined,
          FileAddOutlined,ArrowRightOutlined,SearchOutlined,CloseOutlined,IdcardOutlined,CaretDownOutlined} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu,Dropdown,Input,Cascader,Badge} from 'antd';
import { useLocation , useNavigate } from 'react-router-dom';
import API from "../../api/API";
import axios from 'axios';
import "../../scss/mainNew.scss";

export const Body = (props) => {
    const { Header, Content, Footer, Sider } = Layout;
    const { Search } = Input;
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(true);
    const [searchCategory, setSearchCategory] = useState(['all']);
    const [searchResults, setSearchResults] = useState([]);
    const [searchText, setSearchText] = useState([]);
    const [openedSearchInput, toggleSearchInput] = useState(false);
    const [currentSideber, setCurrentSideber] = useState('');
    const [secondarySideBar, setSecondarySideBar] = useState('');
    const userDetails=cookie.load('userDetails');
    const openSideBar=(item)=>{
     
      setCollapsed(false);
      setCurrentSideber(item);
    }
    const handleLogout=()=>{
      cookie.remove('userDetails');
      userDetails={};
      
    }
    const verifyAccess=(section, action)=>{
       return Object.keys(userDetails.access).indexOf(section)>=0 && Object.values(userDetails.access)[Object.keys(userDetails.access).indexOf(section)].includes(action);
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
                    label: 'Jobs',
                    value: 'jobs',
                  },
                  {
                    label: 'Users',
                    value: 'users',
                  },
                ];
        var dashboardSideBarItems=[
                               { key:'/dashboard' , label: <Link to='/dashboard'>Dashboard</Link>, className: '', },
                            ];
        var JobOpeningSideBarItems=[
                            { key:'/jobOpenings' ,label: <Link to='/jobOpenings'>Job Openings</Link>,className: verifyAccess('Jobs','View') ? '':'display-none' },
                            { key:'/postJob' ,label: <Link to='/postJob'>Post a Job</Link> ,className: verifyAccess('Jobs','Add') ? '':'display-none'},
                         ];
        var candidateSideBarItems=[
                            { key: '/candidates' ,label: <Link to='/candidates'>Candidates</Link>,className: verifyAccess('Candidates','View') ? '':'display-none' },
                            { key: '/createCandidate' ,label: <Link to='/createCandidate'>Add Candidates</Link>,className: verifyAccess('Candidates','Add') ? '':'display-none' },
                            
                        ]; 
        var userSideBarItems=[
                            { key:'/users' ,label: <Link to='/users'>Users</Link>,className: verifyAccess('Users','View') ? '':'display-none' },
                            { key:'/createUser' ,label: <Link to='/createUser'>Add Users</Link> ,className: verifyAccess('Users','Add') ? '':'display-none'},
                            { key:'/editProfile' ,label: <Link to='/editProfile'>Edit Profile</Link> },
                        ]; 
        var settingSidebarItems=[
                                 { 
                                    label: <span>Job Openings</span>, key: 'settings-job', className: (verifyAccess('Job Opening Status','View') || verifyAccess('Job Opening Status','Add') || verifyAccess('Job Types','View') || verifyAccess('Job Types','Add') || verifyAccess('Work Experiences','View') || verifyAccess('Work Experiences','Add') || verifyAccess('Skill Set','View') || verifyAccess('Skill Set','Add')) ? 'padding-left-20':'display-none padding-left-20',
                                    children: [
                                                { key: '/jobOpeningStatus', label:<Link to='/jobOpeningStatus'>Job Opening Status</Link>,className: verifyAccess('Job Opening Status','View') ? '':'display-none' },
                                                { key: '/createJobOpeningStatus', label:<Link to='/createJobOpeningStatus'>Add Job Opening Status</Link>,className: verifyAccess('Job Opening Status','Add') ? '':'display-none'},
                                                { key: '/jobType', label:<Link to='/jobTypes'>Job Types</Link>,className: verifyAccess('Job Types','View') ? '':'display-none'},
                                                { key: '/createJobType', label:<Link to='/createJobType'>Add Job Types</Link>,className: verifyAccess('Job Types','Add') ? '':'display-none'},
                                                { key: '/workExperiences', label:<Link to='/workExperiences'>Work Experiences</Link>,className: verifyAccess('Work Experiences','View') ? '':'display-none'  },
                                                { key: '/createWorkExperience', label:<Link to='/createWorkExperience'>Add Work Experiences</Link>,className: verifyAccess('Work Experiences','Add') ? '':'display-none'  },
                                                { key: '/skillSet', label:<Link to='/skillSets'>Skill Set</Link>,className: verifyAccess('Skill Set','View') ? '':'display-none' },
                                                { key: '/createSkillSet', label:<Link to='/createSkillSet'>Add Skill</Link>,className: verifyAccess('Skill Set','Add') ? '':'display-none' }
                                              ],
                                  },
                                  { label: <span>Candidates</span>, key: 'settings-candidate', className: (verifyAccess('Candidate Stages','View') || verifyAccess('Candidate Stages','Add') || verifyAccess('Candidate Status','View') || verifyAccess('Candidate Status','Add') || verifyAccess('Candidate Sources','View') || verifyAccess('Candidate Sources','Add')) ? 'padding-left-20':'display-none padding-left-20',
                                    children: [
                                                { key: '/candidateStages', label:<Link to='/candidateStages'>Candidate Stages</Link>,className: verifyAccess('Candidate Stages','View') ? '':'display-none' },
                                                { key: '/candidateStageForm', label:<Link to='/candidateStageForm'>Add Candidate Stages</Link>,className: verifyAccess('Candidate Stages','Add') ? '':'display-none' },
                                                { key: '/candidateStatus', label:<Link to='/candidateStatus'>Candidate Status</Link>,className: verifyAccess('Candidate Status','View') ? '':'display-none'  },
                                                { key: '/candidateStatusForm', label:<Link to='/candidateStatusForm'>Add Candidate Status</Link>,className: verifyAccess('Candidate Status','Add') ? '':'display-none'  },
                                                { key: '/candidateSources', label:<Link to='/candidateSources'>Candidate Sources</Link>,className: verifyAccess('Candidate Sources','View') ? '':'display-none' },
                                                { key: '/candidateSourceForm', label:<Link to='/candidateSourceForm'>Add Candidate Sources</Link>,className: verifyAccess('Candidate Sources','Add') ? '':'display-none' }
                                              ],
                                  },
                                  { label: <span>Users</span>, key: 'settings-users', className: ( verifyAccess('Departments','View') || verifyAccess('Departments','Add') ) ? 'padding-left-20':'display-none padding-left-20',
                                    children: [
                                                { key: '/departments' , label: <Link to='/departments' activeClassName='active'>Departments</Link>,className: verifyAccess('Departments','View') ? '':'display-none' },
                                                { key: '/createDepartment' , label: <Link to='/createDepartment'>Add Departments</Link>,className: verifyAccess('Departments','Add') ? '':'display-none' },
                                              ],
                                  },
                                  
                              ];
        var sidebarItems = [
              {
                key:'/dashboard' ,
                title: 'Dashboard',
                label: <FundProjectionScreenOutlined />,
                className: '', 
              },
              {
                key:'/jobOpenings' ,
                title: 'Job Openings',
                label: <SolutionOutlined />,
                className: (verifyAccess('Jobs','View') || verifyAccess('Jobs','Add')) ? '':'display-none'
              },
              {
                key:'/candidates' ,
                title: 'Candidates',
                label: <IdcardOutlined />,
                className: (verifyAccess('Candidates','View') || verifyAccess('Candidates','Add')) ? '':'display-none'
              },
              
              {
                key:'/users' ,
                title: 'Users',
                label: <UserOutlined  />,
                className: (verifyAccess('Users','View') || verifyAccess('Users','Add')) ? '':'display-none'
              },
              {
                key:'/settings' ,
                title: 'Settings',
                label: <SettingOutlined  />,
                className: (
                              verifyAccess('Job Opening Status','View') || verifyAccess('Job Opening Status','Add')

                              || verifyAccess('Job Types','View') || verifyAccess('Job Types','Add')

                              || verifyAccess('Work Experiences','View') || verifyAccess('Work Experiences','Add')

                              || verifyAccess('Skill Set','View') || verifyAccess('Skill Set','Add')

                              || verifyAccess('Candidate Stages','View') || verifyAccess('Candidate Stages','Add')

                              || verifyAccess('Candidate Status','View') || verifyAccess('Candidate Status','Add')

                              || verifyAccess('Candidate Sources','View') || verifyAccess('Candidate Sources','Add')

                              || verifyAccess('Departments','View') || verifyAccess('Departments','Add')

                           ) ? '':'display-none'
              },
              {
                key:'logout' ,
                title: 'Logout',
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
                            key: '/createCandidate',
                            label: <Link to='/createCandidate'>Candidates</Link>,
                            className: verifyAccess('Candidates','Add') ? '':'display-none'
                          },
                          {
                            key: '/postJob',
                            label: <Link to='/postJob'>Job</Link>,
                            className: verifyAccess('Jobs','Add') ? '':'display-none'
                          },
                          {
                            key: '/createUser',
                            label: <Link to='/createUser'>User</Link>,
                            className: verifyAccess('Users','Add') ? '':'display-none'
                          },
                          {
                            key: '/createJobOpeningStatus',
                            label: <Link to='/createJobOpeningStatus'>Job Status</Link>,
                            className: verifyAccess('Job Opening Status','Add') ? '':'display-none'
                          },
                          {
                            key: '/createJobType',
                            label: <Link to='/createJobType'>Job Type</Link>,
                            className: verifyAccess('Job Types','Add') ? '':'display-none'
                          },
                          {
                            key: '/createDepartment',
                            label: <Link to='/createDepartment'>Department</Link>,
                            className: verifyAccess('Departments','Add') ? '':'display-none'
                          },
                          {
                            key: '/createSkillSet',
                            label: <Link to='/createSkillSet'>Skill</Link>,
                            className: verifyAccess('Skill Set','Add') ? '':'display-none'
                          },
                          {
                            key: '/candidateStages',
                            label: <Link to='/candidateStageForm'>Stage</Link>,
                            className: verifyAccess('Candidate Stages','Add') ? '':'display-none'
                          },
                          {
                            key: '/candidateStatus',
                            label: <Link to='/candidateStatusForm'>Status</Link>,
                            className: verifyAccess('Candidate Status','Add') ? '':'display-none'
                          },
                          {
                            key: '/candidateSources',
                            label: <Link to='/candidateSourceForm'>Source</Link>,
                            className: verifyAccess('Candidate Sources','Add') ? '':'display-none'
                          },
                          
                         ]}
                      />
                  ;


           
      var headerItems = [
          {
            key:'toggle' ,
            label:  <MenuOutlined  className="sidebar-trigger"  onClick={() => setCollapsed(!collapsed)}/> ,
            className: 'no-hover'
          },
          {
            key:'search-input' ,
            label:<Dropdown  overlay={<Menu items={searchResults}/>}  style={{fontSize:12 }} trigger={['click']}>
                  <Input 
                  placeholder="Search Name, Email, Phone, Job Title" 
                  style={{ width: 550}}
                  className="search-input"
                  addonBefore={
                    <Cascader allowClear={false} placeholder="All" style={{ width: 140 }} defaultValue={['all']} options={cascaderOptions}  onChange={value=>handleChangeSearchCategory(value)}/> 
                  }  
                  onChange={onSearch}  
                  suffix={<SearchOutlined />}
                  allowClear/>
                   </Dropdown>,
              
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
             if(location.pathname=='/dashboard'){
               setCurrentSideber('/dashboard');
            }
            else if(['/jobOpenings','/postJob','/editJobDetails'].includes(location.pathname)){
               setCurrentSideber('/jobOpenings');
               if(location.pathname=='/editJobDetails'){
                 setSecondarySideBar('/jobOpenings');
               }else{
                 setSecondarySideBar(location.pathname);
               }

            }else if(['/candidates','/createCandidate','/editCandidate'].includes(location.pathname)){
               setCurrentSideber('/candidates');
               if(location.pathname=='/editCandidate'){
                 setSecondarySideBar('/candidates');
               }else{
                 setSecondarySideBar(location.pathname);
               }
            }
            else if(['/users','/createUser','/editProfile','/editUser'].includes(location.pathname)){
               setCurrentSideber('/users');
               if(location.pathname=='/editUser'){
                 setSecondarySideBar('/users');
               }else{
                 setSecondarySideBar(location.pathname);
               }

            }else if(['/jobOpeningStatus','/createJobOpeningStatus','/editJobOpeningStatus','/jobType','/createJobType','/editJobType','/workExperiences','/createWorkExperience','/editWorkExperience','/skillSet','/createSkillSet','/editSkillSet'].includes(location.pathname)
                || ['/candidateStages','/candidateStageForm','/editCandidateStage','/candidateStatus','/candidateStatusForm','/editCandidateStatus','/candidateSources','/candidateSourceForm','/editCandidateSource'].includes(location.pathname)
                || ['/departments','/createDepartment','/editDeparment'].includes(location.pathname)
                ){
               setCurrentSideber('/settings');

               if(['/jobOpeningStatus','/createJobOpeningStatus','/editJobOpeningStatus','/jobType','/createJobType','/editJobType','/workExperiences','/createWorkExperience','/editWorkExperience','/skillSet','/createSkillSet','/editSkillSet'].includes(location.pathname)){
                  setSecondarySideBar('settings-job');

               }else if( ['/candidateStages','/candidateStageForm','/editCandidateStage','/candidateStatus','/candidateStatusForm','/editCandidateStatus','/candidateSources','/candidateSourceForm','/editCandidateSource'].includes(location.pathname)){
                  setSecondarySideBar('settings-candidate');

               }else if(['/departments','/createDepartment','/editDeparment'].includes(location.pathname)){
                    setSecondarySideBar('settings-users');

               }

            }
    }, [cookie]);
  return (
      <>
      <Layout>
          <Sider trigger={null}  collapsed className="custom-sidebar">
             <div className="header-logo-new-one">
                <Link to='/dashboard'>
                 
                  <img src="/images/5.png" style={{ width: 40,'marginTop':10 }} />

                </Link>
            </div>
           <Menu theme="light" mode="inline" selectedKeys={[currentSideber]}  defaultSelectedKeys={[currentSideber]} items={sidebarItems} onClick={(item) =>  openSideBar(item.key)} />
          </Sider>
          {collapsed?
            ''
            : 
          <Sider trigger={null}  collapsed className="custom-sidebar-menu">
             <div className="header-logo-new-two">
               <img src="/images/7.png" style={{ width: '100%','height':'auto' }}/>
             </div>
             <Menu theme="light" mode="inline"  defaultSelectedKeys={[secondarySideBar]} items={currentSideber=='/dashboard'?dashboardSideBarItems:currentSideber=='/jobOpenings'?JobOpeningSideBarItems:currentSideber=='/candidates'?candidateSideBarItems:currentSideber=='/users'?userSideBarItems:settingSidebarItems} />
                
          </Sider>
        }
          
        <Layout className="site-layout">
          <Header className="light-header">
           
            <Menu theme="light" mode="horizontal"   defaultSelectedKeys={['/']} items={headerItems} />
          </Header>
          <Content
            style={{
              padding: '0 5px',
              backgroundColor:'white'
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
