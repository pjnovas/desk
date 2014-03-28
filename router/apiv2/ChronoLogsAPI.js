
var mongoose = require('mongoose')
  , _ = require('underscore')
  , util = require('util')
  , ResourceAPI = require('./ResourceAPI')
  , moment = require('moment');

var ChronoLogsAPI = module.exports = function(app, options) {
  ResourceAPI.call(this, app, options);
};

util.inherits(ChronoLogsAPI, ResourceAPI);

ChronoLogsAPI.prototype.setQuery = function(req, res, next){
  var cid = req.query.cid || "";
  var start = moment(0, "HH");

  if (!cid){
    return res.send(400, "Must provide a ChronoId");
  }

  req.query = {
    owner: req.user.id,
    chrono: cid
  };

  req.query.start = { $gte: start };

  next();
};
