
var 
    template = require("./templates/layout.hbs.js")
  , Pin = require("../../models/Pin")
  , Pins = require("../../models/Pins")
  , SearchPinsView = require("./SearchPins")
  , PinView = require("./PinEdit")
  , PinsView = require("./Pins");

module.exports = Backbone.Marionette.Layout.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  template: template,

  regions:{
    "searchPins": ".search-pins",
    "createPin": ".new-pin",
    "pinsCtn": "#pins"
  },

  //--------------------------------------
  //+ INHERITED / OVERRIDES
  //--------------------------------------

  initialize: function(){
    this.pins = new Pins();
    this.pins.fetch();
  },

  onRender: function(){

    this.searchPins.show(new SearchPinsView({
      collection: this.pins
    }));

    var pinView = new PinView({
      model: new Pin()
    });

    var self = this;
    pinView.on("saved", function(){
      self.pins.add(pinView.model);
      pinView.model = new Pin();
      pinView.render();
    });

    this.createPin.show(pinView);

    this.pinsCtn.show(new PinsView({
      collection: this.pins
    }));
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