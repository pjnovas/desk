/**
 * VIEW: Edit Chrono
 * 
 */
 
var template = require('./templates/chronoEdit.hbs.js');

module.exports = Backbone.Marionette.ItemView.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  className: "chrono",
  template: template,

  ui: {
    "title": "#txt-title"
  },

  events:{
    "click .save-chrono": "saveChrono",
    "click .cancel-chrono": "cancelChrono"
  },

  templateHelpers: {
    isNew: function(){
      return this._id ? false : true;
    }
  },

  //--------------------------------------
  //+ INHERITED / OVERRIDES
  //--------------------------------------

  //--------------------------------------
  //+ PUBLIC METHODS / GETTERS / SETTERS
  //--------------------------------------

  onRender: function(){
    
  },

  //--------------------------------------
  //+ EVENT HANDLERS
  //--------------------------------------

  saveChrono: function(){
    var toSave = {
      title: this.ui.title.val()
    };

    this.model
      .save(toSave, { patch: true, silent: true })
      .success(this.chronoSaved.bind(this));
  },

  chronoSaved: function(){
    this.trigger("saved");
  },

  cancelChrono: function(){
    this.trigger("cancel");
  }

  //--------------------------------------
  //+ PRIVATE AND PROTECTED METHODS
  //--------------------------------------

});