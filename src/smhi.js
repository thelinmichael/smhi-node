var Request = require("./smhi-request"),
    Response = require("./smhi-response"),
    Promise = require("es6-promise").Promise;

var SMHI = function() {};

SMHI.getForecastForLatAndLong = function(lat, lon) {
  var promise = new Promise(function(resolve, reject) {
    Request.make(lat, lon).then(
      function(response) {
        resolve(response);
      },
      function(error) {
        reject(error);
      }
    );
  });
  return promise;
};

SMHI.getClosestGridpointForLatAndLong = function(lat, lon) {
  var promise = new Promise(function(resolve, reject) {
    Request.make(lat, lon).then(
      function(response) {
        resolve({
          lat : response.getJSON().lat,
          lon : response.getJSON().lon
        });
      },
      function(error) {
        reject(error);
      }
    );
  });
  return promise;
};

SMHI.PrecipitationCategory = {
  NONE : 0,
  SNOW : 1,
  SNOW_MIXED_WITH_RAIN : 2,
  RAIN : 3,
  DRIZZLE : 4,
  FREEZING_RAIN : 5,
  FREEZING_DRIZZLE : 6
};

module.exports = SMHI;