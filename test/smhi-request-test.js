var Request = require("../src/smhi-request"),
    should = require("should");

describe("Request", function() {

  it("should throw an exception if headers are not found on the response", function() {
    var response = {};
    (function() {
      Request.getTtlFromHeaders(response);
    }).should.throw();
  });

  it("should get maxage from headers", function() {
    var response = {
      headers : {
        "cache-control" : "max-age=3600,public"
      }
    };
    Request.getTtlFromHeaders(response).should.equal(3600);
  });

});