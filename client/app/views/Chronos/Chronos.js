/**
 * VIEW: Chronos
 * 
 */

var ChronoLayout = require('./ChronoLayout');

module.exports = Backbone.Marionette.CollectionView.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  className: "chronos",
  tagName: "ul",
  itemView: ChronoLayout,

  //--------------------------------------
  //+ INHERITED / OVERRIDES
  //--------------------------------------
  
  //--------------------------------------
  //+ PUBLIC METHODS / GETTERS / SETTERS
  //--------------------------------------

  //--------------------------------------
  //+ EVENT HANDLERS
  //--------------------------------------

  //--------------------------------------
  //+ PRIVATE AND PROTECTED METHODS
  //--------------------------------------

});