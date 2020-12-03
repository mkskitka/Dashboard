import React, { useEffect, useState } from 'react';
import { FileUtils } from '../../utils/file-utils';
import { useSelector } from 'react-redux';
import './Sidebar.css';
import { Segment, Accordion, Icon, Table, Header } from 'semantic-ui-react';
import Alerts from "../Alerts/Alerts";
import { DataUtils } from '../../utils/data-process'
import { CLUSTER_COLORS } from '../../constants/constants';
import { create, all } from 'mathjs'
import { AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area, Label } from 'recharts';
import $ from 'jquery';
var _ = require('lodash');



const config = { }
const math = create(all, config)
const density_height = 150;
const num_ticks = 40;
const BANDWIDTH = 1;

var linearScale = require('simple-linear-scale');

const segmentation_vars = ["Bushes", "Cars", "Curb_Wall", "Fence", "Ground", "House", "Road", "Sign", "Sky", "Tree", "?" ]
const implicit_vars = ["percent_dark", "percent_ground", "percent_saturated", "percent_close", "percent_sky"]
const vars_labels = {
    "percent_dark": "% Dark",
    "percent_ground": "% Ground",
    "percent_saturated": "% Saturated",
    "percent_close": "% Closed",
    "percent_sky": "% Sky",
}
const x_axis_style = {
    left: '0px',
    top: "360px",
    position: 'relative',
    width: "100px",

}
function Sidebar() {

  const data = useSelector(state => state.cluster_graph_data)
  const selected_clusters = _.pickBy(useSelector(state => state.selected_clusters), function(value, key) {
      return value;
    });
  const cluster_labels = DataUtils.getClusterLabels(data)
  const [rerender, setRerender] = useState(true);
  const [density_width, setDensityWidth] = useState(500);
  const [active_index, setActiveIndex] = useState({0: true, 1: false});


  // Component Did Mount
  useEffect(() => {
  }, [selected_clusters]);
  useEffect(() => {
    let density_width_new = $(".Sidebar").width() - 100
    setDensityWidth(density_width_new)
  }, [density_width])
  useEffect(() => {
    $(".Accordion-Content").height($(".Sidebar").height())
  }, [])

  function TableHeader(vars) {
        let content = []
        content.push(<Table.HeaderCell>{"Cluster"}</Table.HeaderCell>)
        for(let i=0; i< vars.length; i++) {
            content.push(<Table.HeaderCell>{vars[i]}</Table.HeaderCell>)
        }
        return content;
  }

  function TableBody() {
    let content = []
    for (const [key, value] of Object.entries(selected_clusters)) {
        let cluster_data = DataUtils.getCluster(data, parseInt(key));
        content.push(<Table.Row>{TableColumns(key, cluster_data)}</Table.Row>);
    }
    return content
  }

    function ClusterIcon(key)  {
      return( <Header>
        <Header.Content>
          <div style={{backgroundColor: CLUSTER_COLORS[key], width: "15px", height: "15px", borderRadius: "10px", display: "inline-block"}}> </div>
        </Header.Content>
      </Header>)
    }

  function TableColumns(key, data) {
    let content = []
    if(data.length > 0) {
        content.push(
        <Table.Cell>{
            ClusterIcon(key)
            }</Table.Cell>
        )
        for(let i=0; i<segmentation_vars.length; i++) {
            let value_arr = data.map(function(obj) { return obj.implicit_vars.percent_segmentation[segmentation_vars[i]]});
            value_arr = value_arr.filter(function(x) { return x !== undefined})
            content.push(<Table.Cell>{DataUtils.variance(value_arr).toFixed(2)}</Table.Cell>)
        }
    }
    return content;
  }

  function VarianceTable() {
    let content = []
    content.push(
         <Table celled inverted >
            <Table.Header>
                {TableHeader(segmentation_vars)}
             </Table.Header>
             <Table.Body>
                {TableBody()}
             </Table.Body>
        </Table>)
    return content;
   }

    function DensityPlots() {
        let content = []
        let range = 100
        content.push(<div className="density_label" style={x_axis_style}>Density</div>)
        for(let i=0; i<implicit_vars.length; i++) {
            let dataset = []
            for (const [key, value] of Object.entries(selected_clusters)) {
                let cluster_data = DataUtils.getCluster(data, parseInt(key));
                let value_arr = cluster_data.map(function(obj) { return obj.implicit_vars[implicit_vars[i]]});
                if(value_arr.length !== 0) {
                    dataset[key] = value_arr
                }
            }
            var xScaleFunction = linearScale([0, 100], [0, density_width]);
            var ticks = Ticks(num_ticks, range, xScaleFunction)

            dataset = calculateDensities(dataset, ticks)
            dataset = mergeDatasets(dataset, ticks)

           content.push(
            <div className="density-plot">
            <AreaChart width={density_width} height={density_height} data={dataset}
              margin={{ top: 10, right: 10, left: 80, bottom: 22 }}>
              <XAxis minTickGap={50} dataKey="x" ><Label value={vars_labels[implicit_vars[i]] } angle={0} offset={10} position= 'bottom' style={{fill:'#ccc', fontSize: "80%"}}/></XAxis>
              <YAxis ></YAxis>
              {/*AreaGradients(dataset)*/}
              {AreaLines(dataset)}
            </AreaChart>
            </div>)
          }
        return content;
    }

    function calculateDensities(dataset, ticks) {
        let newDataset = []
        for (const [key, value] of Object.entries(dataset)) {
            var kde = kernelDensityEstimator(kernelEpanechnikov(BANDWIDTH), ticks)
            var density =  kde(value) // Y values
            density = density.map(function(d) {let obj={}; obj[key] = d[1]; return obj})
            newDataset.push(density)
        }
        return newDataset
    }
    function calulateMin(dataset) {
       let mins = []
        for (const [key, value] of Object.entries(dataset)) {
            mins.push(Math.min(...value))
        }
        return Math.min(...mins)
    }
    function calulateMax(dataset) {
       let maxes = []
        for (const [key, value] of Object.entries(dataset)) {
            maxes.push(Math.max(...value))
        }
        return Math.max(...maxes)
    }
    function mergeDatasets(dataset, ticks) {
        let newDataset = []
        for(let x=0; x<ticks.length; x++) {
            newDataset[x] = {}
            for(let i=0; i<dataset.length; i++) {
                newDataset[x] = {
                    ...newDataset[x],
                    ...dataset[i][x]
                }
            }
            newDataset[x].x = ticks[x]
        }
        newDataset = _.filter(newDataset, function(d) {
            let filtered = _.pickBy(d, function(value, key) {   return value !== 0;});
            if(Object.keys(filtered).length > 1){
                return true;
            }
            return false
        })
        return newDataset
    }
    function AreaGradients(dataset) {
        let content = []
       for (const [key, value] of Object.entries(selected_clusters)) {
          content.push(<defs>
            <linearGradient id={key} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CLUSTER_COLORS[key]} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={CLUSTER_COLORS[key]}  stopOpacity={0}/>
            </linearGradient>
          </defs>)
       }
       return content;
    }
    function AreaLines(dataset) {
        let content = []
        for (const [key, value] of Object.entries(selected_clusters)) {
            content.push(
            <Area type="monotone" style={{strokeWidth: "2.5"}} dataKey={key} stroke={CLUSTER_COLORS[key]} fillOpacity={1} fill={"url(#"+ key+ ")"} />)
        }
        return content;
    }

    // Function to compute density
    function kernelDensityEstimator(kernel, X) {
      return function(V) {
        return X.map(function(x) {
          return [x, math.mean( V.map(function(v) { return kernel(x - v); }))];
        });
      };
    }
    function kernelEpanechnikov(k) {
      return function(v) {
        return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
      };
    }
    // Function gets the scaled x values based on the number of ticks you want
    function Ticks(k, x_range, xScale) {
        let segment = x_range/k;
        let ticks = []
        for(let i=1; i<=k; i++){
            ticks.push(i*segment)
        }
        return ticks;
    }

  return (

    <div className="Sidebar">
        <div style={{ width: '100%', height: "100%", position: "relative", textAlign:"Left",
                fontSize: "24px", padding: "10px"}}>
          <Segment className="Segment" inverted>
            <Accordion inverted className="Accordion">
                <Accordion.Title
                  className="Accordion-Title"
                  active={active_index[0]}
                  index={0}
                  onClick={() => setActiveIndex(Object.assign({}, active_index, { 0: !(active_index[0]) }))}
                >
                  <Icon name='dropdown' />
                  Cross-Cluster Summary Analysis
                </Accordion.Title>
                <Accordion.Content active={active_index[0]} className="Accordion-Content" >
                    <div>Densities By Implicit Variables Across Clusters</div>
                    <div className="density-plots">{DensityPlots()}</div>
                    <div>
                        <div>Variance of % Segmentation By Category Across Clusters</div>
                        <div className="variance-table" style={{fontSize: "13px", paddingLeft: "50px",
                            paddingRight: "50px", paddingTop: "20px"}}>{VarianceTable()}</div>
                      </div>
                </Accordion.Content>
            </Accordion>
            <Accordion inverted className="Accordion">
                <Accordion.Title
                  className="Accordion-Title"
                  active={active_index[1]}
                  index={1}
                  onClick={() => setActiveIndex(Object.assign({}, active_index, { 1: !(active_index[1]) }))}
                >
                  <Icon name='dropdown' />
                  Intra-Cluster Summary Analysis
                </Accordion.Title>
                <Accordion.Content active={active_index[1]} className="Accordion-Content">

                </Accordion.Content>
            </Accordion>
           </Segment>
        </div>
    </div>
  );
}

export default Sidebar;


//        content.push(<div style={{float: "left", position: "relative", display: "inline-block"}}><div
//                        style={{marginRight: "10px", fontSize: "16px", left:'0px', position: "relative", display: "inline-block"}}>
//                            {"Cluster "}</div>)



