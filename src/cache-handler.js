var config = require("../config.json"),
    _cacheHandler;

var CacheHandler = function() {
  this._cachedUrls = {};
  this._ttl = config._cacheTTL;
};

CacheHandler.prototype.inCache = function(url) {
  return (this._urlExistsInCache(url) && !this._cachedValueTimedOut(url));
};

CacheHandler.prototype.saveInCache = function(url, response) {
  if (!this._ttl) {
    return;
  }
  this._cachedUrls[url] = {
    savedTime : Math.floor(new Date().getTime() / 1000),
    response : response
  };
};

CacheHandler.prototype.getCachedValue = function(url) {
  if (!this._cachedUrls[url]) {
    throw Error("URL not cached");
  }
  return this._cachedUrls[url].response;
};

CacheHandler.prototype.clean = function(clean) {
  this._cachedUrls = {};
};

CacheHandler.prototype._urlExistsInCache = function(url) {
  return this._cachedUrls[url] !== undefined;
};

CacheHandler.prototype._cachedValueTimedOut = function(url) {
  if (this._cachedUrls[url]) {
    return Math.floor(new Date().getTime() / 1000) > this._cachedUrls[url].savedTime + this._ttl;
  } else {
    return true;
  }
};

CacheHandler.prototype.setTTL = function(ttl) {
  this._ttl = ttl;
};

var _getInstance = function() {
  if (!_cacheHandler) {
    _cacheHandler = new CacheHandler();
  }
  return _cacheHandler;
};

module.exports = _getInstance();