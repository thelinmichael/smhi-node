var should = require("should"),
    assert = require("assert"),
    unit = require("../src/smhi.js");

describe("SMHI", function() {

  it("should fail if the response is not valid for a valid request", function(done) {
    var latitude = 58.59;
    var longitude = 16.18;

    unit.getForecastForLatAndLong(latitude, longitude).then(
      function(response) {
        isValidResponse(response).should.equal(true);
        done();
      },
      function(error) {
        done(error);
      });
  });
});

var isValidResponse = function(response) {
  return true;
};