/*
 * RESTfull API: Pins Resources
 * 
 * 
 */


var mongoose = require('mongoose');

var Pin = mongoose.model('Pin');

module.exports = function(app, uri, common) {

  app.get(uri + '/pins', setQuery, setPins, sendPins);
  app.post(uri + '/pins', common.isAuth, createPin, sendPin);
  
  app.get(uri + '/pins/:pid', getPin, sendPin);

  app.del(uri + '/pins/:pid', common.isAuth, getPin, isPinOnwer, removePin);
  app.put(uri + '/pins/:pid', common.isAuth, getPin, isPinOnwer, updatePin, sendPin);
};

var getPin = function(req, res, next){
  Pin.findById(req.params.pid)
    .exec(function(err, pin) {
      if (err) return res.send(500);
      if (!pin) return res.send(404);

      req.pin = pin;
      next();
  });
};

var isPinOnwer = function(req, res, next){

  var isOwner = req.user.id === req.pin.leader.id;

  if (!isLeader) {
    return res.send(403, "Only the Owner can touch this pin.");
  }

  next();
};

var createPin = function(req, res, next){

  if(req.body.link && req.body.link.indexOf('http') != 0) {
    req.body.link = 'http://' + req.body.link;
  }

  var tags = req.body.tags || [];
  if (!Array.isArray(tags)){
    tags = tags.toString().split(',');
  }

  var pin = new Pin({
      text: req.body.text
    , link: req.body.link
    , tags: tags
    , created_at_at: Date.now()
    , owner: req.user._id
  });

  pin.save(function(err, pin){
    if(err) return res.send(500); 
    req.pin = pin;

    next();
  });

};

var updatePin = function(req, res, next) {
  var pin = req.pin;

  function getValue(prop){
    return req.body.hasOwnProperty(prop) ? req.body[prop] : pin[prop];    
  }

  var link = getValue("link");
  if(link && link.indexOf('http') != 0) {
    link = 'http://' + link;
  }

  var tags = getValue("tags");
  if (!Array.isArray(tags)){
    tags = tags.toString().split(',');
  }

  pin.text = getValue("text");
  pin.link = link;
  pin.tags = tags;
  
  pin.save(function(err, pin){
    if(err) return res.send(500);
    req.pin = pin;

    next();
  });
};

var removePin = function(req, res){
  req.pin.remove(function (err){
    if (err) return res.send(500, "An error ocurred when removing this pin");
    res.send(204);
  });
};

var setQuery = function(req, res, next){
  var query = req.query.q || "";

  req.query = {};

  if (query.length === 0){
    return next();
  }

  var regex = new RegExp(query, 'i');
  req.query.$or = [ { text: regex }, { tags: regex } ];

  next();
};

var setPins = function(req, res, next){
  Pin.find(req.query || {})
    .limit(30)
    .sort( { "created_at" : -1 } )
    .exec(function(err, pins) {
      if(err) return res.send(500);
      req.pins = pins || [];
      next();
    });
}

var sendPin = function(req, res){
  res.send(req.pin);
};

var sendPins = function(req, res){
  res.send(req.pins);
};
