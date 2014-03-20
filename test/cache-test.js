var should = require("should");

var cacheHandler;

describe("Cache", function() {

  beforeEach(function() {
    cacheHandler = require("../src/cache-handler");
  });

  afterEach(function() {
    cacheHandler.clean();
  });

  it("should fail if it holds on to cache for too long time", function() {
    var url = "http://www.test.se";
    var response = { response : "hello!" };
    var ttl = 1000;

    var savedTime = new Date().getTime();
    cacheHandler.saveInCache(url, response, ttl);
    cacheHandler.inCache(url).should.equal(true);

    while (new Date().getTime() - savedTime < ttl) {
      cacheHandler.getCachedValue(url).should.equal(response);
    }

    var pauseTime = new Date().getTime();
    while (new Date().getTime() - pauseTime < 30) {}

    cacheHandler.inCache(url).should.equal(false);
  });

  it("should not hold on to cache at all", function() {
    var url = "http://www.test.se";
    var response = { response : "hello!" };
    var ttl = -1;

    cacheHandler.saveInCache(url, response, ttl);
    cacheHandler.inCache(url).should.equal(false);
  });

  it("should return undefined if value is not in cache", function() {
    var url = "http://imnotcached.se";
    var cachedValue = cacheHandler.getCachedValue(url);
    should.not.exist(cachedValue);
  });

});