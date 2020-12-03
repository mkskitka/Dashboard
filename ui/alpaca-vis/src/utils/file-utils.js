/**
 * File Utilities
 */
import axios from 'axios';
import { API_REST } from "../config/devconfig";

//MeterCimarron_May2020_done.xlsx
var test_filename = "subsample.csv";

var fileUtils = {
		importCSV: async function(filename) {
			let query = "file/import";
			query += ("?filename=" + test_filename);

			let url = API_REST + query;
			return await axios.get(url);
		}
}

export const FileUtils = {
	importCSV: fileUtils.importCSV
};