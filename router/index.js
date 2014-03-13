
module.exports = function(app) {
  require('./api')(app);
  require('./site')(app);
};

