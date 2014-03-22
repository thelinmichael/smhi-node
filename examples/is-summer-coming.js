var SMHI = require("../src/smhi");

// Is it going to be 25+ degrees in Stockholm in the next ten days?

// Stockholm
var latitude = 58.638217;
    longitude = 16.102653;

SMHI.getForecastForLatAndLong(latitude, longitude).then(
  function(response) {

    // Get forecasts
    var forecasts = response.getForecasts();

    // Go through all the forecasts
    for (var i = 0; i < forecasts.length; i++) {

      // Skip to next forecast if time for forecast has already happened
      if (new Date().getTime() > forecasts[i].getValidTime()) {
        continue;
      }

      // Since the forecasts are returned in chronological order, just return immediately if
      // there is a day with 25+ degrees.
      if (forecasts[i].getTemperature() >= 25) {
        var summerTime = forecasts[i];
        break;
      }
    }

    if (summerTime) {
      console.log("Buy a swimsuit, summer is coming on " + summerTime.getValidTime().toString());
    } else {
      console.log("No summer in sight!");
    }
  },
  function(error) {
    console.log("Sorry, something went wrong while getting data from SMHI.")
  }
);