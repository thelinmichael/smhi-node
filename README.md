## About

**smhi-node** is a JavaScript wrapper for the [Swedish Meteorological and Hydrological Institute](http://www.smhi.se/en)'s (SMHI) [weather forecast API](http://www.smhi.se/klimatdata/Oppna-data/Meteorologiska-data/api-for-vaderprognosdata-1.34233) (text in Swedish), packaged as a Node.js module.

[![Build Status](https://travis-ci.org/thelinmichael/smhi-node.png?branch=master)](https://travis-ci.org/thelinmichael/smhi-node)

## SMHI's weather API
Given latitude and longitude, SMHI's API returns weather forecast information from the time of the request to ten days into the future. Forecasts include properties such as direction and velocity of winds, type and intensity of precipitation, and temperature. Full list of properties can be found [here](http://www.smhi.se/polopoly_fs/1.34248!Parameterlista%20API%20ver%20131118.xlsx) (Excel file). Hourly forecasts for the first days, but become less regular as time approaches ten days from the request.

Example response for Stockholm:

[http://opendata-download-metfcst.smhi.se/api/category/pmp1g/version/1/geopoint/lat/58.59/lon/16.18/data.json](http://opendata-download-metfcst.smhi.se/api/category/pmp1g/version/1/geopoint/lat/58.59/lon/16.18/data.json)
```
{
  lat: 58.548703,
  lon: 16.155116,
  referenceTime: "2014-03-14T20:00:00Z",
  timeseries: [
  {
    validTime: "2014-03-14T21:00:00Z",
    msl: 990.8,
    t: 5.3,
    vis: 16,
    wd: 211,
    ws: 6.6,
    r: 87,
    tstm: 0,
    tcc: 6,
    lcc: 5,
    mcc: 8,
    hcc: 6,
    gust: 10.2,
    pit: 1.7,
    pis: 0,
    pcat: 3
  },
  {
    validTime: "2014-03-14T22:00:00Z",
    msl: 990,
    t: 5.1,
    vis: 7,
    wd: 224,
    ws: 7.1,
    r: 93,
    tstm: 0,
    tcc: 7,
    lcc: 7,
    mcc: 8,
    hcc: 8,
    gust: 14.6,
    pit: 1,
    pis: 0,
    pcat: 3
    },
    ... (and so on, ten days into the future)
}
```


### Wrapper Examples
Below are two examples of wrapper use cases, using same query and getting the same response shown above.

### Will it rain during the next hour?

```javascript
var SMHI = require("smhi-node"),
  latitude = 58.59, // Stockholm
  longitude = 16.18;

SMHI.getForecastForLatAndLong(latitude, longitude).then(
  function(response) {
    var forecasts = response.getForecasts();
    var nextHour = forecasts[0];

    if (nextHour.getPrecipitationCategory() === SMHI.Response.PrecipitationCategory.RAIN) {
      console.log("It will rain");
    } else {
      console.log("Yay, it won't rain!");
    }
  },
  function(error) {
    console.log("I didn't manage to find out, sorry.", error);
  });
});
```

### What will be the highest and lowest temperature for the next ten days?
```javascript
var SMHI = require("smhi-node"),
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

    // Highest temperature: 9.6°C on 2014-03-22T12:00:00Z
    console.log("Highest temperature: " + records.highest.getTemperature() + "°C on " + records.highest.getValidTime());
    // Lowest temperature: 5.3°C on 2014-03-14T21:00:00Z
    console.log("Lowest temperature: " + records.lowest.getTemperature() + "°C on " + records.lowest.getValidTime()); // 5.3°C
  },
  function(error) {
     console.log("I didn't manage to find out, sorry.", error);
  });
});
```

## Installation
```
npm install smhi-node --save
```

## Wrapper Reference
### SMHI
```javascript
/**
 * Get weather forecasts for a specified coordinate.
 * @param {Number} lat The latitude of the location you want forecasts for
 * @param {Number} lon The longitude of the location you want forecasts for
 * @returns {Promise} Returns a ES6 compatible promise that resolves to a {SMHI Response} object
 */
SMHI.getForecastForLatAndLong(lat, lon)
```

### SMHI Response
There's no need to create a new SMHI Response with its constructor.
```javascript
/**
 * Get the forecasts that is contained within the SMHI Response.
 * @returns {Forecast[]} The forecasts
 */
getForecasts()

/*
 * @returns {Number} Latitude of the closest measuring node
 */
getLatitude()

/*
 * @returns {Number} Longitude of the nearest measuring node
 */
getLongitude()

/*
 * @returns {String} Time when the forecast request was made
 */
getReferenceTime()

/**
 * Enum for precipitation categories.
 * @enum {Number}
 */
 PrecipitationCategory
  NONE (0)
  SNOW (1)
  SNOW_MIXED_WITH_RAIN (2)
  RAIN (3)
  DRIZZLE (4)
  FREEZING_RAIN (5)
  FREEZING_DRIZZLE (6)
```

### Forecast
There's no need to create a new Forecast with its constructor.

```javascript
  /*
   * @returns {Number} Latitude of the closest measuring node
   */
  getLatitude()

  /*
   * @returns {Number} Longitude of the nearest measuring node
   */
  getLongitude()

  /*
   * @returns {String} Time when the forecast request was made
   */
  getReferenceTime()

  /*
   * @returns {String} Time of the forecast
   */
  getValidTime()

  /*
   * @returns {Number} Air pressure at sealevel in hPa
   */
  getMeanSeaLevel()

  /*
   * @returns {Number} Temperature in Celsius
   */
  getTemperature()

  /*
   * @returns {Number} Visibility in kilometers, one decimal
   */
  getVisibility()

  /*
   * @returns {Number} Wind direction (Degrees, one decimal)
   */
  getWindDirection()

  /*
   * @returns {Number} Wind Velocity (m/s, one decimal)
   */
  getWindVelocity()

  /*
   * @returns {Number} Wind gust (m/s, one decimal)
   */
  getGust()

  /*
   * @returns {Number} Relative humidity (%, integers)
   */
  getRelativeHumidity()

  /*
   * @returns {Number} Probability of thunderstorm (%, integers)
   */
  getThunderstormProbability()

  /*
   * @returns {Number} Total cloud cover (0-8)
   */
  getTotalCloudCover()

  /*
   * @returns {Number} Low cloud cover (0-8)
   */
  getLowCloudCover()

  /*
   * @returns {Number} Medium cloud cover (0-8)
   */
  getMediumCloudCover()

  /*
   * @returns {Number} High cloud cover (0-8)
   */
  getHighCloudCover()

  /*
   * @returns {Number} Rain (millimeter per hour, one decimal)
   */
  getTotalPrecipitationIntensity()

  /*
   * @returns {Number} Snow (millimeter per hour of melted snow, one decimal)
   */
  getSnowPrecipitationIntensity()

  /*
   * @returns {Number} SMHI internal precipitation category (0-6)
   * 0: No precipitation
   * 1: Snow
   * 2: Mixed snow and rain
   * 3: Rain
   * 4: Drizzle
   * 5: Freezing rain
   * 6: Freezing drizzle
   */
  getPrecipitationCategory()

  /*
   * @returns {Boolean} True if no snow or rain (precipitation category 0),
   * otherwise false
   */
  noPrecipitation()
```

## Development
### Prerequisites

```
# Clone the repository
https://github.com/thelinmichael/smhi-node.git
```

```
# Install Grunt in order to tasks
npm install -g grunt-cli
```

```
# Install dependencies
npm install
```

### Tests
```
# Run tests and Javascript linting
grunt
```

## To do
+ Cache results (waiting for SMHI regarding how often the forecasts are updated)
+ Ability to get coordinates of closest grid node given latitude and longitude
+ Return a Javascript Date instead of just a String for reference time and forecast time