
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

  Pin.pre('save', function (next) {
    
    if (this.link && this.link.indexOf('http') != 0){
      this.link = 'http://' + this.link;
    }

    next();
  });

};
