var SMHI = require("../src/smhi");

// When is the rain coming to Gothenburg next time?

// Close to Gothenburg
var latitude = 57.71;
    longitude = 11.97;

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
      // rain is predicted
      if (forecasts[i].getPrecipitationCategory() === SMHI.PrecipitationCategory.RAIN) {
        var nextRain = forecasts[i];
        break;
      }
    }

    if (nextRain) {
      console.log("Next rain will be at " + nextRain.getValidTime().toString());
    } else {
      console.log("It's not going to rain in the next ten days!");
    }
  },
  function(error) {
    console.log("Sorry, something went wrong while getting data from SMHI.")
  }
);