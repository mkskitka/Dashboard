//  {
//    "x": 100,
//    "y": 200,
//    "z": 200
//  },

import { } from "../constants/constants"
import {
     } from "../constants/constants"

var _ = require('lodash');

/**
 * Data Utilities
 */

var dataUtils = {
    processRaw: function(raw_data) {
        let columns = raw_data[0]
        let processed_data = []
        for(let i=1; i<raw_data.length; i++) {
            let obj = {}
            for(let x=0; x<raw_data[i].length; x++) {
                let field = cleanField(columns[x])
                let value = cleanValue(raw_data[i][x], field)
                obj[field] = value
            }
            obj.img_id = obj.image.replace(".png", '').replace("\\s", "");
            obj.img_id = parseInt(obj.img_id)
            processed_data.push(obj);
        }
        return processed_data;
    },
    getCluster: function(data_arr, cluster_label) {
       return _.filter(data_arr, {cluster: cluster_label});
    },
    getClusterLabels: function(data) {
        let cluster_labels = _.uniq(_.map(data, 'cluster'))
        return cluster_labels
    },
    variance: function(array) {
		var mean = dataUtils.mean(array);
		return dataUtils.mean(array.map(function(num) {
			return Math.pow(num - mean, 2);
		}));
	},
	mean: function(array) {
		return dataUtils.sum(array) / array.length;
	},
	sum: function(array) {
		var num = 0;
		for (var i = 0, l = array.length; i < l; i++) num += array[i];
		return num;
	},
}


function isInt(n) {
   return n % 1 === 0;
}

function cleanField(field) {
    if(field.includes("x")){
        field = "x"
    }
    return field
}

function cleanValue(value, field) {
    let new_value
    if(field === "cluster") {
        new_value = parseInt(value)
    }
    else if(field === "path" || field==="image" || field== "id") {
        return value
    }
    else if(field === "implicit_vars") {
        new_value = JSON.parse(value)
    }
    else {
        new_value = parseFloat(value)
    }
    return new_value
}

function addRawFields(datapoint) {

}

export const DataUtils = {
	processRaw: dataUtils.processRaw,
	getCluster: dataUtils.getCluster,
	getClusterLabels: dataUtils.getClusterLabels,
	variance: dataUtils.variance,
};