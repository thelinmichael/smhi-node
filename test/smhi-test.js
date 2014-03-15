var should = require("should"),
    unit = require("../src/smhi.js");

describe("SMHI", function() {

  it("should fail if the response is not valid for a valid request", function(done) {
    var latitude = 58.59,
        longitude = 16.18;

    unit.getForecastForLatAndLong(latitude, longitude).then(
      function(response) {
        var forecasts = response.getForecasts();
        should.exist(forecasts);
        should.exist(forecasts.length);
        forecasts.length.should.not.equal(0);
        forecasts[0].getLatitude().should.equal(58.548703); // closest node
        forecasts[0].getLongitude().should.equal(16.155116); // closest node
        done();
      },
      function(error) {
        done(error);
      });
  });

});