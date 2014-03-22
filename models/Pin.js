
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

module.exports = function() {

  var Pin = new Schema({
      "text": { type: String }
    , "owner": { type: ObjectId, required: true, ref: 'User' }
    , "link": String
    , "tags": [String]
    , "created_at": { type: Date, default: Date.now }
  });

  mongoose.model('Pin', Pin);

};
