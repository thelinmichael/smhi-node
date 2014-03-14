var Response = function(error, body) {
  this.error = error;
  this.body = body;
};

module.exports = Response;