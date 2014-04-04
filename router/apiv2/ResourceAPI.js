
var mongoose = require('mongoose')
  , _ = require('underscore');

var ResourceAPI = module.exports = function(app, options) {
  
  this.options = {};
  _.extend(this.options, options);

  this.Model = mongoose.model(this.options.model);

  this.baseURI = this.options.root + "/" + this.options.name;
  this.baseURI_ID = this.baseURI + "/:id";

  this.attachRoutes(app);
};

ResourceAPI.prototype.attachRoutes = function(app) {

  var isAuth = this.isAuth.bind(this);
  var sendOne = this.sendOne.bind(this)

  this.stackGetOne = [
      isAuth
    , this.getOne.bind(this)
    , this.isOnwer.bind(this)
  ];

  app.get(
      this.baseURI
    , this.setQuery.bind(this)
    , this.setList.bind(this) 
    , this.sendList.bind(this)
  );

  app.post(
      this.baseURI
    , isAuth
    , this.createOne.bind(this)
    , sendOne
  );
  
  app.get(
      this.baseURI_ID
    , this.stackGetOne
    , sendOne
  );

  app.del(
      this.baseURI_ID
    , this.stackGetOne
    , this.removeOne.bind(this)
  );

  app.put(
      this.baseURI_ID
    , this.stackGetOne
    , this.updateOne.bind(this)
    , sendOne);

};

ResourceAPI.prototype.isAuth = function(req, res, next){
  if (!req.isAuthenticated()){
    return res.send(401, "User not authenticated");
  }

  next();
};

ResourceAPI.prototype.getOne = function(req, res, next){

  this.Model.findById(req.params.id)
    .exec(function(err, one) {
      if (err) return res.send(500, err);
      if (!one) return res.send(404);

      req.one = one;
      next();
  });
};

ResourceAPI.prototype.isOnwer = function(req, res, next){

  var isOwner = req.user.id == req.one.owner;

  if (!isOwner) {
    return res.send(403, "Only the Owner can view & touch this resource.");
  }

  next();
};

ResourceAPI.prototype.createOne = function(req, res, next){

  var one = new this.Model(req.body);

  one.created_at = Date.now();
  one.owner = req.user._id;

  one.save(function(err, one){
    if(err) return res.send(500, err); 
    req.one = one;

    next();
  });

};

ResourceAPI.prototype.updateOne = function(req, res, next) {
  var one = req.one;

  function getValue(prop){
    return req.body.hasOwnProperty(prop) ? req.body[prop] : one[prop];    
  }

  for(var p in req.body){
    if (this.options.readOnly.indexOf(p) === -1){
      one[p] = getValue(p);
    }
  }

  one.save(function(err, one){
    if(err) return res.send(500, err);
    req.one = one;

    next();
  });
};

ResourceAPI.prototype.removeOne = function(req, res){
  req.one.remove(function (err){
    if (err) return res.send(500, err);
    res.send(204);
  });
};

ResourceAPI.prototype.setQuery = function(req, res, next){
  var query = req.query.q || "";

  req.query = {
    owner: req.user.id
  };

  if (query.length === 0){
    return next();
  }

  if (this.options.query.length > 0){
    var qp = [];
    var regex = new RegExp(query, 'i');
    
    for(var i=0; i<this.options.query.length; i++){
      var q = {};
      q[this.options.query[i]] = regex;
      qp.push(q);
    }

    req.query.$or = qp;
  }

  next();
};

ResourceAPI.prototype.setList = function(req, res, next){
  
  var find = this.Model.find(req.query || {});
  
  if (this.options.limit && this.options.limit > 0){
    find.limit(this.options.limit);
  }

  if (this.options.sort){
    find.sort(this.options.sort);
  }
  
  find.exec(function(err, list) {
      if(err) return res.send(500, err);
      req.list = list || [];
      next();
    });
};

ResourceAPI.prototype.sendList = function(req, res){
  res.send(req.list);
};

ResourceAPI.prototype.sendOne = function(req, res){
  res.send(req.one);
};