import React from 'react';
import './Alerts.css';
import { DataUtils } from '../../utils/data-process.js';
import { Accordion, Icon, Segment, Button } from 'semantic-ui-react';
import { LineChart, Line, ReferenceDot, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';
var _ = require('lodash');

    function getIndexByDate(date, data) {
        for(let i=0; i<data.length; i++) {
            if(data.[i].Date === date) {
                return i;
            }
        }
    }
    function getData(data, x) {
        let newObj = []
        for(let i=0; i<data.length; i++) {
            if (i<= x) {
                newObj.push(data[i])
            }
        }
        return newObj;
    }
    function AlertMetrics(props) {
        let anomaly_by_type = DataUtils.getAnomaliesByType(props.anomaly);

        let index = getIndexByDate(props.anomaly.Date, props.data[0].data);
        let tempData = getData(props.data[0].data, index)
        let data = tempData.splice(index-24, index+1);

        return(
           <div className="alert-container">
               {/************************************
               /*               Mass
               /***********************************/}

               <div className="alert-metric-container">
                        <div className="alert-numerics">
                           <div className="alert-metric-label">
                           {
                                anomaly_by_type.mass ? <div><Icon inverted color='red' name='warning sign' /> Mass</div> :
                                <div><Icon inverted color='green' name='dot circle' />Mass</div>
                            }

                           </div>
                           <div className="alert-metric-value">
                            { String(props.anomaly.Mass) + " lbs" }
                          </div>
                       </div>
                      <div className="alert-metric-linegraph">
                          		<ResponsiveContainer height={"140%"} width="110%" >
                  <LineChart data={data}>
                  {anomaly_by_type.mass && <ReferenceLine x={data[data.length-1].Date} stroke="#f5424e" />}
                    <XAxis tickCount={0} minTickGap={200} dataKey="Date"/>
                    <YAxis/>
                    <Line dot={false}  dataKey="Mass" strokeWidth={2} stroke="#8884d8" />
                      <Tooltip contentStyle={{backgroundColor: "#222"}}/>
                  </LineChart>
    		</ResponsiveContainer>
                      </div>
              </div>


               {/************************************
               /*           Temperature
               /***********************************/}

               <div className="alert-metric-container">
                    <div className="alert-numerics">
                       <div className="alert-metric-label">
                        {
                            anomaly_by_type.temperature ? <div><Icon inverted color='red' name='warning sign' />
                             Temperature</div> :
                            <div><Icon inverted color='green' name='dot circle' />Temperature</div>
                        }
                       </div>
                       <div className="alert-metric-value">
                        { String(props.anomaly.MeterTemperature) + " °F" }
                      </div>
                    </div>
                    <div className="alert-metric-linegraph">
                   <ResponsiveContainer height={"140%"} width="110%" >
                  <LineChart data={data}>
                  {anomaly_by_type.temperature && <ReferenceLine x={data[data.length-1].Date} stroke="#f5424e" />}
                    <XAxis tickCount={0} minTickGap={200} dataKey="Date"/>
                    <YAxis domain={[40, 100]}/>
                    <Line dot={false}  dataKey="MeterTemperature" strokeWidth={2} stroke="#8884d8" />
                    <Tooltip contentStyle={{backgroundColor: "#222"}}/>
                  </LineChart>
    		</ResponsiveContainer>
                    </div>
              </div>
               {/************************************
               /*           MeterPressure
               /***********************************/}

               <div className="alert-metric-container">
                    <div className="alert-numerics">
                       <div className="alert-metric-label">
                        {
                            anomaly_by_type.pressure ? <div><Icon inverted color='red' name='warning sign' />
                             Pressure</div> :
                            <div><Icon inverted color='green' name='dot circle' />Pressure</div>
                        }
                       </div>
                       <div className="alert-metric-value">
                        { String(props.anomaly.MeterPressure) + " psig" }
                      </div>
                    </div>
                    <div className="alert-metric-linegraph">
                        		<ResponsiveContainer height={"140%"} width="110%" >
                  <LineChart data={data}>
                  {anomaly_by_type.pressure && <ReferenceLine x={data[data.length-1].Date} stroke="#f5424e" />}
                    <XAxis tickCount={0} minTickGap={200} dataKey="Date"/>
                    <YAxis domain={[600, 700]}/>
                    <Line dot={false}  dataKey="MeterPressure" strokeWidth={2} stroke="#8884d8" />
                    <Tooltip contentStyle={{backgroundColor: "#222"}}/>
                  </LineChart>
    		</ResponsiveContainer>
                    </div>
              </div>
               {/************************************
               /*              Density
               /***********************************/}

                <div className="alert-metric-container">
                    <div className="alert-numerics">
                       <div className="alert-metric-label">
                        {
                            anomaly_by_type.density ? <div><Icon inverted color='red' name='warning sign' />
                             Density</div> :
                            <div><Icon inverted color='green' name='dot circle' />Density</div>
                        }
                       </div>
                       <div className="alert-metric-value">
                        { String(props.anomaly.ObservedDensity) }
                      </div>
                    </div>
                </div>
                <div className="alert-metric-linegraph">
    		<ResponsiveContainer height={"140%"} width="110%" >
                  <LineChart data={data}>
                  {anomaly_by_type.density && <ReferenceLine x={data[data.length-1].Date} stroke="#f5424e" />}
                    <XAxis tickCount={0} minTickGap={200} dataKey="Date"/>
                    <YAxis domain={[.45, .55]}/>
                    <Line dot={false}  dataKey="ObservedDensity" strokeWidth={2} stroke="#8884d8" />

                    <Tooltip contentStyle={{backgroundColor: "#222"}}/>
                  </LineChart>
    		</ResponsiveContainer>
                </div>
          </div>
        )
    }

export default AlertMetrics


//  <LineChart width={500} height={300} data={data}>
//    <XAxis dataKey="name"/>
//    <YAxis/>
//    <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
//    <Line type="monotone" dataKey="uv" stroke="#8884d8" />
//    <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
//  </LineChart>