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
    timer: ".chrono-time",
    toggle: ".toggle-chrono",
    view: ".chrono-view",

    play: ".start",
    stop: ".stop",
    reset: ".reset",
    logit: ".logit",

    edit: ".edit",
    remove: ".remove",
  },

  events: {
    "click .toggle-chrono": "toggleVisible",

    "click .start": "chronoStart",
    "click .stop": "chronoStop",
    "click .reset": "chronoReset",
    "click .logit": "chronoLogit",

    "click .edit": "chronoEdit",
    "click .remove": "chronoRemove",
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

  toggleVisible: function(){
    if (this.ui.view.hasClass("hide")){
      this.ui.toggle.children("i")
        .removeClass("fa-chevron-down")
        .addClass("fa-chevron-up");

      this.ui.view.removeClass("hide");
      this.ui.timer.TimeCircles().rebuild().start().stop();
    }
    else {
      this.ui.toggle.children("i")
        .removeClass("fa-chevron-up")
        .addClass("fa-chevron-down");

      this.ui.view.addClass("hide");
    }
  },

  chronoStart: function(){
    this.ui.timer.TimeCircles().start();

    this.toggleButtons(["play", "logit", "reset", "edit", "remove"], false);
    this.toggleButtons(["stop"], true);
  },

  chronoStop: function(){
    this.ui.timer.TimeCircles().stop();

    this.toggleButtons(["play", "logit", "reset"], true);
    this.toggleButtons(["stop"], false);
  },

  chronoReset: function(){
    this.ui.timer.TimeCircles().restart().stop();

    this.toggleButtons(["play", "edit", "remove"], true);
    this.toggleButtons(["reset", "logit", "stop"], false);
  },

  chronoLogit: function(){
    //TODO: Send a log

    this.chronoReset();
  },

  chronoEdit: function(e){
    this.trigger('edit');
    e.stopPropagation();
  },

  chronoRemove: function(e){
    if (window.confirm("Is going to be deleted, sure?")){
      this.model.destroy();
    }

    e.stopPropagation();
  },

  //--------------------------------------
  //+ PRIVATE AND PROTECTED METHODS
  //--------------------------------------

  toggleButtons: function(btns, show){
    for (var i=0; i < btns.length; i++){
      if (show){
        this.ui[btns[i]].removeClass("hide");
      }
      else {
        this.ui[btns[i]].addClass("hide");
      }
    }
  },

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