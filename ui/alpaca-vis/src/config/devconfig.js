/**
 * Configuration file to set api location for development/deployment
 */
var apiLocation = window.location.host + "/springserver/";

if (process.env.NODE_ENV === 'development') {
	apiLocation = "localhost:8080/"
}

export const API_REST = window.location.protocol + "//" + apiLocation;