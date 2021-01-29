import React, { useEffect } from 'react';
import { DataUtils } from '../../utils/data-process';
import { useSelector, useDispatch } from 'react-redux';
import "./ClusterView.css"
import { Checkbox } from 'semantic-ui-react';
import { CLUSTER_COLORS } from '../../constants/constants';
import { ScatterChart, Scatter, ZAxis, XAxis, YAxis, ResponsiveContainer,
 Tooltip} from 'recharts';
import sprites from '../sprites';

import {
	ADD_CLUSTER_GRAPH_DATA,
	UPDATE_SELECTED_CLUSTERS,
} from '../../redux/action-types';

 const THUMBNAIL_H = 60;
// const THUMBNAIL_W = 96;


const legend_checkbox_style = {
    width: '20px',
    height: '20px',
    float: 'left',
    marginLeft: '10px',
    marginRight: '10px',

}


function ClusterView() {
  const dispatch = useDispatch();
   const data = useSelector(state => state.cluster_graph_data)
 const selected_clusters = useSelector(state => state.selected_clusters)
 const cluster_labels = DataUtils.getClusterLabels(data)
 const selected_points = useSelector(state => state.selected_points);

  useEffect(() => {
    console.log("updating selected points")
    let newData = DataUtils.setSelected(data, selected_points)
    dispatch({ type: ADD_CLUSTER_GRAPH_DATA, data: newData})
    let newSelectedClusters = Object.assign({}, selected_clusters)
    dispatch({ type: UPDATE_SELECTED_CLUSTERS, selected_clusters: newSelectedClusters})
  }, [selected_points]);


  function handleChange(value) {
    let newSelectedClusters = Object.assign({}, selected_clusters)
    newSelectedClusters[value] = !newSelectedClusters[value]
    dispatch({ type: "UPDATE_SELECTED_CLUSTERS", selected_clusters: newSelectedClusters})
   }

function selectPoint(point) {
    dispatch({ type: "UPDATE_SELECTED_POINTS", selected_point: point})
}

function CustomizedShape(d) {
    return (
        <svg width="100%" height="100%">
        <circle r={d.selected ? 5 : 3} stoke="black" cx={d.x} cy={d.y} strokeWidth={d.selected ? 2: 0} opacity={(d.selected) ? 1 : .7} fill={d.fill} />
        <text x={d.x + 5} y={d.y} fill="white" className="small">{d.selected ? d.num_selected : ""}</text>
        </svg>
    )
}

function Clusters(props) {
    let content = [];
    let cluster_labels = DataUtils.getClusterLabels(data)
    for(let i=0; i<cluster_labels.length; i++) {
        if(selected_clusters[cluster_labels[i]]) {
            let cluster_data = DataUtils.getCluster(data, cluster_labels[i])
            content.push(<Scatter onClick= {(e) => selectPoint(e)} key={cluster_labels[i]} name={cluster_labels[i]}
             shape={(d) => CustomizedShape(d)} data={cluster_data} fill={CLUSTER_COLORS[cluster_labels[i]]} />)
        }
    }
    return content;
}
const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
        let image_offset = -(payload[0].payload.img_id * THUMBNAIL_H)
        let sprite_id = payload[0].payload.path.split("01-01-")[1]
        sprite_id = sprite_id.replace(/\s+/g, '')
        let sprite_img = sprites[sprite_id]
        return (
            <div className="custom-tooltip">
            <div style={{borderColor: CLUSTER_COLORS[payload[0].payload.cluster], borderWeight: '1px',
                backgroundPosition:  "0px " + image_offset+"px" , backgroundImage: "url("+sprite_img+")"}} className="node_image" />
            </div>
        );
    }
    return null;
};

const CustomizedLegend = (props) => {
    let legend = cluster_labels.map(function(entry, index) {
        let num_datapoints = DataUtils.getCluster(data, entry).length
        return(
            <div key={entry}
                style={legend_checkbox_style}>
                <Checkbox
                    value={entry}
                    checked={selected_clusters[entry]}
                    onChange={() =>handleChange(entry)}
                />
                <div style={{ width: '20px', height: '20px', borderRadius: '10px',
                            backgroundColor: CLUSTER_COLORS[entry],
                            }}>
                </div>
                <div style={{color: CLUSTER_COLORS[entry], fontSize: "12px"}}>{"("+num_datapoints+")"}</div>
                </div>)
        })
    return (
        <div style={{
        margin: "0px auto",
        width: '280px',
        position: "relative",
        top: '-120px'
    }}>
        {legend}
    </div>
    );
}


return (
    <div className="ClusterView">
        <div style={{ width: '100%', height: '40px', position: "relative", textAlign: "center", fontSize: "24px", padding: "10px"}}>
            t-SNE Vis: Spectral Clusters of Bottleneck Activation
        </div>
        <div style={{ width: '100%', height: '100%', position: "relative"}}>
            <ResponsiveContainer width="95%" height="88%" >
                <ScatterChart width={730} height={250}
                    margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
                    <XAxis type="number" dataKey="x" name="x" unit=""  />
                    <YAxis dataKey="y" name="y" unit="" />
                    <ZAxis dataKey="z" range={[64, 144]} name="score" unit="km" />
                    <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                    {Clusters()}
                </ScatterChart>
            </ResponsiveContainer>
        </div>
        <CustomizedLegend cluster_labels={cluster_labels}/>
    </div>
);
}

export default ClusterView;