var Promise = require("es6-promise").Promise,
    needle = require("needle"),
    QueryBuilder = require("./query-builder"),
    Response = require("./smhi-response"),
    cacheHandler = require("./cache-handler"),
    config = require("../config.json");

var Request = function() {};

Request.make = function(lat, lon) {
  var url = new QueryBuilder().latAndLong(lat, lon).build();

  return new Promise(function(resolve, reject) {
    if (config.useCaching && cacheHandler.inCache(url)) {
      if (cacheHandler.getCachedValue(url).error) {
        reject(cacheHandler.getCachedValue(url));
      } else {
        resolve(cacheHandler.getCachedValue(url));
      }
    } else {
      needle.get(url, function (error, response) {
        if (error) {
          reject(new Response(error));
        } else {
          var ttl = Request.getTtlFromHeaders(response);
          if (response.statusCode == 200) {
            if (config.useCaching) {
              cacheHandler.saveInCache(url, new Response(null, response.body), ttl + 1000);
            }
            resolve(new Response(null, response.body));
          } else {
            if (config.useCaching) {
              cacheHandler.saveInCache(url, new Response(response), ttl + 1000);
            }
            reject(new Response(response));
          }
        }
      });
    }
  });
};

Request.getTtlFromHeaders = function(response) {
  if (response && response.headers) {
    var cacheControlHeader = response.headers['cache-control'];
    if (!cacheControlHeader) {
      return 0;
    } else {
      var maxAge = cacheControlHeader.split("=")[1].split(",")[0];
      return parseInt(maxAge);
    }
  } else {
    throw Error("No response headers");
  }
};

module.exports = Request;