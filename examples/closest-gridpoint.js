var SMHI = require("../src/smhi");

// Closest gridpoint to Gävle's central square

var latitude = 60.674839;
    longitude = 17.142034;

SMHI.getClosestGridpointForLatAndLong(latitude, longitude).then(
  function(coordinates) {
    console.log("Gävle's central square gridpoint is at latitude: " + latitude + ", longitude: " + longitude);
    console.log("The closest gridpoint is at latitude: " + coordinates.lat + ", longitude: " + coordinates.lon);
  },
  function(error) {
    console.log("Sorry, something went wrong while getting data from SMHI.")
  }
);