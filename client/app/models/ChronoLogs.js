/**
 * Collection: ChronoLogs
 *
 */

var 
  ChronoLog = require('./ChronoLog');

module.exports = Backbone.Collection.extend({

  model: ChronoLog,

  idAttribute: "_id",
  
  url: function(){
    return desk.apiURL + '/chronologs'; 
  },

});
