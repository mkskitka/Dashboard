import React, { useEffect, useState } from 'react';
import { FileUtils } from '../../utils/file-utils';
import { useSelector } from 'react-redux';
import './Sidebar.css';
import { Segment, Accordion, Icon, Table, Header, button, Menu } from 'semantic-ui-react';
import Alerts from "../Alerts/Alerts";
import { DataUtils } from '../../utils/data-process'
import { CLUSTER_COLORS } from '../../constants/constants';
import { create, all } from 'mathjs'
import { AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area, Label } from 'recharts';
import { kernelDensityEstimator, kernelEpanechnikov, Ticks, calculateDensities, calulateMin, calulateMax, mergeDatasets} from '../../utils/density';
import $ from 'jquery';
import sprites from '../sprites';
var _ = require('lodash');

const THUMBNAIL_H = 60;
const THUMBNAIL_W = 96;

const config = { }
const math = create(all, config)
const density_height = 150;
const num_ticks = 40;

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
    const selected_clusters = _.pickBy(useSelector(state => state.selected_clusters), function(value, key) { return value; });
    const cluster_labels = DataUtils.getClusterLabels(data)
    const [rerender, setRerender] = useState(true);
    const [density_width, setDensityWidth] = useState(500);
    const [active_index, setActiveIndex] = useState({0: true, 1: false, 2: false});
    const [active_cluster_tab, setActiveClusterTab] = useState(0);

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

    function TableBody(clusters) {
        let content = []
        for (const key of clusters) {
            let cluster_data = DataUtils.getCluster(data, parseInt(key));
            content.push(<Table.Row>{TableColumns(key, cluster_data)}</Table.Row>);
        }
        return content
    }

    function clusterCircleIcon(key) {
        return(<div style={{backgroundColor: CLUSTER_COLORS[key], width: "15px", height: "15px", borderRadius: "10px", display: "inline-block"}}> </div>);
    }

    function ClusterIcon(key)  {
        return( <Header>
            <Header.Content>
                {clusterCircleIcon(key)}
            </Header.Content>
            </Header>
        )
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

    function VarianceTable(cluster_keys) {
        let content = []
        content.push(
                <Table celled inverted >
                <Table.Header>
                    {TableHeader(segmentation_vars)}
                    </Table.Header>
                    <Table.Body>
                    {TableBody(cluster_keys)}
                    </Table.Body>
            </Table>)
        return content;
    }



    function DensityPlot(dataset, i) {
        return (
            <div className="density-plot">
                <AreaChart width={density_width} height={density_height} data={dataset}
                    margin={{ top: 10, right: 10, left: 80, bottom: 22 }}>
                    <XAxis minTickGap={50} dataKey="x" ><Label value={vars_labels[implicit_vars[i]] } angle={0} offset={10}
                     position= 'bottom' style={{fill:'#ccc', fontSize: "80%"}}/></XAxis>
                    <YAxis ></YAxis>
                    {/*AreaGradients(dataset)*/}
                    {AreaLines(dataset)}
                </AreaChart>
            </div>
            );
    }

    function LayeredDensityPlots() {
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
                DensityPlot(dataset, i)
                )
            }
        return content;
    }

    function DensityPlots(key, cluster_data) {
        let content = []
        let range = 100
        content.push(<div className="density_label" style={x_axis_style}>Density</div>)
        for(let i=0; i<implicit_vars.length; i++) {
            let dataset = []
            let value_arr = cluster_data.map(function(obj) { return obj.implicit_vars[implicit_vars[i]]});
            if(value_arr.length !== 0) {
                dataset[key] = value_arr
            }
            var xScaleFunction = linearScale([0, 100], [0, density_width]);
            var ticks = Ticks(num_ticks, range, xScaleFunction)

            dataset = calculateDensities(dataset, ticks)
            dataset = mergeDatasets(dataset, ticks)

            content.push(
                DensityPlot(dataset, i)
                )
            }
        return content;
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

    function SpriteImages(cluster_data, x) {
        let content = []
        for (let rows = 0; rows < x; rows++) {
            for (let cols = 0; cols < x; cols++) {
                const random_datapoint = cluster_data[Math.floor(Math.random() * cluster_data.length)];
                const image_id = random_datapoint.img_id  
                const image_offset = -(image_id * THUMBNAIL_H)
                let sprite_id = random_datapoint.path.split("01-01-")[1]
                sprite_id = sprite_id.replace(/\s+/g, '')
                let sprite_img = sprites[sprite_id]
                content.push(
                    <div className="cluster-sprite" style={{backgroundPosition: "0px " + image_offset+"px", backgroundImage: "url("+sprite_img+")"}} />
			    )
		    }
	    }
        return content;
	}

    function ClusterSummaryWrapper(key) {
        return (
            <div>
                <div style={{height: "50px"}}>
                    3 x 3 Cluster Summaries 
                    <div style={{paddingLeft: "20px", display: "inline-block"}} >
                        <button onClick={() => setRerender(!rerender)}>refresh</button>
                    </div>
                </div>
                <div className="">{ClusterSummary(5, 5, key)}</div>
            </div>
        )
	}

	    function ClusterTabs() {
        let content = [];
        for (const [key, value] of Object.entries(selected_clusters)) {
            const cluster_data = DataUtils.getCluster(data, parseInt(key));
            if(cluster_data.length > 0) {
                content.push(
                    <Segment inverted style={{width: "100%", position: 'relative'}}>
                        <Accordion style={{width: '100%', position: 'relative'}} inverted>
                          <Accordion.Title
                            active={active_cluster_tab === key}
                            index={0}
                          >
                            <Icon name='dropdown'
                                onClick={() => setActiveClusterTab(key)}
                            />
                            {clusterCircleIcon(key)}
                          </Accordion.Title>
                          <Accordion.Content style= {(active_cluster_tab === key) ? {display: "inline-block"} : null} active={active_cluster_tab === key}>
                            {ClusterSummary(3, 3, key, cluster_data)}
                          </Accordion.Content>
                        </Accordion>
                    </Segment>
                )
            }
        }
        return content
	}

    function ClusterSummary(x, y, key, cluster_data) {
        let selected_cluster_labels = DataUtils.getClusterLabels(selected_clusters)
        return(
                <div>
                    {/*************************************************************************
                    *
                    *                        3 x 3 cluster image sample   
                    *
                    /*************************************************************************/}
                    <div className="collage-segment">
                        <div>{x + " X " + y + " Cluster Sample"}</div>
                        <div className="sprites-wrapper" style={{borderStyle: "solid", borderColor: CLUSTER_COLORS[key]}}>
                            {SpriteImages(cluster_data, x)}
                        </div>
                    </div>
                    {/*************************************************************************
                    *
                    *                        Competency Statistics    
                    *
                    /*************************************************************************/}
                    <div className="collage-segment">
                    <div>{"Competency Statistics"}</div>
                        <div className="competency-stats">
                          coming soon 
                        </div>
                    </div>
                    {/*************************************************************************
                    *
                    *                         Segmentation Table
                    *
                    /*************************************************************************/}
                     <div className="variance-table" style={{fontSize: "13px",
                           paddingRight: "0px", paddingTop: "20px"}}>{VarianceTable([key])}</div>
                    {/*************************************************************************
                    *
                    *                         Density Plots
                    *
                    /*************************************************************************/}
                    <div>{DensityPlots(key, cluster_data)}</div>


                </div>
              );
	}


    return (

        <div className="Sidebar">
        <div style={{ width: '100%', height: "100%", position: "relative", textAlign:"Left",
            fontSize: "24px", padding: "10px"}}>
            {/*************************************************************************
            *
            *                               Sidebar Menu  
            *
            /*************************************************************************/}
            <div style={{color: "white! important"}}>
                <Menu inverted pointing secondary>
                    <Menu.Item
                    name='Cross-Cluster Analysis'
                    active={active_index[0]}
                    onClick={() => setActiveIndex({0: true, 1: false, 2: false})}
                    />
                    <Menu.Item
                    name='Intra-Cluster Analysis'
                    active={active_index[1]}
                    onClick={() => setActiveIndex({0: false, 1: true, 2: false})}
                    />
                    <Menu.Item
                    name='Cross-Point Analysis'
                    active={active_index[2]}
                    onClick={() => setActiveIndex({0: false, 1: false, 2: true})}
                    />
                </Menu>
            </div>

            {/*************************************************************************
            *
            *                          Cross-Cluster Analysis  
            *
            /*************************************************************************/}
            {active_index[0] && 
                <Segment className={"Segment"} inverted>
                    <div>
                        <div>Densities By Implicit Variables Across Clusters</div>
                        <div className="density-plots">{LayeredDensityPlots()}</div>
                        <div>
                            <div>Variance of % Segmentation By Category Across Clusters</div>
                            <div className="variance-table" style={{fontSize: "13px",
                                paddingRight: "0px", paddingTop: "20px"}}>{VarianceTable(Object.keys(selected_clusters))}</div>
                        </div>
                    </div>
                </Segment>
            }
            {/*************************************************************************
            *
            *                          Intra-Cluster Analysis  
            *
            /*************************************************************************/}
            {active_index[1] && 
                <Segment className="Segment" inverted>
                    {ClusterTabs()}
                </Segment>
            }
            {/***************************************************************************
            *
            *                          Single Point Analysis  
            *
            /*************************************************************************/}
            {active_index[2] &&  
                <Segment className="Segment" inverted>
                </Segment>
            }
    </div>
    </div>
    );
}

export default Sidebar;



