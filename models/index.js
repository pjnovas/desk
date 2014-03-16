
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

module.exports = function(app) {
  
  var User = new Schema({
      "provider": { type: String, required: true }
    , "provider_id": { type: Number, required: true }
    , "username": { type: String, required: true }
    , "name": { type: String }
    , "email": { type: String, validate: /.+@.+\..+/ }
    , "picture": String
    , "created_at": {type: Date, default: Date.now },
  });

  mongoose.model('User', User);

  var Pin = new Schema({
      "text": { type: String }
    , "owner": { type: ObjectId, required: true, ref: 'User' }
    , "link": String
    , "tags": [String]
    , "created_at": { type: Date, default: Date.now }
  });

  mongoose.model('Pin', Pin);

};
