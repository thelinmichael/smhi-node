var Response = function(error, body) {
  if (error) {
    this.error = error;
  } else {
    try {
      this.body = body;
      this.forecasts = createForecasts(body);
    } catch (exception) {
      this.error = "Unexpected error when parsing response from SMHI";
    }
  }
};

Response.prototype.getLatitude = function() {
  return this.body.lat;
};

Response.prototype.getLongitude = function() {
  return this.body.lon;
};

Response.prototype.getReferencetime = function() {
  return new Date(this.body.referenceTime);
};

Response.prototype.getJSON = function() {
  return this.body;
};

Response.prototype.getForecasts = function() {
  return this.forecasts;
};

var createForecasts = function(body) {
  var baseData = {
    lat : body.lat,
    lon : body.lon,
    referenceTime : body.referenceTime
  };
  return body.timeseries.map(function(timeSeriesElement) {
    return new Forecast(baseData, timeSeriesElement);
  });
};

var Forecast = function(baseData, timeSeriesElement) {
  for (var baseDataKey in baseData) {
    if (baseData.hasOwnProperty(baseDataKey)) {
      this[baseDataKey] = baseData[baseDataKey];
    }
  }
  for (var elementKey in timeSeriesElement) {
    if (timeSeriesElement.hasOwnProperty(elementKey)) {
      this[elementKey] = timeSeriesElement[elementKey];
    }
  }
};

Forecast.prototype.getLatitude = function() {
  return this.lat;
};

Forecast.prototype.getLongitude = function() {
  return this.lon;
};

Forecast.prototype.getReferencetime = function() {
  return new Date(this.referenceTime);
};

Forecast.prototype.getValidTime = function() {
  return new Date(this.validTime);
};

Forecast.prototype.getMeanSeaLevel = function() {
  return this.msl;
};

Forecast.prototype.getTemperature = function() {
  return this.t;
};

Forecast.prototype.getVisibility = function() {
  return this.vis;
};

Forecast.prototype.getWindDirection = function() {
  return this.wd;
};

Forecast.prototype.getWindVelocity = function() {
  return this.ws;
};

Forecast.prototype.getRelativeHumidity = function() {
  return this.r;
};

Forecast.prototype.getThunderstormProbability = function() {
  return this.tstm;
};

Forecast.prototype.getTotalCloudCover = function() {
  return this.tcc;
};

Forecast.prototype.getLowCloudCover = function() {
  return this.lcc;
};

Forecast.prototype.getMediumCloudCover = function() {
  return this.mcc;
};

Forecast.prototype.getHighCloudCover = function() {
  return this.hcc;
};

Forecast.prototype.getGust = function() {
  return this.gust;
};

Forecast.prototype.getTotalPrecipitationIntensity = function() {
  return this.pit;
};

Forecast.prototype.getSnowPrecipitationIntensity = function() {
  return this.pis;
};

Forecast.prototype.getPrecipitationCategory = function() {
  return this.pcat;
};

module.exports = Response;