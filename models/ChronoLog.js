
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

module.exports = function() {

  var ChronoLog = new Schema({
      "start": { type: Date, required: true }
    , "end": { type: Date }
    , "chrono": { type: ObjectId, required: true, ref: 'Chrono' }
    , "owner": { type: ObjectId, required: true, ref: 'User' }
  });

  mongoose.model('ChronoLog', ChronoLog);

};
