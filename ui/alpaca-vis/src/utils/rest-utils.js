/**
 * File Utilities
 */
import axios from 'axios';
import { API_REST } from "../config/devconfig";

var restUtils = {
		importModelData: async function(payload) {
			let query = "metamodel/user";

			let url = API_REST + query;
			let headers = {
				'Content-Type' : 'text/plain'
			}
			return await axios.post(url, payload, {headers: headers})
			},
		getNextQuestions: async function(payload) {
			let query = "sfg/classes";

			let url = API_REST + query;
			let headers = {
				'Content-Type' : 'application/json'
			}
			return await axios.post(url, payload, {headers: headers})
			},
		parseHypothesis: async function(payload) {
		    let query = "sfg/parseraw"
		    let url = API_REST + query;
            let headers = {
                'Content-Type' : 'text/plain'
            }
            return await axios.post(url, payload, {headers: headers})
		},
        callMetaModel: async function(payload) {
            let query = "metamodel/coseval"
            let url = API_REST + query;
            let headers = {
                'Content-Type' : 'text/plain'
            }
            return await axios.post(url, payload, {headers: headers})
        }
}

export const RestUtils = {
	importModelData: restUtils.importModelData,
	getNextQuestions: restUtils.getNextQuestions,
	parseHypothesis: restUtils.parseHypothesis,
	callMetaModel: restUtils.callMetaModel,
};