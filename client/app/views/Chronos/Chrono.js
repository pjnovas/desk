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
    "click .chrono-title": "toggleVisible",

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

    if (!this.model.get("start")){
      this.model.save({
        start: moment().unix(),
        end: null
      }, {
        patch: true
      });
    }
    else {
      this.model.save({
        end: null,
      }, {
        patch: true
      });
    }

    this.showButtonsStarted();
  },

  chronoStop: function(){
    this.ui.timer.TimeCircles().stop();
    
    this.model.save({
      end: moment().unix(),
    }, {
      patch: true
    });

    this.showButtonsStopped();
  },

  chronoReset: function(){
    this.ui.timer.attr('data-timer', 0);
    this.ui.timer.TimeCircles().restart().stop();
    
    this.model.save({
      start: null,
      end: null,
    }, {
      patch: true
    });

    this.toggleButtons(["play", "edit", "remove"], true);
    this.toggleButtons(["reset", "logit", "stop"], false);
  },

  chronoLogit: function(){

    var start = moment.unix(this.model.get("start")).seconds(0);
    var end = moment.unix(this.model.get("end")).seconds(0);

    function roundMinutes(dtMoment){
      if (dtMoment.minutes() < 15){
        dtMoment.minutes(0);
      }
      else if (dtMoment.minutes() < 45){
        dtMoment.minutes(30);
      }
      else { // > 45
        dtMoment.add("hours", 1).minutes(0);
      }
    }

    roundMinutes(start);
    roundMinutes(end);

    if(start.diff(end, "minutes") < 30){
      end = start.clone().add("minutes", 30);
    }

    desk.app.chronoLogs.create({
      start: start.unix(),
      end: end.unix(),
      chrono: this.model.get("_id")
    });

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

  showButtonsStarted: function(){
    this.toggleButtons(["play", "logit", "reset", "edit", "remove"], false);
    this.toggleButtons(["stop"], true);
  },

  showButtonsStopped: function(){
    this.toggleButtons(["play", "logit", "reset"], true);
    this.toggleButtons(["stop"], false);
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
    var running = false;

    var start = this.model.get("start") ? moment.unix(this.model.get("start")) : null;
    var end = this.model.get("end") ? moment.unix(this.model.get("end")) : null;

    if (start && start.isValid()){
      var secs = 0;

      if (end && end.isValid()){
        secs = start.diff(end, "seconds");
        this.showButtonsStopped();
      }
      else {
        secs = start.diff(moment(), "seconds");
        running = true;
        this.ui.view.removeClass("hide");
        this.showButtonsStarted();
      }

      this.ui.timer.attr('data-timer', secs);
    }

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

    if (running){
      this.ui.timer.TimeCircles().start();
    }

  }

});