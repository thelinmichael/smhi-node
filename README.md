**smhi-node** a JavaScript wrapper for the [Swedish Meteorological and Hydrological Institute](http://www.smhi.se/en)'s (SMHI) [weather forecast API](http://www.smhi.se/klimatdata/Oppna-data/Meteorologiska-data/api-for-vaderprognosdata-1.34233) (text in Swedish), and is packaged as a node module.

### SMHI's API service
Given latitude and longitude, SMHI's API returns weather forecast information from the current time to ten days into the future. Forecasts include properties such as direction and velocity of winds, type and intensity of percipitation, and temperature. Full list [here](http://www.smhi.se/polopoly_fs/1.34248!Parameterlista%20API%20ver%20131118.xlsx) (Excel file).

Example response for Stockholm:

[http://opendata-download-metfcst.smhi.se/api/category/pmp1g/version/1/geopoint/lat/58.59/lon/16.18/data.json](http://opendata-download-metfcst.smhi.se/api/category/pmp1g/version/1/geopoint/lat/58.59/lon/16.18/data.json)
```json
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
    ... (and so on, ten days forward with decreasing granularity)
}
```


### Examples
Some examples using the wrapper, making the same query and getting the same response as above. It uses the same [promises that's in EcmaScript 6](http://www.html5rocks.com/en/tutorials/es6/promises/).

#### Will it rain during the next hour?

```javascript
var SMHI = require("smhi-node"),
  latitude = 58.59, // Stockholm
  longitude = 16.18;

SMHI.getForecastForLatAndLong(latitude, longitude).then(
  function(response) {
    var forecasts = response.getForecasts();
    var nextHour = forecasts[0];

    if (nextHour.isRaining()) {
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

#### What will be the highest and lowest temperature for the next ten days?
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
    console.log("Highest temperature: " + records.highest.getTemperature() + "°C on " + records.highest.getTime());
    // Lowest temperature: 5.3°C on 2014-03-14T21:00:00Z
    console.log("Lowest temperature: " + records.lowest.getTemperature() + "°C on " + records.lowest.getTime()); // 5.3°C
  },
  function(error) {
     console.log("I didn't manage to find out, sorry.", error);
  });
});
```

### Reference
#### SMHI
```javascript
/**
 * Get weather forecasts for a specified coordinate.
 * @param {Number} lat The latitude of the location you want forecasts for
 * @param {Number} lon The longitude of the location you want forecasts for
 * @returns {Promise} Returns a promise that resolves to a {SMHI Response} object
 */
SMHI.getForecastForLatAndLong(lat, lon)
```

#### SMHI Response
There's no need to create a new SMHI Response with its constructor.
```javascript
/**
 * Get the forecasts that is contained within the SMHI Response.
 * @returns {Forecast[]} The forecasts
 */
getForecasts()
```

#### Forecast
There's no need to create a new Forecast with its constructor.

```javascript
  getLatitude()       // Latitude of the closest measuring node
  getLongitude()      // Longitude of the nearest measuring node
  getReferenceTime()  // Time when the forecast request was made
  getTime()           // Time of the forecast
  getValidTime()      // Same as above^
  getMeanSeaLevel()   // Pressure at sealevel in hPa
  getTemperature()    // Temperature in Celsius
  getVisibility()     // Visibility in kilometers, one decimal
  getWindDirection()  // Direction in degrees (integers)
  getWindVelocity()            // Velocity in m/s (one decimal)
  getRelativeHumidity()        // Humidity in % (integers)
  getThunderstormProbability() // Probability in % (integers)
  getTotalCloudCover()         // Total cloud cover in parts of eights (0-8)
  getLowCloudCover()     // Low cloud cover in parts of eights (0-8)
  getMediumCloudCover()  // Medium cloud cover in parts of eights (0-8)
  getHighCloudCover()    // High cloud cover in parts of eights (0.8)
  getGust()              // Wind gust in m/s (one decimal)
  getTotalPrecipitationIntensity() // Rain, millimeter per hour (one decimal)
  getSnowPrecipitationIntensity()  // Snow, millimeter per hour (melted snow, one decimal)
  getPrecipitationCategory() // SMHI precipitation category
  noPercipitation()          // True if no snow or rain (category 0)
  isSnowing()                // True if snowing (category 1), or snow mixed with rain (category 2)
  isSnowingAndRaining()      // True if snowing and raining (category 2)
  isRaining()  // True if snowing and raining (category 2), raining (categories 3 and 5), or drizzling (categories 4, 6)
  isDrizzling()              // True if drizzling (category 4, 6)
  isFreezingRain()           // True if freezing rain (category 5)
  isFreezingDrizzle()        // True if freezing drizzle (category 6)
```