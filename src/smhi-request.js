var Promise = require("es6-promise").Promise,
    needle = require("needle"),
    QueryBuilder = require("./query-builder"),
    Response = require("./smhi-response");

var Request = function() {};

Request.make = function(lat, lon) {
  var url = new QueryBuilder().latAndLong(lat, lon).build();

  var promise = new Promise(function(resolve, reject) {
    needle.get(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(new Response(null, body));
      } else {
        reject(new Response(response));
      }
    });
  });

  return promise;
};

module.exports = Request;