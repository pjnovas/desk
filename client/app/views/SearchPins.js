/**
 * VIEW: Search Pins
 * 
 */
 
var template = require('./templates/searchPins.hbs.js');

module.exports = Backbone.Marionette.ItemView.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  className: "search-pins-box",
  template: template,

  ui: {
    searchbox: "input[type=text]"
  },

  events: {
    "keyup input[type=text]": "search"
  },

  lastSearch: "",

  //--------------------------------------
  //+ INHERITED / OVERRIDES
  //--------------------------------------

  initialize: function(options){
    this.collection = options && options.collection;
  },

  //--------------------------------------
  //+ PUBLIC METHODS / GETTERS / SETTERS
  //--------------------------------------

  //--------------------------------------
  //+ EVENT HANDLERS
  //--------------------------------------

  search: function(){
    var self = this;
    window.clearTimeout(this.timer);

    this.timer = window.setTimeout(function(){
      var keyword = self.ui.searchbox.val();

      if (keyword !== self.lastSearch) {
        self.lastSearch = keyword;

        self.collection.fetch({
          data: $.param({ q: keyword }),
          reset: true
        });
      }
            
    }, 300);
  }

  //--------------------------------------
  //+ PRIVATE AND PROTECTED METHODS
  //--------------------------------------

});