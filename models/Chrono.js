
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

module.exports = function() {
  
  var Chrono = new Schema({
      "title": { type: String, required: true }
    , "owner": { type: ObjectId, required: true, ref: 'User' }
    , "hasLogs": { type: Boolean, default: true }
    , "created_at": { type: Date, default: Date.now }
  });

  mongoose.model('Chrono', Chrono);

  var ChronoLog = new Schema({
      "start": { type: Date, required: true }
    , "end": { type: Date }
    , "chrono": { type: ObjectId, required: true, ref: 'Chrono' }
    , "owner": { type: ObjectId, required: true, ref: 'User' }
    , "created_at": { type: Date, default: Date.now }
  });

  mongoose.model('ChronoLog', ChronoLog);

};
