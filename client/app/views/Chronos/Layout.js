
var 
    template = require("./templates/layout.hbs.js")
  , Chrono = require("../../models/Chrono")
  , Chronos = require("../../models/Chronos")
  , ChronoView = require("./ChronoEdit")
  , ChronosView = require("./Chronos");

module.exports = Backbone.Marionette.Layout.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  template: template,

  regions:{
    "createChrono": ".new-chrono",
    "chronosCtn": "#chronos"
  },

  //--------------------------------------
  //+ INHERITED / OVERRIDES
  //--------------------------------------

  initialize: function(){
    this.chronos = new Chronos();
    this.chronos.fetch();
  },

  onRender: function(){

    var chronoView = new ChronoView({
      model: new Chrono()
    });

    var self = this;
    chronoView.on("saved", function(){
      self.chronos.add(chronoView.model);
      chronoView.model = new Chrono();
      chronoView.render();
    });

    this.createChrono.show(chronoView);

    this.chronosCtn.show(new ChronosView({
      collection: this.chronos
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