import React, { useEffect,useState } from 'react';
import { connect } from 'react-redux';
import Body from "./components/Body";
import { Button, Checkbox, Form, Input,Col, Row,Card,Space,message,Skeleton } from 'antd';
import API from "../api/API";
import cookie from 'react-cookies';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar,Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Candidate Inflow',
    },
  },
};


export const Dashboard = (props) => {
   const navigate = useNavigate();
   const monthName= ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

  const [loading, setLoading] = useState(false);
  const [barData, setBarData] = useState({labels : [],datasets: [{label: 'Candidates',data: [],backgroundColor: '#e60049'}]});
  const [pieData, setPieData] = useState({labels: [],datasets: [{label: '# of Candidates',data: [12, 19, 3, 5, 2, 3],backgroundColor: ["#e60049", "#0bb4ff", "#50e991", "#e6d800", "#9b19f5", "#ffa300", "#dc0ab4", "#b3d4ff", "#00bfa0"],borderColor: ["#e60049", "#0bb4ff", "#50e991", "#e6d800", "#9b19f5", "#ffa300", "#dc0ab4", "#b3d4ff", "#00bfa0"],borderWidth: 1, }, ], });
       useEffect(()=>{
        const userDetails=cookie.load('userDetails');
         if(!userDetails){
           navigate('/login');
         }
          const hide = message.loading('Loading', 0);
        setLoading(true);
            API.post('/getDashboardData')
                  .then(response=>{
                    
                    if(response.data.status){

                        setLoading(false);
                       setTimeout(hide, 0);

                     /*for(let i=12;i>=0;i--){
                       var d = new Date();
                         
                          d.setMonth(d.getMonth() - i);
                         console.log(monthName[d.getMonth()]+'-'+d.getFullYear().toString().substr(-2));
                     }*/
                     //console.log(Object.keys(response.data.candidate_inflow).map(candidate_inflow =>  monthName[new Date(candidate_inflow).getMonth()]));

                      setBarData({
                              labels : Object.keys(response.data.candidate_inflow).map(candidate_inflow => monthName[new Date(candidate_inflow).getMonth()]),
                              datasets: [
                                {
                                  label: 'Candidates',
                                  data: Object.values(response.data.candidate_inflow),
                                  backgroundColor: '#e60049',
                                }
                              ],
                            })

                      setPieData({
                              labels:  Object.keys(response.data.stage_summary),
                              datasets: [
                                {
                                  label: '# of Candidates',
                                  data: Object.values(response.data.stage_summary),
                                  backgroundColor: ["#e60049", "#0bb4ff", "#50e991", "#e6d800", "#9b19f5", "#ffa300", "#dc0ab4", "#b3d4ff", "#00bfa0"],
                                  borderColor: ["#e60049", "#0bb4ff", "#50e991", "#e6d800", "#9b19f5", "#ffa300", "#dc0ab4", "#b3d4ff", "#00bfa0"],
                                  borderWidth: 1,
                                },
                              ],
                            });

                      }
                      
                  });





    },[])
        return (
              <>
                <Body>
                  <h1>Dashboard</h1>
                   {loading ?  
                             <Skeleton /> :
                              <Row>
                                <Col span={12}>
                                      <Bar options={options} data={barData} />
                                 </Col>
                                 <Col span={6} offset={3}>
                                      <Pie data={pieData} />
                                 </Col>
                              </Row>
                  }
                </Body>
              </>
          )

}


const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, {})(Dashboard)