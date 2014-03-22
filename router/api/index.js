
module.exports = function(app) {
  
  var root = '/api';

  require('./pines')(app, root, common);
  require('./chronos')(app, root, common);

};

var common = {
  
  isAuth: function(req, res, next){
    if (!req.isAuthenticated()){
      return res.send(401, "User not authenticated");
    }

    next();
  }

};
