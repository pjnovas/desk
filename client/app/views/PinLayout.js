
var 
    template = require("./templates/pinLayout.hbs.js")
  , PinEditView = require("./PinEdit")
  , PinView = require("./Pin");

module.exports = Backbone.Marionette.Layout.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  tagName: "li",
  template: template,

  regions:{
    "container": ".pin-content"
  },

  //--------------------------------------
  //+ INHERITED / OVERRIDES
  //--------------------------------------

  onRender: function(){
    var self = this;

    function showPinView(){
      var pin = new PinView({
        model: self.model
      });
      
      pin.on('edit', showPinEditView);
      self.container.show(pin);
    }

    function showPinEditView(){
      var pinEdit = new PinEditView({
        model: self.model
      });

      pinEdit.on('saved', showPinView);
      pinEdit.on('cancel', showPinView);

      self.container.show(pinEdit);
    }

    showPinView();
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