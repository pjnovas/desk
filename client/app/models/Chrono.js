/**
 * MODEL: Chrono
 *
 */

module.exports = Backbone.Model.extend({

  idAttribute: "_id",

  urlRoot: function(){
    return desk.apiURL + '/chronos'; 
  }

});

