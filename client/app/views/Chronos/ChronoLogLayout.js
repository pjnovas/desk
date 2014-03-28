
var 
    template = require("./templates/chronoLogLayout.hbs.js")
  , ChronoLogEditView = require("./ChronoLogEdit")
  , ChronoLogView = require("./ChronoLog");

module.exports = Backbone.Marionette.Layout.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  tagName: "li",
  template: template,

  regions:{
    "container": ".chrono-log-content"
  },

  //--------------------------------------
  //+ INHERITED / OVERRIDES
  //--------------------------------------

  onRender: function(){
    var self = this;

    function showChronoLogView(){
      var chronoLog = new ChronoLogView({
        model: self.model
      });
      
      chronoLog.on('edit', showChronoLogEditView);
      self.container.show(chronoLog);
    }

    function showChronoLogEditView(){
      var chronoLogEdit = new ChronoLogEditView({
        model: self.model
      });

      chronoLogEdit.on('saved', showChronoLogView);
      chronoLogEdit.on('cancel', showChronoLogView);

      self.container.show(chronoLogEdit);
    }

    showChronoLogView();
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