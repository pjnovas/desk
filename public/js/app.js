/*! 
* desk - v0.0.1
* Copyright (c) 2014  
*  
*/ 

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

module.exports = function(){

  window.desk = window.desk || {};

   // Init Helpers
  require('./helpers/handlebars');
  require('./helpers/backboneOverrides');
  
  //Placeholders.init({ live: true, hideOnFocus: true });
  
  window.desk.apiURL = "/api";

  require('./app')();
};

},{"./app":2,"./helpers/backboneOverrides":3,"./helpers/handlebars":4}],2:[function(require,module,exports){
/**
 * Application
 *
 */

var ModalRegion = require('./views/ModalRegion')
  , Layout = require('./views/Layout')
  , Header = require('./views/Header')
  , Footer = require('./views/Footer');

module.exports = function(){

  var app = module.exports = new Backbone.Marionette.Application();

  function initRegions(){
    app.addRegions({
      header: "header",
      main: "#main",
      footer: "footer",
      modals: ModalRegion
    });
  }

  app.addInitializer(initRegions);

  app.addInitializer(function(){
    app.header.show(new Header());
    app.main.show(new Layout());
    app.footer.show(new Footer());
  });

  window.desk.app = app;
  window.desk.app.start();

};
},{"./views/Footer":6,"./views/Header":7,"./views/Layout":8,"./views/ModalRegion":9}],3:[function(require,module,exports){
/*
 * Backbone Global Overrides
 *
 */

// Override Backbone.sync to use the PUT HTTP method for PATCH requests
//  when doing Model#save({...}, { patch: true });

var originalSync = Backbone.sync;

Backbone.sync = function(method, model, options) {
  if (method === 'patch') {
    options.type = 'PUT';
  }

  return originalSync(method, model, options);
};

},{}],4:[function(require,module,exports){
/**
 * HELPER: Handlebars Template Helpers
 * 
 */


},{}],5:[function(require,module,exports){
jQuery(function() {
  require('./Initializer')();
});
},{"./Initializer":1}],6:[function(require,module,exports){

var 
    template = require("./templates/footer.hbs.js");

module.exports = Backbone.Marionette.Layout.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  template: template,

  //--------------------------------------
  //+ INHERITED / OVERRIDES
  //--------------------------------------

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
},{"./templates/footer.hbs.js":11}],7:[function(require,module,exports){

var 
    template = require("./templates/header.hbs.js");

module.exports = Backbone.Marionette.Layout.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  template: template,

  //--------------------------------------
  //+ INHERITED / OVERRIDES
  //--------------------------------------

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
},{"./templates/header.hbs.js":12}],8:[function(require,module,exports){

var 
    template = require("./templates/content.hbs.js");

module.exports = Backbone.Marionette.Layout.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  template: template,

  //--------------------------------------
  //+ INHERITED / OVERRIDES
  //--------------------------------------

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
},{"./templates/content.hbs.js":10}],9:[function(require,module,exports){
/**
 * REGION: ModalRegion
 * Used to manage Twitter Bootstrap Modals with Backbone Marionette Views
 */

module.exports = Backbone.Marionette.Region.extend({
  el: "#modals-container",

  constructor: function(){
    //_.bindAll(this);
    Backbone.Marionette.Region.prototype.constructor.apply(this, arguments);
    this.on("show", this.showModal, this);
  },

  getEl: function(selector){
    var $el = $(selector);
    $el.on("hidden", this.close);
    return $el;
  },

  showModal: function(view){
    view.on("close", this.hideModal, this);
    this.$el.modal('show');
  },

  hideModal: function(){
    this.$el.modal('hide');
  }
  
});

},{}],10:[function(require,module,exports){
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"starter-template\">\n  <h1>Bootstrap starter template</h1>\n  <p class=\"lead\">Use this document as a way to quickly start any new project.<br> All you get is this text and a mostly barebones HTML document.</p>\n</div>";
  })
;

},{}],11:[function(require,module,exports){
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "footer";
  })
;

},{}],12:[function(require,module,exports){
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"navbar navbar-inverse navbar-fixed-top\" role=\"navigation\">\n  <div class=\"container\">\n    <div class=\"navbar-header\">\n      <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-collapse\">\n        <span class=\"sr-only\">Toggle navigation</span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n      </button>\n      <a class=\"navbar-brand\" href=\"#\">Desk</a>\n    </div>\n    <div class=\"collapse navbar-collapse\">\n      <ul class=\"nav navbar-nav\">\n        <li class=\"active\"><a href=\"#\">Home</a></li>\n        <li><a href=\"#about\">About</a></li>\n        <li><a href=\"#contact\">Contact</a></li>\n      </ul>\n    </div>\n  </div>\n</div>";
  })
;

},{}]},{},[5])