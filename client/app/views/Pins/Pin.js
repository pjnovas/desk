/**
 * VIEW: Pin
 * 
 */
 
var template = require('./templates/pin.hbs.js');

module.exports = Backbone.Marionette.ItemView.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  template: template,

  ui: {
    controls: ".controls",
    copyCtn: "#copy-ctn",
    text: "#txtText"
  },

  events: {
    "blur #copy-ctn": "exitCopyClipboard",

    "click .edit": "showEditMode",
    "click .remove": "removePin"
  },

  //--------------------------------------
  //+ INHERITED / OVERRIDES
  //--------------------------------------

  onRender: function(){
    this.$el.on("click", this.copyToClipboard.bind(this));
  },

  //--------------------------------------
  //+ PUBLIC METHODS / GETTERS / SETTERS
  //--------------------------------------

  //--------------------------------------
  //+ EVENT HANDLERS
  //--------------------------------------

  copyToClipboard: function(e){
    var h = this.$el.height() - this.ui.controls.height() - 7;
    this.ui.text.addClass("hide");
    this.ui.copyCtn.removeClass("hide").css('height', h).select();
    e.stopPropagation();
  },

  exitCopyClipboard: function(){
    this.ui.copyCtn.addClass("hide");
    this.ui.text.removeClass("hide");
  },

  showEditMode: function(e){
    this.trigger('edit');
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