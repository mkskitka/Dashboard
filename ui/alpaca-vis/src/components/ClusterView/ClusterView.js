import React, { useEffect, useState } from 'react';
import { FileUtils } from '../../utils/file-utils';
import { DataUtils } from '../../utils/data-process';
import { useSelector, useDispatch } from 'react-redux';
import "./ClusterView.css"
import { Breadcrumb, Button, Icon, Popup, Checkbox } from 'semantic-ui-react';
import { CLUSTER_COLORS } from '../../constants/constants';
import { ScatterChart, CartesianGrid, Scatter, ZAxis, XAxis, YAxis, ResponsiveContainer,
 Tooltip, Legend } from 'recharts';
import sprites from '../sprites';

 let THUMBNAIL_H = (32400/ 540);


const legend_checkbox_style = {
    width: '20px',
    height: '20px',
    float: 'left',
    marginLeft: '10px',
    marginRight: '10px',

}

const legend_wrapper = {
    margin: "0px auto",
    width: '200px',
    position: "absolute !important",
    top: "-200px !important",
    right: "200px !important"
}



function ClusterView() {
  const dispatch = useDispatch()
  // Component Did Mount
  useEffect(() => {
    console.log("cluster view did mount")
  }, []);


  function handleChange(value) {
    console.log("in handle change", value)
    let newSelectedClusters = Object.assign({}, selected_clusters)
    newSelectedClusters[value] = !newSelectedClusters[value]
    dispatch({ type: "UPDATE_SELECTED_CLUSTERS", selected_clusters: newSelectedClusters})
   }

 const data = useSelector(state => state.cluster_graph_data)
 const selected_clusters = useSelector(state => state.selected_clusters)
 const cluster_labels = DataUtils.getClusterLabels(data)

function Clusters(props) {
    console.log("in cluster function")
    let content = [];
    let cluster_labels = DataUtils.getClusterLabels(data)
    console.log(cluster_labels)
    for(let i=0; i<cluster_labels.length; i++) {
        if(selected_clusters[cluster_labels[i]]) {
            let cluster_data = DataUtils.getCluster(data, cluster_labels[i])
            content.push(<Scatter key={cluster_labels[i]} name={cluster_labels[i]} data={cluster_data} fill={CLUSTER_COLORS[cluster_labels[i]]} />)
        }
    }
    return content;
}
const CustomTooltip = ({ active, payload, label }) => {
  if (active) {
    console.log(payload)

    let image_offset = -(payload[0].payload.img_id * THUMBNAIL_H)

    let sprite_id = payload[0].payload.path.split("01-01-")[1]
    sprite_id = sprite_id.replace(/\s+/g, '')
    let sprite_img = sprites[sprite_id]
    console.log("sprite image: ", sprite_img)
    console.log(image_offset)
    return (
      <div className="custom-tooltip">
        {/*<p className="label">{`${label} : ${payload[0].value}`}</p>*/}
        <div style={{borderColor: CLUSTER_COLORS[payload[0].payload.cluster], borderWeight: '1px',
         backgroundPosition:  "0px " + image_offset+"px" , backgroundImage: "url("+sprite_img+")"}} className="node_image" />
        <div>{"Path: " + payload[0].payload.path + "/" + payload[0].payload.image}</div>
        <div>{"% Close: " + payload[0].payload.implicit_vars.percent_close.toFixed(2)}</div>
        <div>{"% Sky: " + payload[0].payload.implicit_vars.percent_sky.toFixed(2)}</div>
        <div>{"% Dark: " + payload[0].payload.implicit_vars.percent_dark.toFixed(2)}</div>
        <div>{"% Ground: " + payload[0].payload.implicit_vars.percent_ground.toFixed(2)}</div>
        <div>{"% Saturated: " + payload[0].payload.implicit_vars.percent_saturated.toFixed(2)}</div>
      </div>
    );
  }

  return null;
};

const CustomizedLegend = (props) => {
  let legend = cluster_labels.map(function(entry, index) {
        let num_datapoints = DataUtils.getCluster(data, entry).length
        return(
        <div key={entry} style={legend_checkbox_style}>
          <Checkbox value={entry}
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
        <div style={{ width: '100%', height: '40px', position: "relative", textAlign: "center", fontSize: "24px", padding: "10px"}}>t-SNE Vis: Spectral Clusters of Bottleneck Activation</div>
        <div style={{ width: '100%', height: '100%', position: "relative"}}>
            <ResponsiveContainer width="95%" height="88%" >
                <ScatterChart width={730} height={250}
                  margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
                  <XAxis type="number" dataKey="x" name="x" unit=""  />
                  <YAxis dataKey="y" name="y" unit="" />
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