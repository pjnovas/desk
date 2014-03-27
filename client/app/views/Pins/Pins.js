/**
 * VIEW: Pins
 * 
 */

var PinLayout = require('./PinLayout');

module.exports = Backbone.Marionette.CollectionView.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  className: "pins",
  tagName: "ul",
  itemView: PinLayout,

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