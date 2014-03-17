/**
 * MODEL: Pin
 *
 */

module.exports = Backbone.Model.extend({

  idAttribute: "_id",

  urlRoot: function(){
    return desk.apiURL + '/pins'; 
  }

});

