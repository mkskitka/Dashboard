/**
 * Conceptual Approach Reducers
 */
import {
	ADD_CLUSTER_GRAPH_DATA,
	UPDATE_SELECTED_CLUSTERS,
} from './action-types';


const initialState = {
		cluster_graph_data: [],
		selected_clusters: {0: true, 1: true, 2: true, 3: true, 4: true, 5: true,  6: true, 7: true},
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
	default:
		return state;
	}
}

export default tailwaterReducer;