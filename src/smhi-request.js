var Promise = require("es6-promise").Promise,
    needle = require("needle"),
    QueryBuilder = require("./query-builder"),
    Response = require("./smhi-response"),
    cacheHandler = require("./cache-handler");

var Request = function() {};

Request.make = function(lat, lon) {
  var url = new QueryBuilder().latAndLong(lat, lon).build();

  var promise = new Promise(function(resolve, reject) {
    if (cacheHandler.inCache(url)) {
      if (cacheHandler.getCachedValue(url).error) {
        reject(cacheHandler.getCachedValue(url));
      } else {
        resolve(cacheHandler.getCachedValue(url));
      }
    } else {
      needle.get(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          cacheHandler.saveInCache(url, new Response(null, response));
          resolve(new Response(null, body));
        } else {
          cacheHandler.saveInCache(url, new Response(response));
          reject(new Response(response));
        }
      });
    }
  });

  return promise;
};

module.exports = Request;