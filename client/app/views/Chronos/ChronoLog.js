/**
 * VIEW: Chrono
 * 
 */
 
var template = require('./templates/chronoLog.hbs.js');

module.exports = Backbone.Marionette.ItemView.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  template: template,

  ui:{
    edit: ".edit",
    remove: ".remove",
  },

  events: {
    "click .edit": "chronoEdit",
    "click .remove": "chronoRemove",
  },

  //--------------------------------------
  //+ INHERITED / OVERRIDES
  //--------------------------------------

  onRender: function(){

  },

  //--------------------------------------
  //+ PUBLIC METHODS / GETTERS / SETTERS
  //--------------------------------------

  //--------------------------------------
  //+ EVENT HANDLERS
  //--------------------------------------

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

});