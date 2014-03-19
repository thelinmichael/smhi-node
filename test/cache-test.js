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
    var ttl = 1;
    cacheHandler.setTTL(ttl);

    var savedTime = Math.floor(new Date().getTime() / 1000);
    cacheHandler.saveInCache(url, response);

    cacheHandler.inCache(url).should.equal(true);

    while (Math.floor(new Date().getTime() / 1000) - savedTime < ttl + 1) {
      cacheHandler.inCache(url).should.equal(true);
      cacheHandler.getCachedValue(url).should.equal(response);
    }

    cacheHandler.inCache(url).should.equal(false);
  });

  it("should not hold on to cache at all", function() {
    var url = "http://www.test.se";
    var response = { response : "hello!" };
    var ttl = 0;
    cacheHandler.setTTL(ttl);

    var savedTime = Math.floor(new Date().getTime() / 1000);
    cacheHandler.saveInCache(url, response);
    cacheHandler.inCache(url).should.equal(false);
  });

  it("should throw if value isnt cached", function() {
    var url = "http://imnotcached.se";
    (function() {
      cacheHandler.getCachedValue(url);
    }).should.throw();
  });

});