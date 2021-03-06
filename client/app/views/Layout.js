
var 
    template = require("./templates/layout.hbs.js")
  , PinsLayout = require("./Pins/Layout")
  , ChronosLayout = require("./Chronos/Layout");

module.exports = Backbone.Marionette.Layout.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  template: template,

  regions:{
    "pins": ".pins-ctn",
    "chronos": ".chronos-ctn"
  },

  //--------------------------------------
  //+ INHERITED / OVERRIDES
  //--------------------------------------

  initialize: function(){
    
  },

  onRender: function(){

    this.pins.show(new PinsLayout());
    this.chronos.show(new ChronosLayout());

  }

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