import React, { useEffect,useState } from 'react';
import { connect } from 'react-redux';
import Body from "./components/Body";
import { Button, Checkbox, Form, Input,Col, Row,Card,Space,message,Skeleton,Statistic } from 'antd';
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

/*import { Chart  } from "chart.js";
import * as Funnel from "chartjs-plugin-funnel";*/

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
   /*var config = {
                                    type: "funnel",
                                    data: {
                                      labels: ["Red", "Blue", "Yellow", "Grey", "black"],
                                      render: "value",
                                      datasets: [
                                        {
                                          data: [20, 40, 60, 80, 100],
                                          backgroundColor: [
                                            "#FF6384",
                                            "#36A2EB",
                                            "#FFCE56",
                                            "#A0A0A0",
                                            "#000000"
                                          ],
                                          hoverBackgroundColor: [
                                            "#FF6384",
                                            "#36A2EB",
                                            "#FFCE56",
                                            "#A0A0A0",
                                            "#000000"
                                          ]
                                        }
                                      ]
                                    },
                                    options: {
                                      responsive: true,
                                      sort: "asc",
                                      text: "Dat",
                                      legend: {
                                        position: "left",
                                        display: true
                                      },
                                      title: {
                                        display: true,
                                        text: "Data"
                                      },

                                      animation: {
                                        animateScale: true,
                                        animateRotate: true,
                                        onComplete: function () {
                                          var ctx = this.chart.ctx;
                                          ctx.font = Chart.helpers.fontString(
                                            Chart.defaults.global.defaultFontFamily,
                                            "normal",
                                            Chart.defaults.global.defaultFontFamily
                                          );
                                          ctx.textAlign = "center";
                                          ctx.textBaseline = "bottom";

                                          this.data.datasets.forEach(function (dataset) {
                                            for (var i = 0; i < dataset.data.length; i++) {
                                              var model =
                                                  dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                                                y_pos = model.y + 20;
                                              ctx.fillText(dataset.data[i], model.x, y_pos);
                                            }
                                          });
                                        }
                                      },
                                      plugins: {
                                        datalabels: {
                                          display: true,

                                          align: "left",
                                          anchor: "left"
                                        }
                                      }
                                    }
                                  };*/
  const [loading, setLoading] = useState(false);
  const [hiredCandidatesCount, setHiredCandidatesCount] = useState(0);
  const [rejectedCandidatesCount, setRejectedCandidatesCount] = useState(0);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
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
                       setHiredCandidatesCount(response.data.hiredCandidatesCount);
                       setRejectedCandidatesCount(response.data.rejectedCandidatesCount);
                       setTotalCandidates(response.data.totalCandidates);
                       setTotalJobs(response.data.totalJobs);
                     /*for(let i=12;i>=0;i--){
                       var d = new Date();
                         
                          d.setMonth(d.getMonth() - i);
                         console.log(monthName[d.getMonth()]+'-'+d.getFullYear().toString().substr(-2));
                     }*/
                     //console.log(Object.keys(response.data.candidate_inflow).map(candidate_inflow =>  monthName[new Date(candidate_inflow).getMonth()]));

                      setBarData({
                             // labels : Object.keys(response.data.candidate_inflow).map(candidate_inflow => monthName[new Date(candidate_inflow).getMonth()]),
                              labels : Object.keys(response.data.candidate_inflow),
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

                      /*var ctx = document.getElementById("myChart").getContext("2d");
                      const myFunnel = new Chart(ctx, config);
                      myFunnel.update();*/
                      
                  });





    },[])
        return (
              <>
                <Body>
                  <h1>Dashboard</h1>
                   {loading ?  
                             <Skeleton /> :<>
                                  <h3>Summary</h3>
                              <Row className="ant-row-statistic" style={{justifyContent:'space-around',marginBottom:50}}>
                                   
                                  
                                  <Col span={4}  className="canididate-stages"> 
                                    <Card >
                                    <Statistic title={<span>Total Candidate</span>} value={totalCandidates} />
                                    </Card>
                                   
                                  </Col>
                                  <Col span={4}  className="canididate-stages"> 
                                    <Card >
                                    <Statistic title={<span>Total Jobs Opening</span>} value={totalJobs} />
                                    </Card>
                                   
                                  </Col>
                                  <Col span={4}  className="canididate-stages"> 
                                    <Card >
                                    <Statistic title={<span>Hired (this month)</span>} value={hiredCandidatesCount} />
                                    </Card>
                                   
                                  </Col>
                                  <Col span={4}  className="canididate-stages"> 
                                    <Card >
                                    <Statistic title={<span>Rejected (this month)</span>} value={rejectedCandidatesCount} />
                                    </Card>
                                   
                                  </Col>
                                  
                                </Row>
                                <h3>Graphs</h3>
                                <Row>
                                <Col span={12}>
                                      <Bar options={options} data={barData} />
                                 </Col>
                                 <Col span={6} offset={3}>
                                      <Pie data={pieData} />
                                 </Col>
                                {/* <Col span={12}>
                                 <canvas id="myChart"></canvas>
                                 </Col>*/}
                              </Row>
                              
                          </>
                  }
                </Body>
              </>
          )

}


const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, {})(Dashboard)