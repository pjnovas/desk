
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

module.exports = function() {
  
  var Chrono = new Schema({
      "title": { type: String, required: true }
    , "start": { type: Date }
    , "end": { type: Date }
    , "owner": { type: ObjectId, required: true, ref: 'User' }
    , "created_at": { type: Date, default: Date.now }
  });

  mongoose.model('Chrono', Chrono);

};
