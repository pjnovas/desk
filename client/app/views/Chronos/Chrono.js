/**
 * VIEW: Chrono
 * 
 */
 
var template = require('./templates/chrono.hbs.js');

module.exports = Backbone.Marionette.ItemView.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  template: template,

  ui:{
    timer: ".chrono-time"
  },

  events: {
    "click .start": "chronoStart",
    "click .stop": "chronoStop",
    "click .reset": "chronoReset"
  },

  //--------------------------------------
  //+ INHERITED / OVERRIDES
  //--------------------------------------

  onRender: function(){
    var self = this;
    _.defer(function(){
      self.initTimeCircles();
    });
  },

  //--------------------------------------
  //+ PUBLIC METHODS / GETTERS / SETTERS
  //--------------------------------------

  //--------------------------------------
  //+ EVENT HANDLERS
  //--------------------------------------

  chronoStart: function(){
    this.ui.timer.TimeCircles().start();
  },

  chronoStop: function(){
    this.ui.timer.TimeCircles().stop();
  },

  chronoReset: function(){
    this.ui.timer.TimeCircles().restart();
  },

  //--------------------------------------
  //+ PRIVATE AND PROTECTED METHODS
  //--------------------------------------

  initTimeCircles: function(){

    this.ui.timer.TimeCircles({
      start: true,
      animation: "smooth",
      bg_width: 1.2,
      fg_width: 0.1,
      circle_bg_color: "#60686F",
      time: {
        Days: { show: false },
        Hours: {
          text: "Hours",
          color: "#99CCFF",
          show: true
        },
        Minutes: {
          text: "Minutes",
          color: "#BBFFBB",
          show: true
        },
        Seconds: {
          text: "Seconds",
          color: "#FF9999",
          show: true
        }
      }
    }).stop();
  }

});