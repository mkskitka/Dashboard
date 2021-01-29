
/**
 * Conceptual Approach Reducers
 */
import {
	ADD_CLUSTER_GRAPH_DATA,
	UPDATE_SELECTED_CLUSTERS,
	UPDATE_SELECTED_POINTS,
} from './action-types';

var _ = require('lodash');

const initialState = {
		cluster_graph_data: [],
		selected_clusters: {0: true, 1: true, 2: true, 3: true, 4: true, 5: true,  6: true, 7: true},
		selected_points: [],
};


function tailwaterReducer(state = initialState, action) {

	switch(action.type) {
	 case ADD_CLUSTER_GRAPH_DATA :
        return Object.assign({}, state, {
            cluster_graph_data: action.data
        })
     case UPDATE_SELECTED_CLUSTERS :
        return Object.assign({}, state, {
            selected_clusters: action.selected_clusters
      })
     case UPDATE_SELECTED_POINTS :
        const id = action.selected_point.id;
        if(typeof _.find(state.selected_points, function(o) {return o.id === id}) === "undefined"){
            action.selected_point.selected = true;
            let newPoints = Object.assign([], state.selected_points);
            newPoints.push(action.selected_point);
            return Object.assign({}, state, {
                selected_points: newPoints,
            })
        }
        else {
            let newPoints = Object.assign([], state.selected_points)
            action.selected_point.selected = false;
            _.remove(newPoints, function(n) { return n.id === id;});
            return Object.assign({}, state, {
                selected_points: newPoints,
            });
        }
	default:
		return state;
	}
}

export default tailwaterReducer;