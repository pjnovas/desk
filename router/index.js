
module.exports = function(app) {
  //require('./api')(app);
  require('./apiv2')(app);
  require('./site')(app);
};

