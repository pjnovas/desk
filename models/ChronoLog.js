
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

module.exports = function() {

  var ChronoLog = new Schema({
      "start": { type: Number, required: true }
    , "end": { type: Number }
    , "chrono": { type: ObjectId, required: true, ref: 'Chrono' }
    , "owner": { type: ObjectId, required: true, ref: 'User' }
  });

  mongoose.model('ChronoLog', ChronoLog);

};
