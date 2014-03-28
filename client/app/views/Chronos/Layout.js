
var 
    template = require("./templates/layout.hbs.js")
  , Chrono = require("../../models/Chrono")
  , Chronos = require("../../models/Chronos")
  , ChronoLogs = require("../../models/ChronoLogs")
  , ChronoView = require("./ChronoEdit")
  , ChronosView = require("./Chronos")
  , Calendar = require("./Calendar");

module.exports = Backbone.Marionette.Layout.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  template: template,

  regions:{
    "createChrono": ".new-chrono",
    "chronosCtn": "#chronos",
    "chronoLogsCtn": "#chrono-logs"
  },

  //--------------------------------------
  //+ INHERITED / OVERRIDES
  //--------------------------------------

  initialize: function(){
    desk.app.chronos = new Chronos();
    desk.app.chronos.fetch();

    desk.app.chronoLogs = new ChronoLogs();
    desk.app.chronoLogs.fetch();
  },

  onRender: function(){

    var chronoView = new ChronoView({
      model: new Chrono()
    });

    chronoView.on("saved", function(){
      desk.app.chronos.add(chronoView.model);
      chronoView.model = new Chrono();
      chronoView.render();
    });

    this.createChrono.show(chronoView);

    this.chronosCtn.show(new ChronosView({
      collection: desk.app.chronos
    }));

    this.chronoLogsCtn.show(new Calendar({
      collection: desk.app.chronoLogs
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