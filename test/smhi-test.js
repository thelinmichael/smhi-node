var should = require("should"),
    unit = require("../src/smhi.js"),
    cacheHandler = require("../src/cache-handler");

describe("SMHI", function() {

  beforeEach(function() {
    cacheHandler.clean();
  });

  afterEach(function() {
    cacheHandler.clean();
  });

  it("should fail if the response is not valid for a valid request", function(done) {
    var latitude = 58.59,
        longitude = 16.18;

    unit.getForecastForLatAndLong(latitude, longitude).then(
      function(response) {
        var forecasts = response.getForecasts();
        should.exist(forecasts);
        should.exist(forecasts.length);
        forecasts.length.should.not.equal(0);
        forecasts[0].getLatitude().should.equal(58.638217); // closest node
        forecasts[0].getLongitude().should.equal(16.102653); // closest node
        done();
      },
      function(response) {
        done(response);
      });
  });

  it("should pass readme example", function(done) {
    var SMHI = require("../src/smhi"),
    latitude = 58.59,
    longitude = 16.18;

    SMHI.getForecastForLatAndLong(latitude, longitude).then(
      function(response) {
        var forecasts = response.getForecasts();

        var records = {
          highest : forecasts[0],
          lowest : forecasts[0]
        };
        forecasts.slice(1).forEach(function(forecast) {
          if (records.highest.getTemperature() < forecast.getTemperature()) {
            records.highest = forecast;
          } else if (records.lowest.getTemperature > forecast.getTemperature()) {
            records.lowest = forecast;
          }
        });

        should.exist(records.highest.getTemperature());
        should.exist(records.highest.getValidTime());
        should.exist(records.lowest.getTemperature());
        should.exist(records.lowest.getValidTime());
        records.highest.getTemperature().should.not.be.lessThan(records.lowest.getTemperature());
        done();
      },
      function(response) {
        done(response);
      });
  });

  it("should fail if response statuscode is not a 400, since the coordinates are out of bounds", function(done) {
    var SMHI = require("../src/smhi"),
    latitude = 92, // Impossible coordinate
    longitude = 0;

     SMHI.getForecastForLatAndLong(latitude, longitude).then(
      function(response) {
        done({ error: "Should have failed" });
      },
      function(response) {
        response.error.statusCode.should.equal(400);
        done();
      });
  });

  it("should get the closest gridpoint to some coordinate", function(done) {
    var SMHI = require("../src/smhi"),
        latitude = 59, // Pretty much Stockholm
        longitude = 16;

     SMHI.getClosestGridpointForLatAndLong(latitude, longitude).then(
      function(response) {
        response.lat.should.equal(59.0397);
        response.lon.should.equal(15.921284);
        done();
      },
      function(response) {
        response.error.statusCode.should.equal(400);
        done();
      });
  });

  it("should fail if the precipitation categories don't match", function() {
    var SMHI = require("../src/smhi");

    SMHI.PrecipitationCategory.NONE.should.equal(0);
    SMHI.PrecipitationCategory.SNOW.should.equal(1);
    SMHI.PrecipitationCategory.SNOW_MIXED_WITH_RAIN.should.equal(2);
    SMHI.PrecipitationCategory.RAIN.should.equal(3);
    SMHI.PrecipitationCategory.DRIZZLE.should.equal(4);
    SMHI.PrecipitationCategory.FREEZING_RAIN.should.equal(5);
    SMHI.PrecipitationCategory.FREEZING_DRIZZLE.should.equal(6);
  });

});