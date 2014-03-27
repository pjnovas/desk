/**
 * Collection: Chronos
 *
 */

var 
  Chrono = require('./Chrono');

module.exports = Backbone.Collection.extend({

  model: Chrono,

  idAttribute: "_id",
  
  url: function(){
    return desk.apiURL + '/chronos'; 
  },

});
