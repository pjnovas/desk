
var 
    template = require("./templates/chronoLayout.hbs.js")
  , ChronoEditView = require("./ChronoEdit")
  , ChronoView = require("./Chrono");

module.exports = Backbone.Marionette.Layout.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  tagName: "li",
  template: template,

  regions:{
    "container": ".chrono-content"
  },

  //--------------------------------------
  //+ INHERITED / OVERRIDES
  //--------------------------------------

  onRender: function(){
    var self = this;

    function showChronoView(){
      var chrono = new ChronoView({
        model: self.model
      });
      
      chrono.on('edit', showChronoEditView);
      self.container.show(chrono);
    }

    function showChronoEditView(){
      var chronoEdit = new ChronoEditView({
        model: self.model
      });

      chronoEdit.on('saved', showChronoView);
      chronoEdit.on('cancel', showChronoView);

      self.container.show(chronoEdit);
    }

    showChronoView();
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