
/*
 * RESTfull API
 * 
 * 
 */


var mongoose = require('mongoose');

module.exports = function(app) {

  app.get('/', index);

};

var index = module.exports.index = function(req, res){
  res.render('index');
};
