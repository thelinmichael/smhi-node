var Request = require("./smhi-request"),
    Promise = require("es6-promise").Promise;

var SMHI = function(options) {};

SMHI.prototype.getForecastForLatAndLong = function(lat, long) {
  var promise = new Promise(function(resolve, reject) {
    Request(lat, long)
    .done(function(response) {
      resolve(response);
    })
    .fail(function(error) {
      reject(error);
    });
  });
};

module.exports = SMHI;