/*
 * RESTfull API: Chronos Resources
 * 
 * 
 */


var mongoose = require('mongoose');
var Chrono = mongoose.model('Chrono');
var ChronoLog = mongoose.model('ChronoLog');

module.exports = function(app, uri, common) {

  var stackChrono = [common.isAuth, getChrono, isChronoOnwer];

  app.get(uri + '/chronos', setQuery, setChronos, sendChronos);
  app.post(uri + '/chronos', common.isAuth, createChrono, sendChrono);
  
  app.get(uri + '/chronos/:cid', stackChrono, sendChrono);
  app.del(uri + '/chronos/:cid', stackChrono, removeChrono);
  app.put(uri + '/chronos/:cid', stackChrono, updateChrono, sendChrono);

  // Chrono Logs

  app.get(uri + '/chronos/:cid/logs', stackChrono, setLogsQuery, setLogs, sendLogs);
  app.post(uri + '/chronos/:cid/logs', stackChrono, createLog, sendLog);

/*
  app.get(uri + '/chronos/:cid/logs/:lid', stackChrono,);
  app.put(uri + '/chronos/:cid/logs/:lid', stackChrono,);
  app.del(uri + '/chronos/:cid/logs/:lid', stackChrono,);
*/
};

var getChrono = function(req, res, next){
  Chrono.findById(req.params.cid)
    .exec(function(err, chrono) {
      if (err) return res.send(500);

      if (!chrono) {
        console.log("no existeeee");
        return res.send(404);
      }

      req.chrono = chrono;
      next();
  });
};

var isChronoOnwer = function(req, res, next){

  var isOwner = req.user.id == req.chrono.owner;

  if (!isOwner) {
    return res.send(403, "Only the Owner can view & touch this chrono.");
  }

  next();
};

var createChrono = function(req, res, next){

  var chrono = new Chrono({
      title: req.body.title
    , hasLogs: req.body.hasLogs
    , created_at_at: Date.now()
    , owner: req.user._id
  });

  chrono.save(function(err, chrono){
    if(err) return res.send(500); 
    req.chrono = chrono;

    next();
  });

};

var updateChrono = function(req, res, next) {
  var chrono = req.chrono;

  function getValue(prop){
    return req.body.hasOwnProperty(prop) ? req.body[prop] : chrono[prop];    
  }

  chrono.title = getValue("title");
  chrono.hasLogs = getValue("hasLogs");
  
  chrono.save(function(err, chrono){
    if(err) return res.send(500);
    req.chrono = chrono;

    next();
  });
};

var removeChrono = function(req, res){
  req.chrono.remove(function (err){
    if (err) return res.send(500, "An error ocurred when removing this chrono");
    res.send(204);
  });
};

var setQuery = function(req, res, next){
  var query = req.query.q || "";

  req.query = {
    owner: req.user.id
  };

  next();
};

var setChronos = function(req, res, next){
  Chrono.find(req.query || {})
    .sort( { "created_at" : -1 } )
    .exec(function(err, chronos) {
      if(err) return res.send(500);
      req.chronos = chronos || [];
      next();
    });
}

var sendChrono = function(req, res){
  res.send(req.chrono);
};

var sendChronos = function(req, res){
  res.send(req.chronos);
};

// LOGS

var setLogsQuery = function(req, res, next){
  var query = req.query.q || "";

  req.query = {
    owner: req.user.id,
    chrono: req.chrono.id
  };

  next();
};

var setLogs = function(req, res, next){
  ChronoLog.find(req.query || {})
    .sort( { "created_at" : -1 } )
    .exec(function(err, logs) {
      if(err) return res.send(500);
      req.logs = logs || [];
      next();
    });
};

var createLog = function(req, res, next){

  var log = new ChronoLog({
      start: new Date(req.body.start)
    , chrono: req.chrono.id
    , created_at_at: Date.now()
    , owner: req.user.id
  });

  log.save(function(err, log){
    if(err) return res.send(500); 
    req.log = log;

    next();
  });

};

var sendLog = function(req, res){
  res.send(req.log);
};

var sendLogs = function(req, res){
  res.send(req.logs);
};

