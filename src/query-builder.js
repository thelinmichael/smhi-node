var config = require("../config");

var QueryBuilder = function() {
  this.query = this.buildBaseUrl();
};

var latAndLong = function(lat, lon) {
  this.query += "geopoint/";
  this.query += "lat/" + lat;
  this.query += "lon/" + lon;
  this.query += "/";
};

var buildBaseUrl = function() {
  return config.host + ":" + config.port + config.apiBasePath;
};

var build = function() {
  this.query += "data.json";
  return this.query;
};