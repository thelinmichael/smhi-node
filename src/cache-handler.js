var config = require("../config.json"),
    _cacheHandler;

var CacheHandler = function() {
  this._cachedUrls = {};
};

/**
 * @param {String} url The url to see if it's in the cache
 * @returns {Boolean} true if the url is in the cache, false otherwise
 */
CacheHandler.prototype.inCache = function(url) {
  return (this._urlExistsInCache(url) && !this._cachedValueTimedOut(url));
};

/**
 * Place a result in the cache.
 * @param {String} url The url to cache
 * @param {Object} response The cached respone
 * @param {Number} ttl The number of seconds to keep the cached result
 */
CacheHandler.prototype.saveInCache = function(url, response, ttl) {
  this._cachedUrls[url] = {
    ttl : new Date().getTime() + ttl,
    response : response
  };
};

/**
 * Get a cached value for a given url.
 * @param {String} url The url to get the cached value for
 * @returns {Object} The cached response for the url, if there is one.
 * If the value isn't cached, undefined is returned
 */
CacheHandler.prototype.getCachedValue = function(url) {
  if (this.inCache(url)) {
    return this._cachedUrls[url].response;
  }
};

/**
 * Clean the cached values.
 */
CacheHandler.prototype.clean = function() {
  this._cachedUrls = {};
};

CacheHandler.prototype._urlExistsInCache = function(url) {
  return this._cachedUrls[url] !== undefined;
};

CacheHandler.prototype._cachedValueTimedOut = function(url) {
  if (this._cachedUrls[url]) {
    return (new Date().getTime() - this._cachedUrls[url].ttl > 0);
  } else {
    return false;
  }
};

var _getInstance = function() {
  if (!_cacheHandler) {
    _cacheHandler = new CacheHandler();
  }
  return _cacheHandler;
};

module.exports = _getInstance();