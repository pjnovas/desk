

var expect = require('expect.js')
  , config = require('../../app.config.test')
  , config = require('../../app.config.test')
  , baseURL = "http://" + config.host + ":" + config.port + "/api"
  , request = require('request')
  , mongoose = require('mongoose');

var userAuthA = { auth: { user: 'testa', pass: "x" } };
var userAuthB = { auth: { user: 'testb', pass: "x" } };

describe('/api', function(){

  before(function(done){  
    mongoose.connect(config.db.url || ('mongodb://' + config.db.host + '/'+ config.db.name));

    require('../../models')();

    createUsers(done);
  });

  after(function(done){
    mongoose.connection.db.executeDbCommand( {dropDatabase:1}, done);
  });

  require('./pines')(baseURL, userAuthA, userAuthB);
  require('./chronos')(baseURL, userAuthA, userAuthB);

});

function createUsers(done){
  var User = mongoose.model('User');

  var usera = new User({ provider: 'basic', provider_id: 1, username: 'testa' });
  var userb = new User({ provider: 'basic', provider_id: 1, username: 'testb' });

  usera.save(function(err, result){ 
    userAuthA._id = result._id;
    userb.save(function(err, result) {
      userAuthB._id = result._id;

      done();
    });
  });
}