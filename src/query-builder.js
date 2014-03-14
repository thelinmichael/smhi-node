var config = require("../config");

var QueryBuilder = function() {
  this.query = this.buildBaseUrl();
};

QueryBuilder.prototype.latAndLong = function(lat, lon) {
  this.query += "geopoint/";
  this.query += "lat/" + lat + "/";
  this.query += "lon/" + lon + "/";

  return this;
};

QueryBuilder.prototype.buildBaseUrl = function() {
  return config.host + ":" + config.port + config.apiBasePath;
};

QueryBuilder.prototype.build = function() {
  this.query += "data.json";
  return this.query;
};

module.exports = QueryBuilder;