/**
 * Collection: Pins
 *
 */

var 
  Pin = require('./Pin');

module.exports = Backbone.Collection.extend({

  model: Pin,

  idAttribute: "_id",
  
  url: function(){
    return desk.apiURL + '/pins'; 
  },

});
