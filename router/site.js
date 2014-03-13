
/*
 * WebSite Routes
 * 
 * 
 */

module.exports = function(app) {

  var appPort = app.get('config').port;
  var appHost = app.get('config').host + (appPort && appPort !== 80 ? ':' + appPort : '');

  var stack = [
    loadUser, 
    setViewVar('host', appHost),
    setViewVar('providers', app.get('providers')),
    render('index')
  ];

  app.get('/', stack);
  app.get('/logout', logout, redirect('/'));

};

var render = function(path) {
  return function(req, res) {
    res.render(path);
  };
};

var redirect = function(route) {
  return function(req, res) {
    res.redirect(route);
  };
};

var loadUser = function(req, res, next) {
  res.locals.user = JSON.stringify(req.user);
  next();
};

var setViewVar = function(key, value) {
  return function(req, res, next) {
    res.locals[key] = value;
    next();
  };
};  

var logout = function(req, res, next) {
  req.logout();
  next();
};