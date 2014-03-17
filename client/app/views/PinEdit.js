/**
 * VIEW: Edit Pin
 * 
 */
 
var template = require('./templates/pinEdit.hbs.js');

module.exports = Backbone.Marionette.ItemView.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  className: "pin",
  template: template,

  ui: {
    "text": "#txt-text",
    "tags": "#txt-tags",
    "link": "#txt-link"
  },

  events:{
    "click .save-pin": "savePin"
  },

  //--------------------------------------
  //+ INHERITED / OVERRIDES
  //--------------------------------------

  //--------------------------------------
  //+ PUBLIC METHODS / GETTERS / SETTERS
  //--------------------------------------

  onRender: function(){
    this.ui.tags.tagsinput();
  },

  //--------------------------------------
  //+ EVENT HANDLERS
  //--------------------------------------

  savePin: function(){
    var toSave = {
      text: this.ui.text.val(),
      tags: this.ui.tags.val().split(','),
      link: this.ui.link.val()
    };

    this.model
      .save(toSave, { patch: true, silent: true })
      .success(this.pinSaved.bind(this));
  },

  pinSaved: function(){
    this.trigger("saved");
  }

  //--------------------------------------
  //+ PRIVATE AND PROTECTED METHODS
  //--------------------------------------

});