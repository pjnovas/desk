/**
 * VIEW: Pin
 * 
 */
 
var template = require('./templates/pin.hbs.js');

module.exports = Backbone.Marionette.ItemView.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  tagName: "li",
  template: template,

  ui: {
    controls: ".controls",
    copyCtn: "#copy-ctn",
    text: "#txtText"
  },

  events: {
    "click .controls": "hideControls",

    "click .copy": "copyToClipboard",
    "blur #copy-ctn": "exitCopyClipboard",

    "click .edit": "showEditMode",
    "click .remove": "removePin"
  },

  //--------------------------------------
  //+ INHERITED / OVERRIDES
  //--------------------------------------

  onRender: function(){
    this.$el.on("click", this.showControls.bind(this));
  },

  //--------------------------------------
  //+ PUBLIC METHODS / GETTERS / SETTERS
  //--------------------------------------

  //--------------------------------------
  //+ EVENT HANDLERS
  //--------------------------------------

  showControls: function(e){
    this.ui.controls.removeClass("hide");
    e.stopPropagation();
  },

  hideControls: function(e){
    this.ui.controls.addClass("hide");
    e.stopPropagation();
  },

  copyToClipboard: function(e){
    this.ui.copyCtn.removeClass("hide").select();
    this.ui.text.addClass("hide");
    this.hideControls(e);
    e.stopPropagation();
  },

  exitCopyClipboard: function(){
    this.ui.copyCtn.addClass("hide");
    this.ui.text.removeClass("hide");
  },

  showEditMode: function(e){
    
    e.stopPropagation();
  },

  removePin: function(e){
    if (window.confirm("Is going to be deleted, sure?")){
      this.model.destroy();
    }

    e.stopPropagation();
  }

  //--------------------------------------
  //+ PRIVATE AND PROTECTED METHODS
  //--------------------------------------

});