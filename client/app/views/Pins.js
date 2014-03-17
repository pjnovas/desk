/**
 * VIEW: Pins
 * 
 */

var Pin = require('./Pin');

module.exports = Backbone.Marionette.CollectionView.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  className: "pins",
  tagName: "ul",
  itemView: Pin,

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