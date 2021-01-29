import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Sidebar.css';
import { Segment, Accordion, Table, Header, Menu, Icon } from 'semantic-ui-react';
import { DataUtils } from '../../utils/data-process'
import { CLUSTER_COLORS } from '../../constants/constants';
import { AreaChart, XAxis, YAxis, Area, Label } from 'recharts';
import {  Ticks, calculateDensities, mergeDatasets} from '../../utils/density';
import $ from 'jquery';
import sprites from '../sprites';
import {
	UPDATE_SELECTED_CLUSTERS,
	UPDATE_SELECTED_POINTS,
} from '../../redux/action-types';
var _ = require('lodash');

const THUMBNAIL_H = 60;
//const THUMBNAIL_W = 96;
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
    const dispatch = useDispatch();
    const data = useSelector(state => state.cluster_graph_data)
    const selected_clusters = _.pickBy(useSelector(state => state.selected_clusters), function(value, key) { return value; });
    const [density_width, setDensityWidth] = useState(500);
    const [active_index, setActiveIndex] = useState({0: true, 1: false, 2: false});
    const [active_cluster_tab, setActiveClusterTab] = useState(1);
    const selected_points = useSelector(state => state.selected_points);

    useEffect(() => {
        let density_width_new = $(".Sidebar").width() - 100
        setDensityWidth(density_width_new)
        }, [density_width])
        useEffect(() => {
        $(".Accordion-Content").height($(".Sidebar").height())
    }, [])

    function TableHeader(vars, key) {
        let content = []
        content.push(<Table.HeaderCell key={key}>{"Cluster"}</Table.HeaderCell>)
        for(let i=0; i< vars.length; i++) {
            content.push(<Table.HeaderCell key={"key"+vars[i]}>{vars[i]}</Table.HeaderCell>)
        }
        return content;
    }
        function TableHeaderDatapoint(vars) {
        let content = []
        for(let i=0; i< vars.length; i++) {
            content.push(<Table.HeaderCell>{vars[i]}</Table.HeaderCell>)
        }
        return content;
    }

    function TableBody(clusters) {
        let content = []
        for (const key of clusters) {
            let cluster_data = DataUtils.getCluster(data, parseInt(key));
            content.push(<Table.Row key={key+ "row"}>{TableColumns(key, cluster_data)}</Table.Row>);
        }
        return content
    }
    function TableBodyDatapoint(d) {
        return(<Table.Row>{TableColumnsDatapoint(d)}</Table.Row>);
    }
    function TableColumnsDatapoint(d) {
        let content = []
            for(let i=0; i<segmentation_vars.length; i++) {
                let value = d.implicit_vars.percent_segmentation[segmentation_vars[i]];
                content.push(<Table.Cell>{(typeof value !== "undefined" ) ? value.toFixed(2) : "N/a"}</Table.Cell>)
            }
        return content;
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
            <Table.Cell key={key+"col"}>{
                ClusterIcon(key)
                }</Table.Cell>
            )
            for(let i=0; i<segmentation_vars.length; i++) {
                let value_arr = data.map(function(obj) { return obj.implicit_vars.percent_segmentation[segmentation_vars[i]]});
                value_arr = value_arr.filter(function(x) { return x !== undefined})
                content.push(<Table.Cell key={key+i+ "coll"}>{DataUtils.variance(value_arr).toFixed(2)}</Table.Cell>)
            }
        }
        return content;
    }

    function VarianceTable(cluster_keys) {
        let content = []
        content.push(
                <Table celled key={cluster_keys+ "table"} inverted >
                <Table.Header>
                    {TableHeader(segmentation_vars, "varience_table")}
                    </Table.Header>
                    <Table.Body>
                    {TableBody(cluster_keys)}
                    </Table.Body>
            </Table>)
        return content;
    }



    function DensityPlot(dataset, i) {
        if(data.length > 0) {
            console.log("Density Plot Dataset cluster_data", i, " :",  dataset);
            console.log(JSON.stringify(dataset))
        }
        return (
            <div key={i+"densityplot"} className="density-plot">
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
        content.push(<div key={"density-label"} className="density_label" style={x_axis_style}>Density</div>)
        for(let i=0; i<implicit_vars.length; i++) {
            let dataset = []
            for (const key of Object.keys(selected_clusters)) {
                let cluster_data = DataUtils.getCluster(data, parseInt(key));
                let value_arr = cluster_data.map(function(obj) { return obj.implicit_vars[implicit_vars[i]]});
                if(value_arr.length !== 0) {
                    dataset[key] = value_arr
                }
            }
            var xScaleFunction = linearScale([0, 100], [0, density_width]);
            var ticks = Ticks(num_ticks, range, xScaleFunction)
            if(data.length > 0) {
                console.log(" Layered Density Plot Dataset (Pre Processing) ", i, " :",  dataset);
                console.log(JSON.stringify(dataset[0]))
            }
            dataset = calculateDensities(dataset, ticks)
            dataset = mergeDatasets(dataset, ticks)
            if(data.length > 0) {
                 console.log(" Layered Density Plot Dataset ", i, " :",  dataset);
                console.log(JSON.stringify(dataset[0]))
            }
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

//    function AreaGradients(dataset) {
//       let content = []
//       for (const [key, value] of Object.entries(selected_clusters)) {
//          content.push(<defs>
//            <linearGradient id={key} x1="0" y1="0" x2="0" y2="1">
//              <stop offset="5%" stopColor={CLUSTER_COLORS[key]} stopOpacity={0.8}/>
//              <stop offset="95%" stopColor={CLUSTER_COLORS[key]}  stopOpacity={0}/>
//            </linearGradient>
//          </defs>)
//       }
//       return content;
//    }

    function AreaLines(dataset) {
        let content = []
        for (const key of Object.keys(selected_clusters)) {
            content.push(
            <Area type="monotone" style={{strokeWidth: "2.5"}} dataKey={key} key={key+"AreaLines"} stroke={CLUSTER_COLORS[key]} fillOpacity={1} fill={"url(#"+ key+ ")"} />)
        }
        return content;
    }

    function findRandomUnusedIndex(cluster_data, used_indices) {
        var index =  Math.floor(Math.random() * cluster_data.length);
        while(used_indices.includes(index)) {
            index =  Math.floor(Math.random() * cluster_data.length);
        }
        return index;
    }

    function SpriteImages(cluster_data, x) {
        let content = []
        let used_indices = []
        for (let rows = 0; rows < x; rows++) {
            for (let cols = 0; cols < x; cols++) {
                if(used_indices.length === cluster_data.length) {
                    return content;
                }
                const random_index = findRandomUnusedIndex(cluster_data, used_indices);
                used_indices.push(random_index);
                const random_datapoint = cluster_data[random_index];
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

	    function ClusterTabs() {
        let content = [];
        for (const key of Object.keys(selected_clusters)) {
             if(data.length > 0) {
                console.log("all data (in sidebar - post initial processing): ", data)
                console.log(JSON.stringify(data[0]))
              }
            const cluster_data = DataUtils.getCluster(data, parseInt(key));
            if(cluster_data.length > 0) {
                content.push(
                    <Segment inverted style={{width: "100%", position: 'relative', marginTop: '20px'}}>
                        <Accordion style={{width: '100%', position: 'relative'}} inverted>
                          <Accordion.Title
                            active={active_cluster_tab === key}
                            index={0}
                          >
                            <Icon name='dropdown'
                                onClick={() => (active_cluster_tab === key) ? setActiveClusterTab(-1) : setActiveClusterTab(key)}
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
	function deletePoint(point) {
        dispatch({ type: UPDATE_SELECTED_POINTS, selected_point: point})
            let newSelectedClusters = Object.assign({}, selected_clusters)
    dispatch({ type: UPDATE_SELECTED_CLUSTERS, selected_clusters: newSelectedClusters})
	}

	function Datapoints() {
	    let content = [];
	    if(selected_points.length === 0) {
	        return(<div style={{opacity: ".5", fontSize: "14px", textAlign: "center"}}>Select Data Point in t-SNE graph for Viewing</div>)
	    }
	    for(let i=0; i<selected_points.length; i++) {
            let image_offset = -(selected_points[i].img_id * THUMBNAIL_H)
            let sprite_id = selected_points[i].path.split("01-01-")[1]
            sprite_id = sprite_id.replace(/\s+/g, '')
            let sprite_img = sprites[sprite_id]
	        content.push (
	        <div>
	                        <div style={{width: '10px', position: "relative", float: "left"}}>{i +"."}</div>
	             <div style={{borderColor: CLUSTER_COLORS[selected_points[i].cluster], borderStyle: "solid", borderWeight: '4px', width: "90px", float: "left", margin: '20px',
                backgroundPosition:  "0px " + image_offset+"px" , position: "relative", backgroundImage: "url("+sprite_img+")"}} className="node_image" />

    <Icon onClick={() => deletePoint(selected_points[i])} style={{position: "relative", float: "right", top: '10px'}}  name='close' />

                <div className="variance-table" style={{fontSize: "13px",
                           paddingRight: "0px", paddingTop: "20px"}}>
                <Table celled inverted >
                <Table.Header>
                    {TableHeaderDatapoint(segmentation_vars)}
                </Table.Header>
                    <Table.Body>
                    {TableBodyDatapoint(selected_points[i])}
                    </Table.Body>
                    </Table>
                    </div>
                    </div>
	        );
	    }
	    return content;
	}

    function ClusterSummary(x, y, key, cluster_data) {
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
                        <div style={{opacity: ".5", fontSize: "14px", textAlign: "center"}} className="competency-stats">
                          coming soon
                        </div>
                    </div>
                    {/*************************************************************************
                    *
                    *                         Segmentation Table
                    *
                    /*************************************************************************/}
                     <div style={{marginTop: "10px", width: "100%", position: "relative"}}>{"% Segmentation"}</div>
                     <div className="variance-table" style={{fontSize: "13px",
                           paddingRight: "0px", paddingTop: "20px"}}>{VarianceTable([key])}</div>
                    {/*************************************************************************
                    *
                    *                         Density Plots
                    *
                    /*************************************************************************/}
                    <div style={{width: "100%", position: "relative", marginTop: '20px'}}>{"Densities by Implicit Variable"}</div>
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
                    {Datapoints()}
                </Segment>
            }
    </div>
    </div>
    );
}

export default Sidebar;



